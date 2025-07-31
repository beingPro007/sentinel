import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function GreeksTable({ trades }) {
  // Generate Greeks data (simplified for demo)
  const generateGreeksData = () => {
    return trades
      .filter((trade) => trade.selected)
      .map((trade) => ({
        ...trade,
        delta: (Math.random() * 0.8 + 0.1).toFixed(3),
        gamma: (Math.random() * 0.01).toFixed(4),
        theta: (-Math.random() * 10).toFixed(2),
        vega: (Math.random() * 20).toFixed(2),
        iv: (Math.random() * 30 + 15).toFixed(1),
      }))
  }

  const greeksData = generateGreeksData()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Greeks Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Delta</TableHead>
              <TableHead>Gamma</TableHead>
              <TableHead>Theta</TableHead>
              <TableHead>Vega</TableHead>
              <TableHead>IV (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {greeksData.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={trade.type === "B" ? "default" : "destructive"}>{trade.type}</Badge>
                    <span className="text-sm">
                      {trade.strike} {trade.optionType}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-mono">{trade.delta}</TableCell>
                <TableCell className="font-mono">{trade.gamma}</TableCell>
                <TableCell className="font-mono text-red-600">{trade.theta}</TableCell>
                <TableCell className="font-mono">{trade.vega}</TableCell>
                <TableCell className="font-mono">{trade.iv}%</TableCell>
              </TableRow>
            ))}
            {greeksData.length > 1 && (
              <TableRow className="border-t-2 font-semibold bg-gray-50">
                <TableCell>Net Portfolio</TableCell>
                <TableCell className="font-mono">
                  {greeksData.reduce((sum, trade) => sum + Number.parseFloat(trade.delta), 0).toFixed(3)}
                </TableCell>
                <TableCell className="font-mono">
                  {greeksData.reduce((sum, trade) => sum + Number.parseFloat(trade.gamma), 0).toFixed(4)}
                </TableCell>
                <TableCell className="font-mono text-red-600">
                  {greeksData.reduce((sum, trade) => sum + Number.parseFloat(trade.theta), 0).toFixed(2)}
                </TableCell>
                <TableCell className="font-mono">
                  {greeksData.reduce((sum, trade) => sum + Number.parseFloat(trade.vega), 0).toFixed(2)}
                </TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
