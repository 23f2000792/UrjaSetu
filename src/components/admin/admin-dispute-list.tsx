

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timestamp } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Gavel } from "lucide-react";
import Link from "next/link";

export interface Dispute {
  id: string;
  userId: string;
  userEmail: string;
  transactionId: string;
  details: string;
  status: 'New' | 'Under Review' | 'Resolved' | 'Closed';
  createdAt: Timestamp;
}

interface AdminDisputeListProps {
  disputes: Dispute[];
  loading: boolean;
}

export function AdminDisputeList({ disputes, loading }: AdminDisputeListProps) {
    const formatDate = (timestamp: Timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }

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
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : disputes.length > 0 ? (
                            disputes.map((dispute) => (
                                <TableRow key={dispute.id}>
                                    <TableCell className="font-medium">{dispute.id.substring(0, 8)}...</TableCell>
                                    <TableCell>{dispute.userEmail}</TableCell>
                                    <TableCell className="text-muted-foreground font-mono text-xs">{dispute.transactionId}</TableCell>
                                    <TableCell>
                                        <Badge variant={dispute.status === 'New' ? 'destructive' : 'outline'}>
                                            {dispute.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDate(dispute.createdAt)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/disputes/${dispute.id}`}>Review Case</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                           <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Gavel className="h-8 w-8" />
                                        No open disputes found.
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
