export async function onRequestPost(context: any) {
    const { request, env } = context;
    const SUPABASE_URL = env.SUPABASE_URL;
    const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        return new Response(JSON.stringify({ error: "Supabase credentials not configured." }), { status: 500 });
    }

    try {
        const body = await request.json();
        const { item_id, item_type, vote_type } = body;

        if (!item_id || !item_type || !vote_type) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        if (!['fare_report', 'local_fare_report'].includes(item_type)) {
            return new Response(JSON.stringify({ error: "Invalid item_type" }), { status: 400 });
        }

        if (!['upvote', 'downvote'].includes(vote_type)) {
            return new Response(JSON.stringify({ error: "Invalid vote_type" }), { status: 400 });
        }

        // Get accurate IP address from Cloudflare header
        const user_ip = request.headers.get("CF-Connecting-IP") ||
            request.headers.get("x-forwarded-for")?.split(',')[0]?.trim() ||
            "unknown-ip";

        // 1. Record the vote (enforces UNIQUE(item_id, user_identifier) constraint)
        const voteRes = await fetch(`${SUPABASE_URL}/rest/v1/votes`, {
            method: "POST",
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },
            body: JSON.stringify({
                item_id,
                item_type,
                user_identifier: user_ip,
                vote_type
            })
        });

        if (!voteRes.ok) {
            const errorText = await voteRes.text();
            if (errorText.includes("23505") || errorText.includes("duplicate key")) {
                return new Response(JSON.stringify({ error: "You have already voted on this item." }), { status: 400 });
            }
            throw new Error(`Vote record failed: ${errorText}`);
        }

        // 2. Increment the counter on the target table (ensures snake_case)
        const tableName = item_type === 'fare_report' ? 'fare_reports' : 'local_fare_reports';
        const columnToUpdate = vote_type === 'upvote' ? 'upvotes' : 'downvotes';

        const getRes = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?id=eq.${item_id}&select=${columnToUpdate}`, {
            headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        });

        if (!getRes.ok) throw new Error("Failed to fetch current vote count");
        const currentData = await getRes.json();

        if (!currentData || currentData.length === 0) {
            return new Response(JSON.stringify({ error: "Item not found" }), { status: 404 });
        }

        const newValue = (currentData[0][columnToUpdate] || 0) + 1;

        const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?id=eq.${item_id}`, {
            method: "PATCH",
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ [columnToUpdate]: newValue })
        });

        if (!patchRes.ok) throw new Error("Failed to update vote count");

        return new Response(JSON.stringify({ success: true, message: "Vote counted" }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
