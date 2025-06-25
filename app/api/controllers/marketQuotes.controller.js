import { cookies } from "next/headers";

export async function fetchMarketQuote(type = "ltp", instruments = []) {
    const accessToken = await cookies().get("access_token")?.value;

    if (!accessToken) {
        return {
            error: "Missing access token",
            status: 401,
        };
    }

    if (!instruments.length) {
        return {
            error: "No instruments provided",
            status: 400,
        };
    }

    const endpoint = `https://api.upstox.com/v2/market-quote/${type}`;
    const query = new URLSearchParams({
        instrument_key: instruments.join(","),
    });

    try {
        const res = await fetch(`${endpoint}?${query.toString()}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json",
            },
            cache: "no-store",
        });

        if (!res.ok) {
            const err = await res.json();
            return { error: err, status: res.status };
        }

        const json = await res.json();
        return { data: json.data, status: 200 };
    } catch (err) {
        return {
            error: err.message || "Fetch failed",
            status: 500,
        };
    }
}
