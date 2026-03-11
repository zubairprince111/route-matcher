export async function onRequestGet(context: any) {
    const { env, request } = context;
    const SUPABASE_URL = env.SUPABASE_URL;
    const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        return new Response(JSON.stringify({ error: "Supabase credentials not configured." }), { status: 500 });
    }

    try {
        const url = new URL(request.url);
        const limit = parseInt(url.searchParams.get('limit') || '20');
        const offset = parseInt(url.searchParams.get('offset') || '0');

        const res = await fetch(`${SUPABASE_URL}/rest/v1/tickets?select=*&order=posted_at.desc&limit=${limit}&offset=${offset}`, {
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`
            }
        });

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json() as any[];

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

        return new Response(JSON.stringify(mappedData), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}

export async function onRequestPost(context: any) {
    const { request, env } = context;
    const SUPABASE_URL = env.SUPABASE_URL;
    const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        return new Response(JSON.stringify({ error: "Supabase credentials not configured." }), { status: 500 });
    }

    try {
        const body = await request.json();

        if (!body.origin || !body.destination || !body.vehicleType || !body.price || !body.phone) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        const res = await fetch(`${SUPABASE_URL}/rest/v1/tickets`, {
            method: "POST",
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },
            body: JSON.stringify({
                origin: body.origin,
                destination: body.destination,
                vehicle_type: body.vehicleType,
                operator_name: body.operatorName,
                price: body.price,
                description: body.description,
                phone: body.phone
            })
        });

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
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

        return new Response(JSON.stringify(responseData), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
