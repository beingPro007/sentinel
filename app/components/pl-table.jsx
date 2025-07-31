import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


export default function PLTable({ trades, currentPrice }) {
  // Generate P&L data for different price levels
  const generatePLData = () => {
    const pricePoints = [
      currentPrice - 400,
      currentPrice - 200,
      currentPrice - 100,
      currentPrice,
      currentPrice + 100,
      currentPrice + 200,
      currentPrice + 400,
    ]

    return pricePoints.map((price) => {
      let totalPL = 0

      trades.forEach((trade) => {
        if (!trade.selected) return

        let optionValue = 0
        if (trade.optionType === "CE") {
          optionValue = Math.max(0, price - trade.strike)
        } else {
          optionValue = Math.max(0, trade.strike - price)
        }

        const premium = trade.price * trade.lots * 50
        const currentValue = optionValue * trade.lots * 50

        if (trade.type === "B") {
          totalPL += currentValue - premium
        } else {
          totalPL += premium - currentValue
        }
      })

      return {
        price,
        pl: totalPL,
        plPercent: ((totalPL / 10000) * 100), // Simplified percentage calculation
      }
    })
  }

  const plData = generatePLData()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">P&L Table</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Price Level</TableHead>
              <TableHead>P&L (₹)</TableHead>
              <TableHead>P&L (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plData.map((row, index) => (
              <TableRow key={index} className={row.price === currentPrice ? "bg-blue-50" : ""}>
                <TableCell className="font-medium">
                  {row.price}
                  {row.price === currentPrice && " (Current)"}
                </TableCell>
                <TableCell className={row.pl >= 0 ? "text-green-600" : "text-red-600"}>
                  {row.pl >= 0 ? "+" : ""}
                  {row.pl.toLocaleString()}
                </TableCell>
                <TableCell className={row.pl >= 0 ? "text-green-600" : "text-red-600"}>
                  {row.pl >= 0 ? "+" : ""}
                  {row.plPercent}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
