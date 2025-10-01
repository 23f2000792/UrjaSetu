
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import type { GovernanceProposal } from '@/lib/mock-data';


export default function StakingPage() {
  const [proposals, setProposals] = useState<GovernanceProposal[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(true);

  useEffect(() => {
    setLoadingProposals(true);
    const q = query(collection(db, "proposals"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
        const proposalsData: GovernanceProposal[] = [];
        snapshot.forEach((doc) => {
            proposalsData.push({ id: doc.id, ...doc.data() } as GovernanceProposal);
        });
        setProposals(proposalsData);
        setLoadingProposals(false);
    });

    return () => unsub();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Governance</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Governance Proposals</CardTitle>
          <CardDescription>Vote on proposals to shape the future of UrjaSetu.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loadingProposals ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                            </TableCell>
                        </TableRow>
                    ) : proposals.map(proposal => (
                        <TableRow key={proposal.id}>
                            <TableCell className="text-muted-foreground font-mono text-xs">{proposal.id.substring(0, 8)}...</TableCell>
                            <TableCell className="font-medium">{proposal.title}</TableCell>
                            <TableCell>
                                <Badge variant={
                                    proposal.status === 'Active' ? 'default' :
                                    proposal.status === 'Passed' ? 'secondary' : 'destructive'
                                } className={proposal.status === 'Active' ? 'bg-primary text-primary-foreground' : ''}>{proposal.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/staking/${proposal.id}`}>View</Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                     {proposals.length === 0 && !loadingProposals && (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                No active proposals at the moment.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

    </div>
  );
}
