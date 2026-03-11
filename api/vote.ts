

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
};

export default async function handler(req: any, res: any) {
    if (req.method === 'OPTIONS') return res.status(200).setHeaders(CORS_HEADERS).end();
    if (req.method !== 'POST') return res.status(405).setHeaders(CORS_HEADERS).json({ error: 'Method not allowed' });

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        return res.status(500).setHeaders(CORS_HEADERS).json({ error: 'Supabase credentials not configured.' });
    }

    try {
        const body = req.body;
        const { item_id, item_type, vote_type } = body;

        if (!item_id || !item_type || !vote_type) {
            return res.status(400).setHeaders(CORS_HEADERS).json({ error: 'Missing required fields' });
        }

        if (!['fare_report', 'local_fare_report'].includes(item_type)) {
            return res.status(400).setHeaders(CORS_HEADERS).json({ error: 'Invalid item_type' });
        }

        if (!['upvote', 'downvote'].includes(vote_type)) {
            return res.status(400).setHeaders(CORS_HEADERS).json({ error: 'Invalid vote_type' });
        }

        // Get user IP from Vercel headers
        const user_ip =
            (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
            req.socket.remoteAddress ||
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
                return res.status(400).setHeaders(CORS_HEADERS).json({ error: 'You have already voted on this item.' });
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
            return res.status(404).setHeaders(CORS_HEADERS).json({ error: 'Item not found' });
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

        return res.status(200).setHeaders(CORS_HEADERS).json({ success: true, message: 'Vote counted' });

    } catch (e: any) {
        return res.status(500).setHeaders(CORS_HEADERS).json({ error: e.message });
    }
}
