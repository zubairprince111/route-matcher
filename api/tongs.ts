

const CORS_HEADERS = [
    { name: 'Access-Control-Allow-Origin', value: '*' },
    { name: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
    { name: 'Access-Control-Allow-Headers', value: 'Content-Type' },
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
        if (req.method === 'GET') {
            const url = new URL(req.url!, `http://${req.headers.host}`);
            const limit = parseInt(url.searchParams.get('limit') || '20');
            const offset = parseInt(url.searchParams.get('offset') || '0');

            const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/tongs?select=*&order=created_at.desc&limit=${limit}&offset=${offset}`, {
                headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
            });
            if (!supaRes.ok) throw new Error(await supaRes.text());
            const data = await supaRes.json();

            // Map snake_case from DB to camelCase for Frontend
            const mappedData = data.map((t: any) => ({
                id: t.id,
                name: t.name,
                lat: t.lat,
                lng: t.lng,
                openTime: t.open_time,
                closeTime: t.close_time,
                description: t.description,
                rating: t.rating,
                type: t.type,
                address: t.address,
                createdAt: t.created_at
            }));

            setCors(res);
            return res.status(200).json(mappedData);

        } else if (req.method === 'POST') {
            const body = req.body;
            if (!body.name || !body.lat || !body.lng || !body.openTime || !body.closeTime || !body.type) {
                setCors(res);
                return res.status(400).json({ error: 'Missing required fields' });
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
                    open_time: body.openTime,
                    close_time: body.closeTime,
                    description: body.description,
                    rating: body.rating || 4.0,
                    type: body.type,
                    address: body.address,
                }),
            });

            if (!supaRes.ok) throw new Error(await supaRes.text());
            const data = await supaRes.json();
            const t = data[0];

            // Map back to camelCase for frontend response
            const responseData = {
                id: t.id,
                name: t.name,
                lat: t.lat,
                lng: t.lng,
                openTime: t.open_time,
                closeTime: t.close_time,
                description: t.description,
                rating: t.rating,
                type: t.type,
                address: t.address,
                createdAt: t.created_at
            };

            setCors(res);
            return res.status(201).json(responseData);

        } else {
            setCors(res);
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (e: any) {
        setCors(res);
        return res.status(500).json({ error: e.message });
    }
}
