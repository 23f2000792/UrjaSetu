import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const activities = [
  { id: 1, type: "Buy", asset: "Mojave Solar Park Tokens", amount: "+ 100", value: "$120.00", status: "Completed" },
  { id: 2, type: "Sell", asset: "Rooftop Revolution ECTs", amount: "- 50", value: "$9.00", status: "Pending" },
  { id: 3, type: "Staked", asset: "URJA", amount: "1,000", value: "$500.00", status: "Completed" },
  { id: 4, type: "Reward", asset: "Staking Rewards", amount: "+ 5 URJA", value: "$2.50", status: "Completed" },
  { id: 5, type: "Buy", asset: "Thar Desert Array ECTs", amount: "+ 500", value: "$60.00", status: "Completed" },
]

export default function RecentActivity() {
  return (
    <ScrollArea className="h-[300px]">
        <Table>
        <TableBody>
            {activities.map((activity) => (
            <TableRow key={activity.id}>
                <TableCell>
                    <div className="font-medium">{activity.asset}</div>
                    <div className="text-sm text-muted-foreground">{activity.type}</div>
                </TableCell>
                <TableCell className="text-right">
                    <div className={`font-medium ${activity.amount.startsWith('+') ? 'text-primary' : activity.amount.startsWith('-') ? 'text-destructive' : ''}`}>{activity.amount}</div>
                    <div className="text-sm text-muted-foreground">{activity.value}</div>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </ScrollArea>
  )
}
