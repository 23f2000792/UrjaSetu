
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const disputes = [
  { id: 'DIS-004', user: 'SolarSeller1', transactionId: '0xdef...abc', status: 'New', createdAt: '2024-07-21' },
  { id: 'DIS-001', user: 'BuyerA', transactionId: '0xabc...def', status: 'Under Review', createdAt: '2024-07-20' },
  { id: 'DIS-005', user: 'BuyerB', transactionId: 'ORD-12345', status: 'New', createdAt: '2024-07-22' },
];

export function AdminDisputeList() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Open Disputes</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Case ID</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Transaction/Order ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date Filed</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {disputes.map((dispute) => (
                            <TableRow key={dispute.id}>
                                <TableCell className="font-medium">{dispute.id}</TableCell>
                                <TableCell>{dispute.user}</TableCell>
                                <TableCell className="text-muted-foreground font-mono text-xs">{dispute.transactionId}</TableCell>
                                <TableCell>
                                    <Badge variant={dispute.status === 'New' ? 'destructive' : 'outline'}>
                                        {dispute.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{dispute.createdAt}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm">Review Case</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
