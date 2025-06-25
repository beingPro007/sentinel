"use client";

import { useEffect, useState } from "react";
import { CircleUser } from "lucide-react";
import axios from "axios";
import { useCookies } from "react-cookie";

export function TopNav() {
  const [cookies] = useCookies(["access_token"]);
  const [ltps, setLtps] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLTP = async () => {
      if (!cookies.access_token) return;

      try {
        const res = await axios.get("/api/market-quotes/ltp", {
          params: {
            instrument_key: "NSE_INDEX|Nifty 50,NSE_INDEX|Bank Nifty",
          },
        });

        if (res.data?.data) {
          setLtps(res.data.data);
        } else {
          console.warn("Unexpected API response:", res.data);
          setError("Invalid LTP data format");
        }
      } catch (err) {
        console.error("LTP fetch failed:", err);
        setError("Failed to fetch LTP data");
      }
    };

    fetchLTP();
    const interval = setInterval(fetchLTP, 15000);
    return () => clearInterval(interval);
  }, [cookies.access_token]);

  const nifty = ltps?.["NSE_INDEX:Nifty 50"]?.last_price ?? "...";
  const banknifty = ltps?.["NSE_INDEX:Bank Nifty"]?.last_price ?? "...";

  return (
    <header className="sticky top-0 z-50 bg-gray-900 w-full flex items-center justify-between px-6 py-4 border-b border-gray-800 text-sm">
      <div className="flex items-center gap-6 text-gray-200 font-medium flex-wrap">
        <span>
          NIFTY:{" "}
          <span className="font-semibold text-white">
            {nifty.toLocaleString("en-IN")}
          </span>
        </span>
        <span>
          BANKNIFTY:{" "}
          <span className="font-semibold text-white">
            {banknifty.toLocaleString("en-IN")}
          </span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <CircleUser className="text-gray-300" size={22} />
      </div>
    </header>
  );
}
