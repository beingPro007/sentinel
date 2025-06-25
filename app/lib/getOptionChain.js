import axios from "axios";

export const getOptionChain = async (accessToken, symbol = "NIFTY") => {
  // Fetch all instrument tokens
  const instrumentsRes = await axios.get(
    "https://api.upstox.com/v2/market/instruments",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  const instruments = instrumentsRes.data.data;

  // Filter for NIFTY options only, weekly expiry
  const niftyOptions = instruments.filter(
    (i) =>
      i.exchange === "NSE_FO" &&
      i.symbol.includes(symbol) &&
      i.instrument_type === "OPTIDX"
  );

  // Take 20 strikes around ATM for demo
  const sorted = niftyOptions.sort((a, b) => a.strike_price - b.strike_price);
  const mid = Math.floor(sorted.length / 2);
  const selection = sorted.slice(mid - 10, mid + 10);

  // Prepare instrument tokens for LTP fetch
  const instrumentIds = selection.map((i) => `${i.exchange}|${i.token}`);

  // LTP fetch
  const ltpRes = await axios.get("https://api.upstox.com/v2/market-quote/ltp", {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { instruments: instrumentIds.join(",") },
  });

  return {
    options: selection,
    ltpData: ltpRes.data.data,
  };
};
