

const CORS_HEADERS = [
    { name: 'Access-Control-Allow-Origin', value: '*' },
    { name: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
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

            const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/local_fare_reports?select=*&order=posted_at.desc&limit=${limit}&offset=${offset}`, {
                headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
            });
            if (!supaRes.ok) throw new Error(await supaRes.text());
            const data = await supaRes.json();

            // Map snake_case from DB to camelCase for Frontend
            const mappedData = data.map((t: any) => ({
                id: t.id,
                fromArea: t.from_area,
                toArea: t.to_area,
                vehicleType: t.vehicle_type,
                price: t.price,
                description: t.description,
                phone: t.phone,
                upvotes: t.upvotes,
                downvotes: t.downvotes,
                postedAt: t.posted_at
            }));

            setCors(res);
            return res.status(200).json(mappedData);

        } else if (req.method === 'POST') {
            const body = req.body;
            if (!body.fromArea || !body.toArea || !body.vehicleType || !body.price) {
                setCors(res);
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/local_fare_reports`, {
                method: 'POST',
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    Prefer: 'return=representation',
                },
                body: JSON.stringify({
                    from_area: body.fromArea,
                    to_area: body.toArea,
                    vehicle_type: body.vehicleType,
                    price: body.price,
                    description: body.description,
                    phone: body.phone,
                }),
            });

            if (!supaRes.ok) throw new Error(await supaRes.text());
            const data = await supaRes.json();

            if (!data || data.length === 0) {
                setCors(res);
                return res.status(201).json({ success: true, message: 'Local report added (representation restricted)' });
            }

            const t = data[0];

            // Map back to camelCase for frontend response
            const responseData = {
                id: t.id,
                fromArea: t.from_area,
                toArea: t.to_area,
                vehicleType: t.vehicle_type,
                price: t.price,
                description: t.description,
                phone: t.phone,
                upvotes: t.upvotes,
                downvotes: t.downvotes,
                postedAt: t.posted_at
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
