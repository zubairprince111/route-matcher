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

        const res = await fetch(`${SUPABASE_URL}/rest/v1/local_fare_reports?select=*&order=posted_at.desc&limit=${limit}&offset=${offset}`, {
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

        if (!body.fromArea || !body.toArea || !body.vehicleType || !body.price) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        const res = await fetch(`${SUPABASE_URL}/rest/v1/local_fare_reports`, {
            method: "POST",
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },
            body: JSON.stringify({
                from_area: body.fromArea,
                to_area: body.toArea,
                vehicle_type: body.vehicleType,
                price: body.price,
                description: body.description,
                phone: body.phone
            })
        });

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
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

        return new Response(JSON.stringify(responseData), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
