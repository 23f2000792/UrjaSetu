
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter }from 'next/navigation';
import { doc, getDoc, Timestamp, collection, addDoc, query, onSnapshot, orderBy, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageSquare, User, Shield, Send, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Dispute {
    id: string;
    transactionId: string;
    status: 'New' | 'Under Review' | 'Resolved' | 'Closed';
    createdAt: Timestamp;
    details: string;
    userId: string;
    userEmail: string;
    sellerId: string;
    rating?: number;
}

interface Message {
    id: string;
    text: string;
    authorId: string;
    authorEmail: string;
    timestamp: Timestamp;
}

export default function DisputeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const id = params.id as string;

    const [dispute, setDispute] = useState<Dispute | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [hoveredRating, setHoveredRating] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                setUserRole(userDoc.data()?.role || 'buyer');
            } else {
                setUserRole(null);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!id) return;

        const unsubDispute = onSnapshot(doc(db, "disputes", id), (docSnap) => {
            if (docSnap.exists()) {
                setDispute({ id: docSnap.id, ...docSnap.data() } as Dispute);
            } else {
                console.log("No such dispute!");
            }
            setLoading(false);
        });

        const q = query(collection(db, "disputes", id, "messages"), orderBy("timestamp", "asc"));
        const unsubMessages = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
            setMessages(msgs);
        });

        return () => {
            unsubDispute();
            unsubMessages();
        };
    }, [id]);

     useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user) return;
        try {
            await addDoc(collection(db, "disputes", id, "messages"), {
                text: newMessage,
                authorId: user.uid,
                authorEmail: user.email,
                timestamp: Timestamp.now()
            });
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
            toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
        }
    };

    const handleStatusUpdate = async (status: 'Resolved' | 'Under Review') => {
        try {
            await updateDoc(doc(db, "disputes", id), { status });
            toast({ title: "Status Updated", description: `Dispute marked as ${status}.` });
        } catch (error) {
            console.error("Error updating status:", error);
             toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
        }
    };

    const handleRating = async (rating: number) => {
        if (dispute?.rating) return; // Already rated
        try {
            await updateDoc(doc(db, "disputes", id), { rating });
            toast({ title: "Thank You!", description: "Your rating has been submitted." });
        } catch (error) {
            console.error("Error submitting rating:", error);
            toast({ title: "Error", description: "Failed to submit rating.", variant: "destructive" });
        }
    };
    
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
    
    const canManage = userRole === 'seller' && user?.uid === dispute.sellerId;
    const isBuyer = userRole === 'buyer' && user?.uid === dispute.userId;


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
                            <CardTitle>Original Complaint</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-line">{dispute.details}</p>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><MessageSquare /> Conversation</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-6 overflow-y-auto max-h-[400px] pr-2">
                            {messages.map((message) => (
                                <div key={message.id} className={cn("flex gap-3", message.authorId === user?.uid ? "justify-end" : "justify-start")}>
                                     <div className={cn("flex items-start gap-3 max-w-xs", message.authorId === user?.uid ? "flex-row-reverse" : "flex-row")}>
                                        <div className="flex-shrink-0">
                                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", message.authorId === dispute.sellerId ? "bg-primary/10" : "bg-muted")}>
                                                {message.authorId === dispute.sellerId ? <Shield className="h-5 w-5 text-primary" /> : <User className="h-5 w-5 text-muted-foreground" />}
                                            </div>
                                        </div>
                                        <div className={cn("p-3 rounded-lg", message.authorId === user?.uid ? "bg-primary text-primary-foreground" : "bg-muted")}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-semibold text-sm">{message.authorEmail}</p>
                                            </div>
                                            <p className="text-sm">{message.text}</p>
                                             <p className="text-xs opacity-70 mt-2 text-right">{formatDate(message.timestamp)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {messages.length === 0 && (
                                <p className="text-muted-foreground text-sm text-center py-8">No messages yet. Start the conversation.</p>
                            )}
                            <div ref={messagesEndRef} />
                        </CardContent>
                        {dispute.status !== 'Resolved' && (
                             <CardFooter className="pt-6 border-t">
                                <div className="w-full flex items-center gap-2">
                                <Textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." className="flex-grow" />
                                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}><Send className="h-4 w-4" /></Button>
                                </div>
                            </CardFooter>
                        )}
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Case Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
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

                    {canManage && dispute.status !== 'Resolved' && (
                        <Card>
                            <CardHeader><CardTitle>Seller Actions</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                {dispute.status === 'New' && <Button className="w-full" onClick={() => handleStatusUpdate('Under Review')}>Mark as Under Review</Button>}
                                {dispute.status === 'Under Review' && <Button className="w-full" onClick={() => handleStatusUpdate('Resolved')}>Mark as Resolved</Button>}
                            </CardContent>
                        </Card>
                    )}

                    {isBuyer && dispute.status === 'Resolved' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Rate this Resolution</CardTitle>
                                <CardDescription>Your feedback helps the community.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {dispute.rating ? (
                                    <div className="flex items-center gap-1">
                                        <p className="text-muted-foreground">You rated:</p>
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={cn("h-6 w-6", i < dispute.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1" onMouseLeave={() => setHoveredRating(0)}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={cn("h-7 w-7 cursor-pointer transition-colors", i < (hoveredRating || 0) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/50")}
                                                onMouseEnter={() => setHoveredRating(i + 1)}
                                                onClick={() => handleRating(i + 1)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                </div>
            </div>
        </div>
    );
}

    