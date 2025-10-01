
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, TrendingUp, Leaf } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState, useEffect } from 'react';
import type { UserProfile, Transaction } from "@/lib/mock-data";


export default function LeaderboardPage() {
  const [topTraders, setTopTraders] = useState<UserProfile[]>([]);
  const [topOffsetters, setTopOffsetters] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        // 1. Fetch all users and filter for buyers
        const usersQuery = query(collection(db, "users"), where("role", "==", "buyer"));
        const usersSnapshot = await getDocs(usersQuery);
        const userMap = new Map<string, UserProfile>();
        usersSnapshot.forEach(doc => {
            userMap.set(doc.id, { id: doc.id, ...doc.data() } as UserProfile);
        });

        // 2. Fetch all transactions
        const transactionsQuery = query(collection(db, "transactions"), where("type", "==", "Buy"));
        const transactionsSnapshot = await getDocs(transactionsQuery);
        
        // 3. Aggregate data
        const userStats: { [userId: string]: { volume: number; offset: number } } = {};

        transactionsSnapshot.forEach(doc => {
            const tx = doc.data() as Transaction;
            if (!userStats[tx.userId]) {
            userStats[tx.userId] = { volume: 0, offset: 0 };
            }
            userStats[tx.userId].volume += tx.totalCost;
            // Assuming 1 token = 120 kWh, 1 kWh = 0.707 kg CO2
            const energy = tx.quantity * 120;
            userStats[tx.userId].offset += energy * 0.707;
        });

        // 4. Combine user data with aggregated stats
        const combinedUsers: UserProfile[] = [];
        for (const userId in userStats) {
            if (userMap.has(userId)) {
            combinedUsers.push({
                ...userMap.get(userId)!,
                volume: userStats[userId].volume,
                offset: userStats[userId].offset,
            });
            }
        }

        // 5. Sort and set state
        const sortedTraders = [...combinedUsers].sort((a, b) => (b.volume || 0) - (a.volume || 0)).slice(0, 10);
        const sortedOffsetters = [...combinedUsers].sort((a, b) => (b.offset || 0) - (a.offset || 0)).slice(0, 10);

        setTopTraders(sortedTraders);
        setTopOffsetters(sortedOffsetters);

      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        // Handle error (e.g., show a toast message)
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const renderTableRows = (users: UserProfile[], valueKey: 'volume' | 'offset', unit: string) => {
    if (loading) {
        return Array.from({length: 5}).map((_, i) => (
             <TableRow key={i}>
                <TableCell><Skeleton className="h-8 w-4" /></TableCell>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                </TableCell>
                <TableCell className="text-right"><Skeleton className="h-6 w-20 ml-auto" /></TableCell>
            </TableRow>
        ))
    }
    if (users.length === 0) {
        return (
            <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    No data available yet.
                </TableCell>
            </TableRow>
        );
    }
    return users.map((user, index) => (
         <TableRow key={user.id}>
            <TableCell className="font-bold text-lg">{index + 1}</TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={(user as any).avatar} data-ai-hint="person portrait"/>
                        <AvatarFallback>{(user as any).fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{(user as any).fullName}</span>
                </div>
            </TableCell>
            <TableCell className="text-right font-medium">
                {valueKey === 'volume' ? 'Rs. ' : ''}
                {((user as any)[valueKey] || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                {valueKey === 'volume' ? '' : ` ${unit}`}
            </TableCell>
        </TableRow>
    ))
}


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Leaderboards</h1>
      <p className="text-muted-foreground max-w-2xl">
        See how you stack up against other users in the community.
      </p>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Trophy className="h-6 w-6" />Community Standings</CardTitle>
            <CardDescription>The top performers on the UrjaSetu platform.</CardDescription>
        </CardHeader>
        <CardContent>
             <Tabs defaultValue="traders" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                    <TabsTrigger value="traders"><TrendingUp className="mr-2 h-4 w-4" /> Top Traders</TabsTrigger>
                    <TabsTrigger value="offsetters"><Leaf className="mr-2 h-4 w-4" /> Top Carbon Offsetters</TabsTrigger>
                </TabsList>
                <TabsContent value="traders">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">Rank</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead className="text-right">Trading Volume</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {renderTableRows(topTraders, 'volume', 'Rs.')}
                        </TableBody>
                    </Table>
                </TabsContent>
                <TabsContent value="offsetters">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">Rank</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead className="text-right">Carbon Offset</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {renderTableRows(topOffsetters, 'offset', 'kg CO₂e')}
                        </TableBody>
                    </Table>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
