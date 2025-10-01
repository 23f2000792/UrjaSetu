

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Timestamp } from 'firebase/firestore';
import { Skeleton } from "@/components/ui/skeleton";
import { Gavel } from "lucide-react";


export interface Dispute {
  id: string;
  transactionId: string;
  status: 'New' | 'Under Review' | 'Resolved' | 'Closed';
  createdAt: Timestamp;
}

interface UserDisputeListProps {
    disputes: Dispute[];
    loading: boolean;
}

export function UserDisputeList({ disputes, loading }: UserDisputeListProps) {

    const formatDate = (timestamp: Timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }

    const getBadgeVariant = (status: Dispute['status']) => {
        switch (status) {
            case 'New':
                return 'destructive';
            case 'Under Review':
                return 'outline';
            case 'Resolved':
                return 'secondary';
            default:
                return 'default';
        }
    }

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
                        {loading ? (
                             Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : disputes.length > 0 ? (
                            disputes.map((dispute) => (
                                <TableRow key={dispute.id}>
                                    <TableCell className="font-medium text-xs">{dispute.id.substring(0, 8)}...</TableCell>
                                    <TableCell className="text-muted-foreground font-mono text-xs">{dispute.transactionId}</TableCell>
                                    <TableCell>
                                        <Badge variant={getBadgeVariant(dispute.status)}
                                            className={dispute.status === 'Resolved' ? 'bg-primary/20 text-primary' : ''}>
                                            {dispute.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDate(dispute.createdAt)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm">View Details</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Gavel className="h-8 w-8" />
                                         You have not filed any disputes.
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
