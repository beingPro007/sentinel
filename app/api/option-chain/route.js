import axios from 'axios';

export async function GET(request) {
  const accessToken = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!accessToken) {
    return new Response(JSON.stringify({ error: "Missing authorization header" }), { status: 401 });
  }

  try {
    const response = await axios.get("https://api.upstox.com/v2/option/chain", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      params: {
        instrument_key: "NSE_INDEX|Nifty 50",
        expiry_date: "2025-07-10",
      }
    });    
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Upstox error:", err.response?.data || err.message);
    return new Response(JSON.stringify(err.response?.data || { message: err.message }), {
      status: err.response?.status || 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
