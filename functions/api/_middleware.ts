export const onRequest: PagesFunction<{ VITE_API_KEY: string }> = async (context) => {
    const { request, env, next } = context;

    // Skip check for OPTIONS (CORS)
    if (request.method === "OPTIONS") {
        return next();
    }

    const apiKey = request.headers.get("x-api-key");
    const validKey = env.VITE_API_KEY;

    if (!validKey) {
        // If not configured, allow but warn in logs (dev mode fallback)
        console.warn("VITE_API_KEY not configured in environment");
        return next();
    }

    if (apiKey !== validKey) {
        return new Response(JSON.stringify({ error: "Unauthorized: Invalid API Key" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    return next();
};
