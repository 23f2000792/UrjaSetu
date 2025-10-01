
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { type Transaction } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "lucide-react";

interface RecentActivityProps {
    activities: Transaction[];
    loading: boolean;
}

export default function RecentActivity({ activities, loading }: RecentActivityProps) {
  return (
    <ScrollArea className="h-[300px]">
        <Table>
            <TableBody>
                {loading ? (
                    Array.from({length: 3}).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <Skeleton className="h-5 w-24 mb-1" />
                                <Skeleton className="h-4 w-12" />
                            </TableCell>
                            <TableCell className="text-right">
                                <Skeleton className="h-5 w-16 ml-auto mb-1" />
                                <Skeleton className="h-4 w-20 ml-auto" />
                            </TableCell>
                        </TableRow>
                    ))
                ) : activities.length > 0 ? (
                    activities.map((activity) => (
                        <TableRow key={activity.id}>
                            <TableCell>
                                <div className="font-medium">{activity.projectName}</div>
                                <div className="text-sm text-muted-foreground">{activity.type}</div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className={`font-medium ${activity.type === 'Buy' ? 'text-primary' : 'text-destructive'}`}>
                                    {activity.type === 'Buy' ? '+' : '-'} {activity.quantity}
                                </div>
                                <div className="text-sm text-muted-foreground">Rs. {activity.totalCost.toFixed(2)}</div>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={2} className="h-24 text-center">
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <Activity className="h-8 w-8" />
                                No recent activity.
                            </div>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </ScrollArea>
  )
}

    