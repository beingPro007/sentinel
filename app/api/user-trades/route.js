// /api/user-trades - GET returns the user's current trades (mocked for now)

export async function GET(request) {
  // In a real app, fetch from DB or user session
  const trades = [
    {
      id: "1",
      type: "B",
      expiry: "10 Jul",
      strike: 25450,
      optionType: "CE",
      lots: 1,
      price: 150.5,
      selected: true,
    },
    {
      id: "2",
      type: "S",
      expiry: "10 Jul",
      strike: 25650,
      optionType: "CE",
      lots: 1,
      price: 68.1,
      selected: true,
    },
  ];
  return new Response(JSON.stringify(trades), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
