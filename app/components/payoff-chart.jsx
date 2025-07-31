"use client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ZoomOut } from "lucide-react"
import { Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Bar, ComposedChart } from "recharts"


export default function PayoffChart({ trades, currentPrice }) {
  const generatePayoffData = () => {
    const data = []
    const priceRange = { min: currentPrice - 1000, max: currentPrice + 1000 }
    const step = 50

    for (let price = priceRange.min; price <= priceRange.max; price += step) {
      let totalPL = 0
      let callOI = 0
      let putOI = 0

      trades.forEach((trade) => {
        if (!trade.selected) return

        let optionValue = 0
        if (trade.optionType === "CE") {
          optionValue = Math.max(0, price - trade.strike)
          callOI += trade.lots * 50 // Assuming lot size of 50
        } else {
          optionValue = Math.max(0, trade.strike - price)
          putOI += trade.lots * 50
        }

        const premium = trade.price * trade.lots * 50
        const currentValue = optionValue * trade.lots * 50

        if (trade.type === "B") {
          totalPL += currentValue - premium
        } else {
          totalPL += premium - currentValue
        }
      })

      data.push({
        price,
        pl: totalPL,
        callOI: Math.random() * 1000 + 500, // Demo data
        putOI: Math.random() * 1000 + 500, // Demo data
      })
    }

    return data
  }

  const payoffData = generatePayoffData()

  return (
    <div className="space-y-4">
      {/* Chart Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Select defaultValue="sd-fixed">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sd-fixed">SD Fixed</SelectItem>
                <SelectItem value="price-fixed">Price Fixed</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="open-interest">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open-interest">Open Interest</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ZoomOut className="w-4 h-4" />
            Zoom Out
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Call OI 24.38L</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Put OI 24.18L</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-green-600"></div>
          <span>On Expiry</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-blue-600"></div>
          <span>On Target Date</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={payoffData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="price"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#666" }}
              domain={["dataMin", "dataMax"]}
            />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#666" }}
            />

            {/* Open Interest Bars */}
            <Bar yAxisId="right" dataKey="callOI" fill="#ef4444" opacity={0.6} />
            <Bar yAxisId="right" dataKey="putOI" fill="#22c55e" opacity={0.6} />

            {/* P&L Lines */}
            <Line yAxisId="left" type="monotone" dataKey="pl" stroke="#22c55e" strokeWidth={3} dot={false} />

            {/* Current Price Line */}
            <ReferenceLine
              x={currentPrice}
              stroke="#666"
              strokeDasharray="2 2"
              label={{ value: `Current: ${currentPrice}`, position: "top" }}
            />

            {/* Zero P&L Line */}
            <ReferenceLine yAxisId="left" y={0} stroke="#000" strokeWidth={1} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Info */}
      <div className="text-sm text-gray-600">
        OI data at {currentPrice} • Current price: {currentPrice}
      </div>
    </div>
  )
}
