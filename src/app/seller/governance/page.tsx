
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function AddProposalPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAddProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
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
        proposer: user.email, // Or a display name if available
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
      router.push("/staking");
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
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Create a New Governance Proposal</h1>
        <p className="text-muted-foreground mt-2">
          Propose changes and help shape the future of the UrjaSetu platform.
        </p>
      </div>
      <form onSubmit={handleAddProposal}>
        <Card>
          <CardHeader>
            <CardTitle>Proposal Details</CardTitle>
            <CardDescription>Provide a clear title and a detailed description of your proposal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="proposal-title">Proposal Title</Label>
              <Input id="proposal-title" placeholder="e.g., Increase Staking Rewards by 5%" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Proposal Description</Label>
              <Textarea id="description" placeholder="Describe the proposal's goals, impact, and justification in detail..." value={description} onChange={(e) => setDescription(e.target.value)} rows={8} required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="end-date">Voting End Date</Label>
                <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              </div>
          </CardContent>
           <CardFooter>
            <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Proposal
            </Button>
        </CardFooter>
        </Card>
      </form>
    </div>
  );
}
