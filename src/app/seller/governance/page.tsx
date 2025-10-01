
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { collection, addDoc, serverTimestamp, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { GovernanceProposal } from "@/lib/mock-data";
import type { User } from 'firebase/auth';

export default function GovernancePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [proposals, setProposals] = useState<GovernanceProposal[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();
  const { toast } = useToast();
  
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
        toast({ title: "Error", description: "Could not fetch your proposals.", variant: "destructive" });
        setLoadingProposals(false);
    });

    return () => unsubscribe();
  }, [user, toast]);


  const handleAddProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ title: "Not Authenticated", description: "You must be logged in.", variant: "destructive" });
        return;
    }
    if (!title || !description || !endDate) {
      toast({ title: "Missing Fields", description: "Please fill out all required fields.", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    try {
      await addDoc(collection(db, "proposals"), {
        proposerId: user.uid,
        proposer: user.email,
        title,
        description,
        endDate,
        status: "Active",
        votesFor: 0,
        votesAgainst: 0,
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Proposal Submitted",
        description: `Your proposal "${title}" has been submitted for voting.`,
      });
      setTitle("");
      setDescription("");
      setEndDate("");
    } catch (error) {
      console.error("Error adding proposal:", error);
      toast({
        title: "Submission Failed",
        description: "An unexpected error occurred while adding your proposal.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Governance</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Propose changes to shape the future of the UrjaSetu platform and track the community's votes on your ideas.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <form onSubmit={handleAddProposal}>
                <Card>
                <CardHeader>
                    <CardTitle>Create a Proposal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="proposal-title">Title</Label>
                        <Input id="proposal-title" placeholder="e.g., Increase Staking Rewards" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Describe the proposal's goals, impact..." value={description} onChange={(e) => setDescription(e.target.value)} rows={5} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="end-date">Voting End Date</Label>
                        <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Proposal
                    </Button>
                </CardFooter>
                </Card>
            </form>
        </div>
        <div className="lg:col-span-2">
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
                                <TableHead>Votes</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loadingProposals ? (
                                <TableRow><TableCell colSpan={4} className="h-24 text-center">Loading proposals...</TableCell></TableRow>
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
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-green-600">For: {proposal.votesFor}</span>
                                                <span className="text-red-600">Against: {proposal.votesAgainst}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/seller/governance/${proposal.id}`}>View Results</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={4} className="h-24 text-center">You have not submitted any proposals.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
