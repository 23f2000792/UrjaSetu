
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { doc, getDoc, onSnapshot, query, collection, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart2, ListOrdered, CircleDollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { SolarProject, Transaction } from "@/lib/mock-data";
import EditProjectForm from "@/components/seller/edit-project-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ManageProjectPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [project, setProject] = useState<SolarProject | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const docRef = doc(db, "projects", id);
        const unsubscribeProject = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setProject({ id: docSnap.id, ...docSnap.data() } as SolarProject);
            } else {
                console.log("No such document!");
                setProject(null);
            }
            setLoading(false);
        });

        const transactionsQuery = query(
            collection(db, "transactions"), 
            where("projectId", "==", id),
            orderBy("timestamp", "desc")
        );
        const unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
            const trans: Transaction[] = [];
            snapshot.forEach(doc => {
                trans.push({ id: doc.id, ...doc.data() } as Transaction);
            });
            setTransactions(trans);
        });


        return () => {
            unsubscribeProject();
            unsubscribeTransactions();
        };
    }, [id]);

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

    if (!project) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold">Project not found</h1>
                 <Button variant="outline" className="mt-4" onClick={() => router.push('/seller/projects')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
                </Button>
            </div>
        )
    }

    const tokensSold = project.totalTokens - project.tokensAvailable;
    const revenue = transactions.reduce((acc, tx) => acc + tx.totalCost, 0);
    const totalOrders = transactions.length;

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        return (timestamp.toDate ? timestamp.toDate() : new Date(timestamp)).toLocaleDateString();
    };


    return (
        <div className="space-y-8">
            <div>
                 <Button asChild variant="outline" size="sm" className="mb-4">
                    <Link href="/seller/projects">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Projects
                    </Link>
                </Button>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">{project.name}</h1>
                        <p className="text-muted-foreground mt-2">{project.location}</p>
                    </div>
                    <EditProjectForm project={project} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">Rs. {revenue.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-muted-foreground">from token sales</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tokens Sold</CardTitle>
                        <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{tokensSold.toLocaleString()} / {project.totalTokens.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                            {((tokensSold / project.totalTokens) * 100).toFixed(1)}% of total supply
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ListOrdered className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{totalOrders}</p>
                        <p className="text-xs text-muted-foreground">{transactions.filter(t => t.status === "Pending").length} pending</p>
                    </CardContent>
                </Card>
            </div>
             
             <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>A list of recent token purchases for this project.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Total Cost</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.length > 0 ? (
                                        transactions.slice(0, 5).map(tx => (
                                            <TableRow key={tx.id}>
                                                <TableCell>{formatDate(tx.timestamp)}</TableCell>
                                                <TableCell>{tx.quantity}</TableCell>
                                                <TableCell>Rs. {tx.totalCost.toFixed(2)}</TableCell>
                                                <TableCell><Badge variant="secondary">{tx.status}</Badge></TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center h-24">No orders yet.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Thumbnail</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="aspect-video relative">
                                <Image 
                                    src={project.imageUrl}
                                    alt={project.name}
                                    fill
                                    className="rounded-lg object-cover"
                                />
                             </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

    