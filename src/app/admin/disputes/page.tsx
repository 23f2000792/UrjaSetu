
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { AdminDisputeList, Dispute } from "@/components/admin/admin-dispute-list";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const q = query(collection(db, "disputes"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const disputesData: Dispute[] = [];
      querySnapshot.forEach((doc) => {
        disputesData.push({ id: doc.id, ...doc.data() } as Dispute);
      });
      setDisputes(disputesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching disputes:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const newDisputes = disputes.filter(d => d.status === 'New').length;
  const underReview = disputes.filter(d => d.status === 'Under Review').length;
  
  // This would ideally be calculated from historical data
  const resolvedThisWeek = 8; 

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Admin: Dispute Management</h1>
      <p className="text-muted-foreground max-w-2xl">
        Review, investigate, and resolve user-submitted disputes to maintain a fair and trustworthy marketplace.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <>
            <Card><CardHeader><CardTitle>New Disputes</CardTitle></CardHeader><CardContent><Skeleton className="h-10 w-1/4" /></CardContent></Card>
            <Card><CardHeader><CardTitle>Under Review</CardTitle></CardHeader><CardContent><Skeleton className="h-10 w-1/4" /></CardContent></Card>
            <Card><CardHeader><CardTitle>Resolved This Week</CardTitle></CardHeader><CardContent><Skeleton className="h-10 w-1/4" /></CardContent></Card>
          </>
        ) : (
          <>
            <Card>
                <CardHeader>
                    <CardTitle>New Disputes</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">{newDisputes}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Under Review</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">{underReview}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Resolved This Week</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">{resolvedThisWeek}</p>
                </CardContent>
            </Card>
          </>
        )}
      </div>

      <AdminDisputeList disputes={disputes} loading={loading} />

    </div>
  );
}
