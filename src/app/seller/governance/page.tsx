
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { GovernanceProposal } from "@/lib/mock-data";
import type { User } from 'firebase/auth';

export default function GovernanceListPage() {
  const [proposals, setProposals] = useState<GovernanceProposal[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setLoadingProposals(false);
      return;
    };
    
    setLoadingProposals(true);
    const q = query(
        collection(db, "proposals"), 
        where("proposerId", "==", user.uid),
        orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const proposalsData: GovernanceProposal[] = [];
      querySnapshot.forEach((doc) => {
        proposalsData.push({ id: doc.id, ...doc.data() } as GovernanceProposal);
      });
      setProposals(proposalsData);
      setLoadingProposals(false);
    }, (error) => {
        console.error("Error fetching proposals:", error);
        setLoadingProposals(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Governance</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Track and manage your proposals for the UrjaSetu platform.
          </p>
        </div>
        <Button asChild>
          <Link href="/seller/governance/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Proposal
          </Link>
        </Button>
      </div>

      <Card>
          <CardHeader>
              <CardTitle>Your Proposals</CardTitle>
              <CardDescription>A history of proposals you have submitted.</CardDescription>
          </CardHeader>
          <CardContent>
               <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Votes For</TableHead>
                          <TableHead>Votes Against</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {loadingProposals ? (
                          <TableRow><TableCell colSpan={5} className="h-24 text-center">Loading proposals...</TableCell></TableRow>
                      ) : proposals.length > 0 ? (
                          proposals.map(proposal => (
                              <TableRow key={proposal.id}>
                                  <TableCell className="font-medium">{proposal.title}</TableCell>
                                  <TableCell>
                                      <Badge variant={proposal.status === 'Active' ? 'default' : proposal.status === 'Passed' ? 'secondary' : 'destructive'}
                                          className={proposal.status === 'Active' ? 'bg-primary' : ''}>
                                          {proposal.status}
                                      </Badge>
                                  </TableCell>
                                  <TableCell className="text-green-600">{proposal.votesFor}</TableCell>
                                  <TableCell className="text-red-600">{proposal.votesAgainst}</TableCell>
                                  <TableCell className="text-right">
                                      <Button variant="outline" size="sm" asChild>
                                          <Link href={`/seller/governance/${proposal.id}`}>Manage</Link>
                                      </Button>
                                  </TableCell>
                              </TableRow>
                          ))
                      ) : (
                          <TableRow><TableCell colSpan={5} className="h-24 text-center">You have not submitted any proposals.</TableCell></TableRow>
                      )}
                  </TableBody>
              </Table>
          </CardContent>
      </Card>
    </div>
  );
}
