
"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ThumbsUp, ThumbsDown, Edit } from 'lucide-react';
import Link from 'next/link';
import { useFirestore } from '@/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import type { GovernanceProposal } from '@/lib/mock-data';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

export default function SellerProposalDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const id = params.id as string;
    
    const [proposal, setProposal] = useState<GovernanceProposal | null>(null);
    const [loading, setLoading] = useState(true);
    const [newStatus, setNewStatus] = useState<string>("");
    const firestore = useFirestore();

    useEffect(() => {
      if (!id || !firestore) return;
      setLoading(true);
      const unsub = getDoc(doc(firestore, "proposals", id)).then(docSnap => {
          if (docSnap.exists()) {
              const data = { id: docSnap.id, ...docSnap.data()} as GovernanceProposal;
              setProposal(data);
              setNewStatus(data.status);
          } else {
              console.log("No such document!");
          }
          setLoading(false);
      });
    }, [id, firestore]);

    const handleStatusUpdate = async () => {
        if (!newStatus || newStatus === proposal?.status || !firestore) return;

        const proposalRef = doc(firestore, "proposals", id);
        try {
            await updateDoc(proposalRef, { status: newStatus });
            setProposal(prev => prev ? { ...prev, status: newStatus as any } : null);
            toast({
                title: "Status Updated",
                description: `Proposal status has been changed to ${newStatus}.`,
            });
        } catch (error) {
            console.error("Error updating status:", error);
            toast({
                title: "Update Failed",
                description: "Could not update proposal status.",
                variant: "destructive",
            });
        }
    };


    if (loading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-8 w-40" />
                <div className="space-y-2">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/4" />
                </div>
                 <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
                        <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent className="space-y-6"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></CardContent></Card>
                    </div>
                    <div className="space-y-8">
                         <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-5 w-full" /><Skeleton className="h-5 w-full" /></CardContent></Card>
                    </div>
                 </div>
            </div>
        )
    }

    if (!proposal) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <h1 className="text-2xl font-bold">Proposal not found</h1>
                <p className="text-muted-foreground mt-2">The proposal you are looking for does not exist.</p>
                <Button asChild variant="outline" className="mt-4">
                    <Link href="/seller/governance">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Governance
                    </Link>
                </Button>
            </div>
        );
    }
    
    const totalVotes = proposal.votesFor + proposal.votesAgainst;
    const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
    const againstPercentage = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;
    
    return (
        <div className="space-y-8">
            <div>
                 <Button asChild variant="outline" size="sm" className="mb-4">
                    <Link href="/seller/governance">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Governance
                    </Link>
                </Button>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">{proposal.title}</h1>
                        <p className="text-muted-foreground mt-2 font-mono text-xs">Proposal ID: {proposal.id}</p>
                    </div>
                    <Badge variant={
                        proposal.status === 'Active' ? 'default' :
                        proposal.status === 'Passed' ? 'secondary' : 'destructive'
                    } className={`text-base px-4 py-1 ${proposal.status === 'Active' ? 'bg-primary' : ''}`}>
                        {proposal.status}
                    </Badge>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-line">{proposal.description}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Live Voting Results</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2 text-sm">
                                    <span className="font-medium flex items-center gap-2"><ThumbsUp className="text-primary"/> For</span>
                                    <span>{proposal.votesFor.toLocaleString()} Votes ({forPercentage.toFixed(2)}%)</span>
                                </div>
                                <Progress value={forPercentage} className="h-3" />
                            </div>
                             <div>
                                <div className="flex justify-between mb-2 text-sm">
                                    <span className="font-medium flex items-center gap-2"><ThumbsDown className="text-destructive"/> Against</span>
                                    <span>{proposal.votesAgainst.toLocaleString()} Votes ({againstPercentage.toFixed(2)}%)</span>
                                </div>
                                <Progress value={againstPercentage} className="h-3 [&>div]:bg-destructive" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Proposal</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Update Status</Label>
                                <Select onValueChange={setNewStatus} value={newStatus}>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Passed">Passed</SelectItem>
                                        <SelectItem value="Failed">Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleStatusUpdate} className="w-full" disabled={newStatus === proposal.status}>
                                <Edit className="mr-2 h-4 w-4" /> Save Status
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Proposer</span>
                                <span className="font-mono text-xs">{proposal.proposer}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Voting Ends</span>
                                <span className="font-medium">{proposal.endDate}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Votes</span>
                                <span className="font-medium">{totalVotes.toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
