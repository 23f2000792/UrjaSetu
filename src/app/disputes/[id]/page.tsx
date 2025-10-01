
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageSquare, User, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface Dispute {
    id: string;
    transactionId: string;
    status: 'New' | 'Under Review' | 'Resolved' | 'Closed';
    createdAt: Timestamp;
    details: string;
    userEmail: string;
    updates?: { comment: string; author: string; timestamp: Timestamp }[];
}

export default function DisputeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [dispute, setDispute] = useState<Dispute | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchDispute = async () => {
            const docRef = doc(db, "disputes", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // Add some mock updates for demonstration
                const data = { id: docSnap.id, ...docSnap.data() } as Dispute;
                data.updates = [
                    { comment: "We are looking into this transaction. Please allow 2-3 business days.", author: "UrjaSetu Support", timestamp: Timestamp.fromDate(new Date()) },
                    { comment: "Thank you for your patience.", author: "UrjaSetu Support", timestamp: Timestamp.fromDate(new Date()) },
                ];
                setDispute(data);
            } else {
                console.log("No such document!");
            }
            setLoading(false);
        };

        fetchDispute();
    }, [id]);
    
    const formatDate = (timestamp: Timestamp | Date) => {
        if (!timestamp) return 'N/A';
        return (timestamp instanceof Date ? timestamp : timestamp.toDate()).toLocaleString();
    }

    const getBadgeVariant = (status: Dispute['status']) => {
        switch (status) {
            case 'New': return 'destructive';
            case 'Under Review': return 'outline';
            case 'Resolved': return 'secondary';
            default: return 'default';
        }
    }


    if (loading) {
        return (
            <div className="space-y-8">
                 <Skeleton className="h-8 w-40" />
                 <Skeleton className="h-10 w-64" />
                 <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><Skeleton className="h-20 w-full" /></CardContent></Card>
                        <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
                    </div>
                    <div>
                         <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-5 w-full" /><Skeleton className="h-5 w-full" /><Skeleton className="h-5 w-full" /></CardContent></Card>
                    </div>
                 </div>
            </div>
        )
    }

    if (!dispute) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Dispute not found</h1>
                 <Button variant="outline" className="mt-4" onClick={() => router.push('/disputes')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Disputes
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                 <Button asChild variant="outline" size="sm" className="mb-4">
                    <span onClick={() => router.back()} className="cursor-pointer flex items-center">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to List
                    </span>
                </Button>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">Dispute Details</h1>
                        <p className="text-muted-foreground mt-2">Case ID: {dispute.id}</p>
                    </div>
                    <Badge variant={getBadgeVariant(dispute.status)} className="text-base px-4 py-1">{dispute.status}</Badge>
                </div>
            </div>
             <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Original Complaint</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-line">{dispute.details}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><MessageSquare /> Case Log</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {dispute.updates?.map((update, index) => (
                                <div key={index} className="flex gap-4">
                                     <div className="flex-shrink-0">
                                        {update.author === 'UrjaSetu Support' ? (
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Shield className="h-5 w-5 text-primary" />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                                <User className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        )}
                                     </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold">{update.author}</p>
                                            <p className="text-xs text-muted-foreground">{formatDate(update.timestamp)}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">{update.comment}</p>
                                    </div>
                                </div>
                            ))}
                            {(!dispute.updates || dispute.updates.length === 0) && (
                                <p className="text-muted-foreground text-sm">No updates on this case yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Case Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status</span>
                                <span className="font-medium">{dispute.status}</span>
                            </div>
                             <div className="space-y-1">
                                <span className="text-muted-foreground">Transaction ID</span>
                                <p className="font-mono text-xs break-all">{dispute.transactionId}</p>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Filed On</span>
                                <span className="font-medium">{formatDate(dispute.createdAt.toDate())}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Filed By</span>
                                <span className="font-medium">{dispute.userEmail}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
