

const CORS_HEADERS = [
    { name: 'Access-Control-Allow-Origin', value: '*' },
    { name: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
    { name: 'Access-Control-Allow-Headers', value: 'Content-Type, x-api-key' },
    { name: 'Content-Type', value: 'application/json' },
];

function setCors(res: any) {
    CORS_HEADERS.forEach(h => res.setHeader(h.name, h.value));
}

export default async function handler(req: any, res: any) {
    if (req.method === 'OPTIONS') {
        setCors(res);
        return res.status(200).end();
    }
    if (req.method !== 'POST') {
        setCors(res);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        setCors(res);
        return res.status(500).json({ error: 'Supabase credentials not configured.' });
    }

    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.VITE_API_KEY) {
        setCors(res);
        return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
    }

    try {
        const body = req.body;
        const { item_id, item_type, vote_type } = body;

        if (!item_id || !item_type || !vote_type) {
            setCors(res);
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!['fare_report', 'local_fare_report'].includes(item_type)) {
            setCors(res);
            return res.status(400).json({ error: 'Invalid item_type' });
        }

        if (!['upvote', 'downvote'].includes(vote_type)) {
            setCors(res);
            return res.status(400).json({ error: 'Invalid vote_type' });
        }

        // Get user IP from Cloudflare header (preferred) or x-forwarded-for
        const user_ip =
            (req.headers['cf-connecting-ip'] as string) ||
            (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
            'unknown-ip';

        // 1. Record the vote (enforces UNIQUE constraint)
        const voteRes = await fetch(`${SUPABASE_URL}/rest/v1/votes`, {
            method: 'POST',
            headers: {
                apikey: SUPABASE_KEY,
                Authorization: `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                Prefer: 'return=representation',
            },
            body: JSON.stringify({ item_id, item_type, user_identifier: user_ip, vote_type }),
        });

        if (!voteRes.ok) {
            const errorText = await voteRes.text();
            if (errorText.includes('23505') || errorText.includes('duplicate key')) {
                setCors(res);
                return res.status(400).json({ error: 'You have already voted on this item.' });
            }
            throw new Error(`Vote record failed: ${errorText}`);
        }

        // 2. Increment the counter
        const tableName = item_type === 'fare_report' ? 'fare_reports' : 'local_fare_reports';
        const columnToUpdate = vote_type === 'upvote' ? 'upvotes' : 'downvotes';

        const getRes = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?id=eq.${item_id}&select=${columnToUpdate}`, {
            headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        });

        if (!getRes.ok) throw new Error('Failed to fetch current vote count');
        const currentData = await getRes.json();

        if (!currentData || currentData.length === 0) {
            setCors(res);
            return res.status(404).json({ error: 'Item not found' });
        }

        const newValue = (currentData[0][columnToUpdate] || 0) + 1;

        const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?id=eq.${item_id}`, {
            method: 'PATCH',
            headers: {
                apikey: SUPABASE_KEY,
                Authorization: `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ [columnToUpdate]: newValue }),
        });

        if (!patchRes.ok) throw new Error('Failed to update vote count');

        setCors(res);
        return res.status(200).json({ success: true, message: 'Vote counted' });

    } catch (e: any) {
        setCors(res);
        return res.status(500).json({ error: e.message });
    }
}
