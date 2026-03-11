

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

    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.VITE_API_KEY) {
        return res.status(401).setHeaders(CORS_HEADERS).json({ error: 'Unauthorized: Invalid API Key' });
    }

    try {
        if (req.method === 'GET') {
            const url = new URL(req.url!, `http://${req.headers.host}`);
            const transportType = url.searchParams.get('transport_type') || '';
            const limit = parseInt(url.searchParams.get('limit') || '20');
            const offset = parseInt(url.searchParams.get('offset') || '0');

            let fetchUrl = `${SUPABASE_URL}/rest/v1/fare_reports?select=*&order=created_at.desc&limit=${limit}&offset=${offset}`;
            if (transportType) fetchUrl += `&transport_type=eq.${transportType}`;

            const supaRes = await fetch(fetchUrl, {
                headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
            });
            if (!supaRes.ok) throw new Error(await supaRes.text());
            const data = await supaRes.json() as any[];

            // Map snake_case from DB to camelCase for Frontend
            const mappedData = data.map((t: any) => ({
                id: t.id,
                fromCity: t.from_city,
                toCity: t.to_city,
                transportType: t.transport_type,
                fare: t.fare,
                companyName: t.company_name,
                seatClass: t.seat_class,
                upvotes: t.upvotes,
                downvotes: t.downvotes,
                createdAt: t.created_at
            }));

            return res.status(200).setHeaders(CORS_HEADERS).json(mappedData);

        } else if (req.method === 'POST') {
            const body = req.body;
            if (!body.fromCity || !body.toCity || !body.transportType || !body.fare) {
                return res.status(400).setHeaders(CORS_HEADERS).json({ error: 'Missing required fields' });
            }

            const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/fare_reports`, {
                method: 'POST',
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    Prefer: 'return=representation',
                },
                body: JSON.stringify({
                    from_city: body.fromCity,
                    to_city: body.toCity,
                    transport_type: body.transportType,
                    fare: body.fare,
                    company_name: body.companyName,
                    seat_class: body.seatClass,
                }),
            });

            if (!supaRes.ok) throw new Error(await supaRes.text());
            const data = await supaRes.json();
            const t = data[0];

            // Map back to camelCase
            const responseData = {
                id: t.id,
                fromCity: t.from_city,
                toCity: t.to_city,
                transportType: t.transport_type,
                fare: t.fare,
                companyName: t.company_name,
                seatClass: t.seat_class,
                upvotes: t.upvotes,
                downvotes: t.downvotes,
                createdAt: t.created_at
            };

            return res.status(201).setHeaders(CORS_HEADERS).json(responseData);

        } else {
            return res.status(405).setHeaders(CORS_HEADERS).json({ error: 'Method not allowed' });
        }
    } catch (e: any) {
        return res.status(500).setHeaders(CORS_HEADERS).json({ error: e.message });
    }
}
