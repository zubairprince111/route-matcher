

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
    // Handle CORS preflight
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

            const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/tickets?select=*&order=posted_at.desc&limit=${limit}&offset=${offset}`, {
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`,
                },
            });

            if (!supaRes.ok) throw new Error(await supaRes.text());
            const data = await supaRes.json();

            // Map snake_case from DB to camelCase for Frontend
            const mappedData = data.map((t: any) => ({
                id: t.id,
                origin: t.origin,
                destination: t.destination,
                vehicleType: t.vehicle_type,
                operatorName: t.operator_name,
                price: t.price,
                description: t.description,
                phone: t.phone,
                postedAt: t.posted_at,
                reportCount: t.report_count,
                isFraud: t.is_fraud
            }));

            setCors(res);
            return res.status(200).json(mappedData);

        } else if (req.method === 'POST') {
            const body = req.body;

            if (!body.origin || !body.destination || !body.vehicleType || !body.price || !body.phone) {
                setCors(res);
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/tickets`, {
                method: 'POST',
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    Prefer: 'return=representation',
                },
                body: JSON.stringify({
                    origin: body.origin,
                    destination: body.destination,
                    vehicle_type: body.vehicleType,
                    operator_name: body.operatorName,
                    price: body.price,
                    description: body.description,
                    phone: body.phone,
                }),
            });

            if (!supaRes.ok) throw new Error(await supaRes.text());
            const data = await supaRes.json();

            if (!data || data.length === 0) {
                setCors(res);
                return res.status(201).json({ success: true, message: 'Ticket added (representation restricted)' });
            }

            const t = data[0];

            // Map back to camelCase for the frontend response
            const responseData = {
                id: t.id,
                origin: t.origin,
                destination: t.destination,
                vehicleType: t.vehicle_type,
                operatorName: t.operator_name,
                price: t.price,
                description: t.description,
                phone: t.phone,
                postedAt: t.posted_at,
                reportCount: t.report_count,
                isFraud: t.is_fraud
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
