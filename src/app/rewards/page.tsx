
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Star, Trophy } from "lucide-react";
import { UserBadges } from "@/components/rewards/user-badges";
import { Leaderboard } from "@/components/rewards/leaderboard";
import { collection, onSnapshot, query, limit, orderBy, getDocs, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState, useEffect } from 'react';
import type { UserProfile, Transaction } from "@/lib/mock-data";


export default function RewardsPage() {
  const [topTraders, setTopTraders] = useState<UserProfile[]>([]);
  const [topOffsetters, setTopOffsetters] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);

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
      const sortedTraders = [...combinedUsers].sort((a, b) => (b.volume || 0) - (a.volume || 0)).slice(0, 5);
      const sortedOffsetters = [...combinedUsers].sort((a, b) => (b.offset || 0) - (a.offset || 0)).slice(0, 5);

      setTopTraders(sortedTraders);
      setTopOffsetters(sortedOffsetters);
      setLoading(false);
    };

    fetchLeaderboardData();

    // Set up listeners for real-time updates if needed in the future,
    // but for leaderboards, a periodic fetch is often sufficient.
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Rewards & Gamification</h1>
      <p className="text-muted-foreground max-w-2xl">
        Engage with the platform, earn rewards, and climb the leaderboards. Your participation helps drive the renewable energy revolution.
      </p>

      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Star className="h-6 w-6" /> Your Badges</CardTitle>
            <CardDescription>Achievements you've unlocked on your journey.</CardDescription>
          </CardHeader>
          <CardContent>
            <UserBadges />
          </CardContent>
        </Card>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Trophy className="h-6 w-6" />Leaderboards</CardTitle>
            <CardDescription>See how you stack up against other users.</CardDescription>
        </CardHeader>
        <CardContent>
            <Leaderboard topTraders={topTraders} topOffsetters={topOffsetters} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}
