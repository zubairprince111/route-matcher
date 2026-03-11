import type { VercelRequest, VercelResponse } from '@vercel/node';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).setHeaders(CORS_HEADERS).end();
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        return res.status(500).setHeaders(CORS_HEADERS).json({ error: 'Supabase credentials not configured.' });
    }

    try {
        if (req.method === 'GET') {
            const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/tickets?select=*&order=created_at.desc`, {
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`,
                },
            });

            if (!supaRes.ok) throw new Error(await supaRes.text());
            const data = await supaRes.json();
            return res.status(200).setHeaders(CORS_HEADERS).json(data);

        } else if (req.method === 'POST') {
            const body = req.body;

            if (!body.origin || !body.destination || !body.vehicleType || !body.price || !body.phone) {
                return res.status(400).setHeaders(CORS_HEADERS).json({ error: 'Missing required fields' });
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
                    vehicleType: body.vehicleType,
                    operatorName: body.operatorName,
                    price: body.price,
                    description: body.description,
                    phone: body.phone,
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
