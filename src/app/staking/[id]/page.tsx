
"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Check, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment, runTransaction } from 'firebase/firestore';
import type { GovernanceProposal } from '@/lib/mock-data';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProposalDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const id = params.id as string;
    
    const [proposal, setProposal] = useState<GovernanceProposal | null>(null);
    const [loading, setLoading] = useState(true);
    const [isVoting, setIsVoting] = useState(false);
    const [voted, setVoted] = useState<null | 'for' | 'against'>(null); // To-do: Persist this per user

    useEffect(() => {
      if (!id) return;
      setLoading(true);
      const unsub = getDoc(doc(db, "proposals", id)).then(docSnap => {
          if (docSnap.exists()) {
              setProposal({ id: docSnap.id, ...docSnap.data()} as GovernanceProposal);
          } else {
              console.log("No such document!");
          }
          setLoading(false);
      });
    }, [id]);


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
                         <Card><CardHeader><Skeleton className="h-8 w-40" /></CardHeader><CardContent><Skeleton className="h-12 w-full" /></CardContent></Card>
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
                    <Link href="/staking">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Staking
                    </Link>
                </Button>
            </div>
        );
    }
    
    const totalVotes = proposal.votesFor + proposal.votesAgainst;
    const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
    const againstPercentage = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;
    
    const handleVote = async (vote: 'for' | 'against') => {
        if (proposal.status !== 'Active') {
            toast({ title: "Voting Closed", description: "This proposal is no longer active.", variant: "destructive" });
            return;
        }
        if (voted) {
             toast({ title: "Already Voted", description: `You have already voted on this proposal.`, variant: "destructive" });
            return;
        }
        
        setIsVoting(true);
        try {
            const proposalRef = doc(db, "proposals", id);
            const fieldToIncrement = vote === 'for' ? 'votesFor' : 'votesAgainst';
            
            await updateDoc(proposalRef, {
                [fieldToIncrement]: increment(1)
            });

            // Optimistically update the UI
            setProposal(prev => prev ? { ...prev, [fieldToIncrement]: prev[fieldToIncrement] + 1 } : null);

            setVoted(vote);
            toast({ title: "Vote Cast!", description: `You have successfully voted '${vote}'.` });

        } catch (error) {
            console.error("Error casting vote: ", error);
            toast({ title: "Error", description: "Could not cast your vote. Check Firestore rules.", variant: "destructive" });
        } finally {
            setIsVoting(false);
        }
    }

    return (
        <div className="space-y-8">
            <div>
                 <Button asChild variant="outline" size="sm" className="mb-4">
                    <Link href="/staking">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to All Proposals
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
                            <CardTitle>Current Results</CardTitle>
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
                            <CardTitle>Cast Your Vote</CardTitle>
                            <CardDescription>Your vote is weighted by your staked URJA amount.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {voted ? (
                                <div className="flex items-center justify-center p-4 rounded-md bg-accent text-accent-foreground gap-2">
                                    <Check className="h-5 w-5" />
                                    <p>You voted <span className="font-bold capitalize">{voted}</span>.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <Button size="lg" className="bg-primary/90 hover:bg-primary" onClick={() => handleVote('for')} disabled={isVoting}>
                                        {isVoting ? <Loader2 className="animate-spin" /> : <ThumbsUp className="mr-2"/>} For
                                    </Button>
                                    <Button size="lg" variant="destructive" className="bg-destructive/90 hover:bg-destructive" onClick={() => handleVote('against')} disabled={isVoting}>
                                        {isVoting ? <Loader2 className="animate-spin" /> : <ThumbsDown className="mr-2"/>} Against
                                    </Button>
                                </div>
                            )}
                             {proposal.status !== 'Active' && !voted && (
                                <p className="text-sm text-center text-muted-foreground">Voting on this proposal has ended.</p>
                            )}
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
