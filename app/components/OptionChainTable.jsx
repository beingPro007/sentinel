"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const formatNumber = (num) => {
  if (!num && num !== 0) return "-";
  if (num >= 10000000) return (num / 10000000).toFixed(1) + "Cr";
  if (num >= 100000) return (num / 100000).toFixed(1) + "L";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toLocaleString("en-IN");
};

const formatPrice = (price) =>
  price !== undefined && price !== null ? price.toFixed(2) : "-";

const getChangeColor = (value) => {
  if (value > 0) return "text-green-400";
  if (value < 0) return "text-red-400";
  return "text-white";
};

const OptionsChainTable = ({ data, spotPrice }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-4 text-center text-slate-400">
        No options data available.
      </div>
    );
  }

  // Determine ATM strike
  const allStrikes = data.map((row) => row.strike_price);
  const closestStrike = allStrikes.reduce((prev, curr) =>
    Math.abs(curr - spotPrice) < Math.abs(prev - spotPrice) ? curr : prev
  );

  return (
    <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-700 bg-slate-800 text-xs">
            <TableHead className="sticky top-0 bg-slate-800 z-10 text-yellow-300 text-center">
              Offer
            </TableHead>
            <TableHead className="sticky top-0 bg-slate-800 z-10 text-center">
              Int Val F
            </TableHead>
            <TableHead className="sticky top-0 bg-slate-800 z-10 text-center">
              Int Val S
            </TableHead>
            <TableHead className="sticky top-0 bg-slate-800 z-10 text-center">
              Time Val
            </TableHead>
            <TableHead className="sticky top-0 bg-slate-800 z-10 text-center">
              Breakeven(%)
            </TableHead>
            <TableHead className="sticky top-0 bg-slate-800 z-10 text-center">
              LTP Chg
            </TableHead>
            <TableHead className="sticky top-0 bg-slate-800 z-10 text-center">
              LTP(%)
            </TableHead>
            <TableHead className="sticky top-0 bg-slate-700 z-10 text-white text-center">
              Strike
            </TableHead>
            <TableHead className="sticky top-0 bg-slate-800 z-10 text-center">
              LTP(%)
            </TableHead>
            <TableHead className="sticky top-0 bg-slate-800 z-10 text-center">
              LTP Chg
            </TableHead>
            <TableHead className="sticky top-0 bg-slate-800 z-10 text-center">
              Breakeven(%)
            </TableHead>
            <TableHead className="sticky top-0 bg-slate-800 z-10 text-center">
              Time Val
            </TableHead>
            <TableHead className="sticky top-0 bg-slate-800 z-10 text-center">
              Int Val S
            </TableHead>
            <TableHead className="sticky top-0 bg-slate-800 z-10 text-center">
              Int Val F
            </TableHead>
            <TableHead className="sticky top-0 bg-slate-800 z-10 text-green-300 text-center">
              Offer
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row) => {
            const strike = row.strike_price;
            const spot = row.underlying_spot_price;

            const call = row.call_options?.market_data ?? {};
            const callLtp = call.ltp ?? 0;
            const callChange = callLtp - (call.close_price ?? 0);
            const callChangePercent = call.close_price
              ? (callChange / call.close_price) * 100
              : 0;

            const put = row.put_options?.market_data ?? {};
            const putLtp = put.ltp ?? 0;
            const putChange = putLtp - (put.close_price ?? 0);
            const putChangePercent = put.close_price
              ? (putChange / put.close_price) * 100
              : 0;

            const futuresPrice = callLtp - putLtp + strike;

            const callIntrinsicFut = Math.max(futuresPrice - strike, 0);
            const callIntrinsicSpot = Math.max(spot - strike, 0);
            const callTimeValue = callLtp - callIntrinsicFut;
            const callBreakeven = strike + callTimeValue;
            const callBEPPercent = ((callBreakeven - spot) / spot) * 100;

            const putIntrinsicFut = Math.max(strike - futuresPrice, 0);
            const putIntrinsicSpot = Math.max(strike - spot, 0);
            const putTimeValue = putLtp - putIntrinsicFut;
            const putBreakeven = strike - putTimeValue;
            const putBEPPercent = ((putBreakeven - spot) / spot) * 100;

            const isATM = strike === closestStrike;

            return (
              <TableRow
                key={strike}
                className={`border-slate-700 text-xs hover:bg-slate-950 ${
                  isATM ? "bg-slate-700/50 font-bold" : ""
                }`}
              >
                {/* CALL SIDE */}
                <TableCell className="text-yellow-300 text-center">
                  {formatPrice(call.ask_price)}
                </TableCell>
                <TableCell className="text-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{formatPrice(callIntrinsicFut)}</span>
                    </TooltipTrigger>
                    <TooltipContent>Futures Based</TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="text-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{formatPrice(callIntrinsicSpot)}</span>
                    </TooltipTrigger>
                    <TooltipContent>Spot Based</TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="text-center">
                  {formatPrice(callTimeValue)}
                </TableCell>
                <TableCell className="text-center">
                  {formatPrice(callBreakeven)}
                  <br />
                  <span className={getChangeColor(callBEPPercent)}>
                    ({callBEPPercent.toFixed(1)}%)
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className={getChangeColor(callChange)}>
                    {formatPrice(callChange)}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className={getChangeColor(callChangePercent)}>
                    {callLtp} ({callChangePercent.toFixed(1)}%)
                  </span>
                </TableCell>

                {/* STRIKE PRICE */}
                <TableCell className="text-center bg-slate-700 text-white">
                  <div className="flex justify-center items-center gap-1">
                    {strike}
                    {isATM && (
                      <Badge
                        variant="outline"
                        className="text-green-400 border-green-400 text-[10px] px-1.5 py-0.5 rounded-sm"
                      >
                        ATM
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* PUT SIDE */}
                <TableCell className="text-center">
                  <span className={getChangeColor(putChangePercent)}>
                    {putLtp} ({putChangePercent.toFixed(1)}%)
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className={getChangeColor(putChange)}>
                    {formatPrice(putChange)}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {formatPrice(putBreakeven)}
                  <br />
                  <span className={getChangeColor(putBEPPercent)}>
                    ({putBEPPercent.toFixed(1)}%)
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {formatPrice(putTimeValue)}
                </TableCell>
                <TableCell className="text-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{formatPrice(putIntrinsicSpot)}</span>
                    </TooltipTrigger>
                    <TooltipContent>Spot Based</TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="text-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{formatPrice(putIntrinsicFut)}</span>
                    </TooltipTrigger>
                    <TooltipContent>Futures Based</TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="text-center text-green-300">
                  {formatPrice(put.ask_price)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default OptionsChainTable;
