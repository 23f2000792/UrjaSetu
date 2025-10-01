
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserDisputeList, Dispute } from "@/components/disputes/user-dispute-list";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, onSnapshot } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { onAuthStateChanged, User } from 'firebase/auth';


export default function DisputesPage() {
  const [transactionId, setTransactionId] = useState("");
  const [details, setDetails] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [userDisputes, setUserDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDisputes, setLoadingDisputes] = useState(true);
  const { toast } = useToast();

   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
        setLoadingDisputes(false);
        return;
    };
    
    setLoadingDisputes(true);
    const q = query(collection(db, "disputes"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const disputesData: Dispute[] = [];
      querySnapshot.forEach((doc) => {
        disputesData.push({ id: doc.id, ...doc.data() } as Dispute);
      });
      setUserDisputes(disputesData.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds));
      setLoadingDisputes(false);
    }, (error) => {
        console.error("Error fetching user disputes:", error);
        toast({ title: "Error", description: "Could not fetch your disputes.", variant: "destructive" });
        setLoadingDisputes(false);
    });

    return () => unsubscribe();
  }, [user, toast]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ title: "Not Authenticated", description: "You must be logged in to file a dispute.", variant: "destructive" });
        return;
    }
    if (!transactionId || !details) {
        toast({ title: "Missing Fields", description: "Please fill out all fields.", variant: "destructive" });
        return;
    }

    setIsLoading(true);
    try {
        await addDoc(collection(db, "disputes"), {
            userId: user.uid,
            userEmail: user.email,
            transactionId: transactionId,
            details: details,
            status: "New",
            createdAt: serverTimestamp(),
        });
        toast({ title: "Success", description: "Your dispute has been filed." });
        setTransactionId("");
        setDetails("");
    } catch (error) {
        console.error("Error filing dispute: ", error);
        toast({ title: "Error", description: "There was a problem filing your dispute.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  }


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Dispute Resolution</h1>
      <p className="text-muted-foreground max-w-2xl">
        If you have an issue with a transaction, please file a dispute below. Our team will review the case and mediate a resolution.
      </p>

      <Card>
        <form onSubmit={handleSubmit}>
            <CardHeader>
            <CardTitle>File a New Dispute</CardTitle>
            <CardDescription>Provide as much detail as possible about the issue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="transaction-id">Transaction ID</Label>
                <Input 
                    id="transaction-id" 
                    placeholder="Enter the transaction hash or order ID" 
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    disabled={isLoading}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="dispute-details">Details of the Issue</Label>
                <Textarea 
                    id="dispute-details" 
                    placeholder="Describe the problem in detail..." 
                    rows={5} 
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    disabled={isLoading}
                />
            </div>
            </CardContent>
            <CardFooter>
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Dispute
            </Button>
            </CardFooter>
        </form>
      </Card>
      
      <UserDisputeList disputes={userDisputes} loading={loadingDisputes} />
    </div>
  );
}
