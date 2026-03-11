export async function onRequestGet(context: any) {
    const { env, request } = context;
    const url = new URL(request.url);
    const transportType = url.searchParams.get("transport_type") || "";
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    const SUPABASE_URL = env.SUPABASE_URL;
    const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        return new Response(JSON.stringify({ error: "Supabase credentials not configured." }), { status: 500 });
    }

    try {
        let fetchUrl = `${SUPABASE_URL}/rest/v1/fare_reports?select=*&order=created_at.desc&limit=${limit}&offset=${offset}`;
        if (transportType) {
            fetchUrl += `&transport_type=eq.${transportType}`;
        }

        const res = await fetch(fetchUrl, {
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

        if (!body.fromCity || !body.toCity || !body.transportType || !body.fare) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        const res = await fetch(`${SUPABASE_URL}/rest/v1/fare_reports`, {
            method: "POST",
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },
            body: JSON.stringify({
                from_city: body.fromCity,
                to_city: body.toCity,
                transport_type: body.transportType,
                fare: body.fare,
                company_name: body.companyName,
                seat_class: body.seatClass
            })
        });

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
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

        return new Response(JSON.stringify(responseData), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
