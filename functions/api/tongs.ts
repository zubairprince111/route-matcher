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

        const res = await fetch(`${SUPABASE_URL}/rest/v1/tongs?select=*&order=created_at.desc&limit=${limit}&offset=${offset}`, {
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

        if (!body.name || !body.lat || !body.lng || !body.openTime || !body.closeTime || !body.type) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        const res = await fetch(`${SUPABASE_URL}/rest/v1/tongs`, {
            method: "POST",
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=representation"
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
                address: body.address
            })
        });

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
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

        return new Response(JSON.stringify(responseData), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
