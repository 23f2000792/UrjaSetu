
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const userDisputes = [
  { id: 'DIS-001', transactionId: '0xabc...def', status: 'Under Review', createdAt: '2024-07-20' },
  { id: 'DIS-002', transactionId: 'ORD-54321', status: 'Resolved', createdAt: '2024-07-15' },
  { id: 'DIS-003', transactionId: '0x123...456', status: 'Closed', createdAt: '2024-07-10' },
];

export function UserDisputeList() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Disputes</CardTitle>
                <CardDescription>A history of your submitted disputes.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Case ID</TableHead>
                            <TableHead>Transaction/Order ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date Filed</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userDisputes.map((dispute) => (
                            <TableRow key={dispute.id}>
                                <TableCell className="font-medium">{dispute.id}</TableCell>
                                <TableCell className="text-muted-foreground font-mono text-xs">{dispute.transactionId}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        dispute.status === 'Under Review' ? 'outline' :
                                        dispute.status === 'Resolved' ? 'secondary' : 'default'
                                    } className={dispute.status === 'Resolved' ? 'bg-primary/20 text-primary' : ''}>
                                        {dispute.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{dispute.createdAt}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm">View Details</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 {userDisputes.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>You have not filed any disputes.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
