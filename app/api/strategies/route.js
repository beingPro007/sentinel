export async function GET(request) {
  const strategies = [
    { name: "Buy Call", type: "bullish", description: "Bullish on direction" },
    { name: "Sell Put", type: "bullish", description: "Bullish with income" },
    { name: "Bull Call Spread", type: "bullish", description: "Limited risk bullish" },
    { name: "Bull Put Spread", type: "bullish", description: "Income with bullish bias" },
    { name: "Bear Put Spread", type: "bearish", description: "Limited risk bearish" },
    { name: "Bear Call Spread", type: "bearish", description: "Income with bearish bias" },
    { name: "Long Straddle", type: "neutral", description: "High volatility play" },
    { name: "Short Straddle", type: "neutral", description: "Low volatility play" },
    { name: "Iron Condor", type: "neutral", description: "Range bound strategy" },
    { name: "Butterfly", type: "neutral", description: "Neutral with limited risk" },
  ];
  return new Response(JSON.stringify(strategies), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
