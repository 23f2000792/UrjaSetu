
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import type { GovernanceProposal } from '@/lib/mock-data';


export default function StakingPage() {
  const [stakedBalance, setStakedBalance] = useState(1000);
  const [rewards, setRewards] = useState(25.3);
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const { toast } = useToast();
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

  const handleStake = () => {
    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a positive number to stake.", variant: "destructive" });
      return;
    }
    setIsStaking(true);
    setTimeout(() => {
      setStakedBalance(prev => prev + amount);
      setStakeAmount("");
      setIsStaking(false);
      toast({ title: "Stake Successful", description: `You have staked ${amount} URJA tokens.` });
    }, 1500);
  };

  const handleUnstake = () => {
    const amount = parseFloat(unstakeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a positive number to unstake.", variant: "destructive" });
      return;
    }
    if (amount > stakedBalance) {
      toast({ title: "Insufficient Balance", description: "You cannot unstake more than you have staked.", variant: "destructive" });
      return;
    }
    setIsUnstaking(true);
    setTimeout(() => {
      setStakedBalance(prev => prev - amount);
      setUnstakeAmount("");
      setIsUnstaking(false);
      toast({ title: "Unstake Successful", description: `You have unstaked ${amount} URJA tokens.` });
    }, 1500);
  };

  const handleClaimRewards = () => {
    if (rewards <= 0) {
        toast({ title: "No Rewards", description: "You have no rewards to claim.", variant: "destructive" });
        return;
    }
    setIsClaiming(true);
    setTimeout(() => {
      // In a real app, you might add the rewards to their main wallet balance
      setRewards(0);
      setIsClaiming(false);
      toast({ title: "Rewards Claimed", description: "Your staking rewards have been sent to your wallet." });
    }, 1500);
  };


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Staking & Governance</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Stake URJA Tokens</CardTitle>
            <CardDescription>Stake your tokens to earn rewards and participate in governance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground">Your Staked Balance</span>
                <span className="text-2xl font-bold">{stakedBalance.toLocaleString()} URJA</span>
            </div>
            <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground">Estimated APY</span>
                <span className="text-2xl font-bold text-primary">12.5%</span>
            </div>
            <div className="flex gap-2 pt-4">
                <Input 
                  placeholder="Amount to stake" 
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  disabled={isStaking || isUnstaking}
                />
                <Button onClick={handleStake} disabled={isStaking || !stakeAmount}>
                  {isStaking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Stake
                </Button>
            </div>
             <div className="flex gap-2">
                <Input 
                  placeholder="Amount to unstake" 
                  type="number"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  disabled={isStaking || isUnstaking}
                />
                <Button variant="outline" onClick={handleUnstake} disabled={isUnstaking || !unstakeAmount}>
                  {isUnstaking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Unstake
                </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Staking Rewards</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center space-y-2">
                <p className="text-4xl font-bold text-primary">{rewards.toFixed(2)} URJA</p>
                <p className="text-muted-foreground">Unclaimed Rewards</p>
                <Button variant="outline" className="w-full mt-4" onClick={handleClaimRewards} disabled={isClaiming || rewards <= 0}>
                   {isClaiming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                   Claim Rewards
                </Button>
            </CardContent>
        </Card>
      </div>

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
