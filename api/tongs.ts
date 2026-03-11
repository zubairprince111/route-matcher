

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
};

export default async function handler(req: any, res: any) {
    if (req.method === 'OPTIONS') return res.status(200).setHeaders(CORS_HEADERS).end();

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        return res.status(500).setHeaders(CORS_HEADERS).json({ error: 'Supabase credentials not configured.' });
    }

    try {
        if (req.method === 'GET') {
            const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/tongs?select=*&order=created_at.desc`, {
                headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
            });
            if (!supaRes.ok) throw new Error(await supaRes.text());
            const data = await supaRes.json();
            return res.status(200).setHeaders(CORS_HEADERS).json(data);

        } else if (req.method === 'POST') {
            const body = req.body;
            if (!body.name || !body.lat || !body.lng || !body.openTime || !body.closeTime || !body.type) {
                return res.status(400).setHeaders(CORS_HEADERS).json({ error: 'Missing required fields' });
            }

            const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/tongs`, {
                method: 'POST',
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    Prefer: 'return=representation',
                },
                body: JSON.stringify({
                    name: body.name,
                    lat: body.lat,
                    lng: body.lng,
                    openTime: body.openTime,
                    closeTime: body.closeTime,
                    description: body.description,
                    rating: body.rating || 4.0,
                    type: body.type,
                    address: body.address,
                }),
            });

            if (!supaRes.ok) throw new Error(await supaRes.text());
            const data = await supaRes.json();
            return res.status(201).setHeaders(CORS_HEADERS).json(data[0]);

        } else {
            return res.status(405).setHeaders(CORS_HEADERS).json({ error: 'Method not allowed' });
        }
    } catch (e: any) {
        return res.status(500).setHeaders(CORS_HEADERS).json({ error: e.message });
    }
}
