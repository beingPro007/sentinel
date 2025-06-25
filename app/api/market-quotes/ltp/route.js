import { fetchMarketQuote } from "../../controllers/marketQuotes.controller.js";

export async function GET(req) {
    const url = new URL(req.url);

    const result = await fetchMarketQuote("ltp", [
        "NSE_INDEX|Nifty 50",
        "NSE_INDEX|Bank Nifty",
    ]);
      

    return new Response(
        JSON.stringify(result.error || result.data),
        { status: result.status }
    );
}
