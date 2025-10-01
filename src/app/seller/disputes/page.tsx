
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, getDocs, doc } from "firebase/firestore";
import { SellerDisputeList, Dispute } from "@/components/seller/seller-dispute-list";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { onAuthStateChanged, User } from 'firebase/auth';
import { Star, MessageSquare, CheckSquare } from "lucide-react";

export default function SellerDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);
  
  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    }

    setLoading(true);

    const q = query(collection(db, "disputes"), where("sellerId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const disputesData: Dispute[] = [];
      let totalRating = 0;
      let ratedCount = 0;

      querySnapshot.forEach((doc) => {
        const dispute = { id: doc.id, ...doc.data() } as Dispute;
        disputesData.push(dispute);

        if (dispute.rating && dispute.rating > 0) {
            totalRating += dispute.rating;
            ratedCount++;
        }
      });
      setDisputes(disputesData.sort((a,b) => b.createdAt.seconds - a.createdAt.seconds));
      setAverageRating(ratedCount > 0 ? totalRating / ratedCount : 0);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching disputes:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const newDisputes = disputes.filter(d => d.status === 'New').length;
  const underReview = disputes.filter(d => d.status === 'Under Review').length;
  const resolvedThisMonth = disputes.filter(d => d.status === 'Resolved').length;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Dispute Management</h1>
      <p className="text-muted-foreground max-w-2xl">
        Review, investigate, and resolve user-submitted disputes for your projects.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <Card><CardHeader><CardTitle>New Disputes</CardTitle></CardHeader><CardContent><Skeleton className="h-10 w-1/4" /></CardContent></Card>
            <Card><CardHeader><CardTitle>Under Review</CardTitle></CardHeader><CardContent><Skeleton className="h-10 w-1/4" /></CardContent></Card>
            <Card><CardHeader><CardTitle>Resolved This Month</CardTitle></CardHeader><CardContent><Skeleton className="h-10 w-1/4" /></CardContent></Card>
            <Card><CardHeader><CardTitle>Average Rating</CardTitle></CardHeader><CardContent><Skeleton className="h-10 w-1/4" /></CardContent></Card>
          </>
        ) : (
          <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New Disputes</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{newDisputes}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Under Review</CardTitle>
                    <CheckSquare className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{underReview}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                     <Gavel className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{resolvedThisMonth}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{averageRating.toFixed(1)} / 5.0</p>
                </CardContent>
            </Card>
          </>
        )}
      </div>

      <SellerDisputeList disputes={disputes} loading={loading} />

    </div>
  );
}

    