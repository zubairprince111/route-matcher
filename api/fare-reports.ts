import type { VercelRequest, VercelResponse } from '@vercel/node';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'OPTIONS') return res.status(200).setHeaders(CORS_HEADERS).end();

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        return res.status(500).setHeaders(CORS_HEADERS).json({ error: 'Supabase credentials not configured.' });
    }

    try {
        if (req.method === 'GET') {
            const url = new URL(req.url!, `http://${req.headers.host}`);
            const transportType = url.searchParams.get('transport_type') || '';

            let fetchUrl = `${SUPABASE_URL}/rest/v1/fare_reports?select=*&order=created_at.desc`;
            if (transportType) fetchUrl += `&transport_type=eq.${transportType}`;

            const supaRes = await fetch(fetchUrl, {
                headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
            });
            if (!supaRes.ok) throw new Error(await supaRes.text());
            const data = await supaRes.json();
            return res.status(200).setHeaders(CORS_HEADERS).json(data);

        } else if (req.method === 'POST') {
            const body = req.body;
            if (!body.from_city || !body.to_city || !body.transport_type || !body.fare) {
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
                    from_city: body.from_city,
                    to_city: body.to_city,
                    transport_type: body.transport_type,
                    fare: body.fare,
                    company_name: body.company_name,
                    seat_class: body.seat_class,
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
