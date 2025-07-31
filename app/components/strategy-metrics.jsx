import { Card, CardContent } from "@/components/ui/card"
import { Info, Settings } from "lucide-react"

export default function StrategyMetrics({ trades, currentPrice }) {
  // Calculate strategy metrics (simplified calculations for demo)
  const maxProfit = 8820
  const maxLoss = -6180
  const rewardRisk = 1.4
  const pop = 43
  const timeValue = 4034
  const intrinsicValue = 2146
  const fundsNeeded = 49581
  const marginNeeded = 44474
  const marginAvailable = -266
  const breakeven = 25532

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                Max Profit
                <Info className="w-3 h-3" />
              </div>
              <div className="text-lg font-semibold text-green-600">+{maxProfit.toLocaleString()}(+20%)</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                Max Loss
                <Info className="w-3 h-3" />
              </div>
              <div className="text-lg font-semibold text-red-600">{maxLoss.toLocaleString()}(-14%)</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                Reward / Risk
                <Info className="w-3 h-3" />
              </div>
              <div className="text-lg font-semibold">{rewardRisk}x</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                POP
                <Info className="w-3 h-3" />
              </div>
              <div className="text-lg font-semibold">{pop}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Details */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                Time Value
                <Info className="w-3 h-3" />
              </div>
              <div className="text-lg font-semibold">{timeValue.toLocaleString()}</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                Intrinsic Value
                <Info className="w-3 h-3" />
              </div>
              <div className="text-lg font-semibold">{intrinsicValue.toLocaleString()}</div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Breakeven</span>
                <span className="text-sm text-gray-600">Target</span>
                <span className="text-sm text-gray-600">Expiry</span>
                <Info className="w-3 h-3 text-gray-400" />
              </div>
              <div className="text-lg font-semibold">{breakeven} (+0.3%)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Funds & Margins */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Funds & Margins</span>
            <Settings className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                Funds Needed
                <Info className="w-3 h-3" />
              </div>
              <div className="font-semibold">{fundsNeeded.toLocaleString()}</div>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                Margin Needed
                <Info className="w-3 h-3" />
              </div>
              <div className="font-semibold">{marginNeeded.toLocaleString()}</div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Margin Available</span>
              <div className="font-semibold text-red-600">{marginAvailable}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
