
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserDisputeList, Dispute } from "@/components/disputes/user-dispute-list";
import { collection, addDoc, serverTimestamp, query, where, onSnapshot, getDocs, doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { User } from 'firebase/auth';
import type { Transaction } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser, useFirestore } from "@/firebase";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function DisputesPage() {
  const [selectedTransaction, setSelectedTransaction] = useState("");
  const [details, setDetails] = useState("");
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const [userDisputes, setUserDisputes] = useState<Dispute[]>([]);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!user || !firestore) {
        setLoadingData(false);
        return;
    };
    
    setLoadingData(true);

    // Fetch user's transactions for the dropdown
    const fetchTransactions = async () => {
        const transQuery = query(collection(firestore, "transactions"), where("userId", "==", user.uid), where("type", "==", "Buy"));
        const querySnapshot = await getDocs(transQuery).catch(err => {
          const permissionError = new FirestorePermissionError({
            path: transQuery.path,
            operation: 'list'
          });
          errorEmitter.emit('permission-error', permissionError);
          return null;
        });

        if (!querySnapshot) {
          setLoadingData(false);
          return;
        }

        const transData: Transaction[] = [];
        querySnapshot.forEach((doc) => {
            transData.push({ id: doc.id, ...doc.data() } as Transaction);
        });
        setUserTransactions(transData.sort((a,b) => b.timestamp.seconds - a.timestamp.seconds));
    };

    fetchTransactions();

    // Listen for user's disputes
    const disputesQuery = query(collection(firestore, "disputes"), where("userId", "==", user.uid));
    const unsubscribeDisputes = onSnapshot(disputesQuery, (querySnapshot) => {
      const disputesData: Dispute[] = [];
      querySnapshot.forEach((doc) => {
        disputesData.push({ id: doc.id, ...doc.data() } as Dispute);
      });
      setUserDisputes(disputesData.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds));
      setLoadingData(false);
    }, (error) => {
        const permissionError = new FirestorePermissionError({
            path: disputesQuery.path,
            operation: 'list'
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({ title: "Error", description: "Could not fetch your disputes.", variant: "destructive" });
        setLoadingData(false);
    });

    return () => unsubscribeDisputes();
  }, [user, firestore, toast]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore) {
        toast({ title: "Not Authenticated", description: "You must be logged in to file a dispute.", variant: "destructive" });
        return;
    }
    if (!selectedTransaction || !details) {
        toast({ title: "Missing Fields", description: "Please select a transaction and provide details.", variant: "destructive" });
        return;
    }

    setIsLoading(true);
    
    const transaction = userTransactions.find(t => t.id === selectedTransaction);
    if (!transaction) {
        toast({ title: "Error", description: "Selected transaction not found.", variant: "destructive" });
        setIsLoading(false);
        return;
    }

    const disputeData = {
        userId: user.uid,
        userEmail: user.email,
        transactionId: transaction.id,
        projectId: transaction.projectId,
        sellerId: transaction.sellerId, // Make sure sellerId is on transactions
        details: details,
        status: "New",
        createdAt: serverTimestamp(),
    };
    
    const disputesCol = collection(firestore, "disputes");
    addDoc(disputesCol, disputeData).then(() => {
        toast({ title: "Success", description: "Your dispute has been filed." });
        setSelectedTransaction("");
        setDetails("");
    }).catch(error => {
        const permissionError = new FirestorePermissionError({
          path: disputesCol.path,
          operation: 'create',
          requestResourceData: disputeData
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({ title: "Error", description: "There was a problem filing your dispute. Check Firestore rules.", variant: "destructive" });
    }).finally(() => {
        setIsLoading(false);
    });
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
                <Label htmlFor="transaction-id">Select Transaction</Label>
                <Select onValueChange={setSelectedTransaction} value={selectedTransaction} disabled={isLoading}>
                    <SelectTrigger id="transaction-id">
                        <SelectValue placeholder="Select the transaction to dispute..." />
                    </SelectTrigger>
                    <SelectContent>
                        {userTransactions.length > 0 ? userTransactions.map(t => (
                            <SelectItem key={t.id} value={t.id}>
                                {t.projectName} - {t.quantity} units - {t.timestamp.toDate().toLocaleDateString()}
                            </SelectItem>
                        )) : <SelectItem value="none" disabled>No transactions found</SelectItem>}
                    </SelectContent>
                </Select>
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
      
      <UserDisputeList disputes={userDisputes} loading={loadingData} />
    </div>
  );
}
