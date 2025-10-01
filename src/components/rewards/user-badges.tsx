
"use client";

import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Award, Leaf, TrendingUp, Users, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import type { User } from 'firebase/auth';

const allBadges = [
    { 
        id: "pioneer",
        icon: <Award className="w-8 h-8" />, 
        title: "Pioneer", 
        description: "Join UrjaSetu in the first month of launch.",
        criteria: (data: { joinDate?: Date }) => data.joinDate ? data.joinDate < new Date('2024-08-01') : false,
        color: "text-yellow-400"
    },
    { 
        id: "investor",
        icon: <TrendingUp className="w-8 h-8" />, 
        title: "Investor", 
        description: "Make your first successful investment.",
        criteria: (data: { transactionCount: number }) => data.transactionCount > 0,
        color: "text-blue-400"
    },
    { 
        id: "eco-warrior",
        icon: <Leaf className="w-8 h-8" />, 
        title: "Eco-Warrior", 
        description: "Offset more than 1,000 kg of CO2.",
        criteria: (data: { carbonOffset: number }) => data.carbonOffset > 1000,
        color: "text-green-400"
    },
    { 
        id: "portfolio-pro",
        icon: <Users className="w-8 h-8" />, 
        title: "Portfolio Pro", 
        description: "Hold at least 3 different assets in your portfolio.",
        criteria: (data: { portfolioCount: number }) => data.portfolioCount >= 3,
        color: "text-indigo-400"
    },
];


export function UserBadges() {
    const [user, setUser] = useState<User | null>(null);
    const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(setUser);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchBadgeData = async () => {
            setLoading(true);

            // Fetch transaction data
            const transactionsQuery = query(collection(db, "transactions"), where("userId", "==", user.uid));
            const transactionSnapshot = await getDocs(transactionsQuery);
            const transactionCount = transactionSnapshot.size;
            
            let totalEnergy = 0;
            transactionSnapshot.forEach(doc => {
                 totalEnergy += (doc.data().quantity || 0) * 120; // 1 token = 120 kWh
            });
            const carbonOffset = totalEnergy * 0.707;

            // Fetch portfolio data
            const portfolioQuery = query(collection(db, "portfolioAssets"), where("userId", "==", user.uid));
            const portfolioSnapshot = await getDocs(portfolioQuery);
            const portfolioCount = portfolioSnapshot.size;
            
            // Check criteria
            const dataForCriteria = {
                joinDate: user.metadata.creationTime ? new Date(user.metadata.creationTime) : undefined,
                transactionCount,
                carbonOffset,
                portfolioCount
            };
            
            const unlocked = allBadges
                .filter(badge => badge.criteria(dataForCriteria))
                .map(badge => badge.id);

            setUnlockedBadges(unlocked);
            setLoading(false);
        };

        fetchBadgeData();

    }, [user]);


  return (
    <TooltipProvider>
        <div className="flex flex-wrap gap-6">
            {allBadges.map(badge => {
                const isUnlocked = unlockedBadges.includes(badge.id);
                return (
                 <Tooltip key={badge.title}>
                    <TooltipTrigger>
                        <div className={cn(
                            "flex flex-col items-center gap-2 p-4 bg-card-foreground/5 rounded-lg border border-border w-32 h-32 justify-center transition-all",
                            isUnlocked ? badge.color : "text-muted-foreground/50 opacity-60"
                        )}>
                            {isUnlocked ? badge.icon : <Lock className="w-8 h-8"/>}
                            <p className="text-xs font-medium text-center text-foreground">{badge.title}</p>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{badge.description}</p>
                        {!isUnlocked && <p className="text-xs text-muted-foreground">(Locked)</p>}
                    </TooltipContent>
                </Tooltip>
            )})}
        </div>
    </TooltipProvider>
  );
}
