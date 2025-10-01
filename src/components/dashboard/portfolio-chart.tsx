
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, getDocs } from "firebase/firestore";
import { type User } from "firebase/auth";
import { type Transaction, type SolarProject } from "@/lib/mock-data";
import { format, startOfMonth } from "date-fns";
import { Skeleton } from "../ui/skeleton";

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--primary))",
  },
}

interface PortfolioChartProps {
    role?: 'buyer' | 'seller';
}

export default function PortfolioChart({ role = 'buyer' }: PortfolioChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(setUser);
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    };

    setLoading(true);

    if (role === 'seller') {
        // --- SELLER LOGIC ---
        const fetchSellerData = async () => {
            // 1. Get seller's projects
            const projectsQuery = query(collection(db, "projects"), where("ownerId", "==", user.uid));
            const projectsSnapshot = await getDocs(projectsQuery);
            const projectIds = projectsSnapshot.docs.map(doc => doc.id);

            if (projectIds.length === 0) {
                setData([{ month: "Jan", value: 0 }, { month: "Feb", value: 0 }, { month: "Mar", value: 0 }]);
                setLoading(false);
                return;
            }

            // 2. Query transactions for those projects
            const transactionsQuery = query(collection(db, "transactions"), where("projectId", "in", projectIds));
            const unsubscribe = onSnapshot(transactionsQuery, (snapshot) => {
                const monthlyRevenue: { [key: string]: number } = {};
                snapshot.forEach(doc => {
                    const tx = doc.data() as Transaction;
                    if (tx.timestamp) {
                        const month = format(startOfMonth(tx.timestamp.toDate()), 'MMM yyyy');
                        if (!monthlyRevenue[month]) {
                            monthlyRevenue[month] = 0;
                        }
                        monthlyRevenue[month] += tx.totalCost;
                    }
                });

                const chartData = Object.keys(monthlyRevenue).map(month => ({
                    month: month.split(' ')[0],
                    value: monthlyRevenue[month],
                }));

                setData(chartData.length > 0 ? chartData : [{ month: "Jan", value: 0 }, { month: "Feb", value: 0 }]);
                setLoading(false);
            });
            return unsubscribe;
        };
        const unsubscribe = fetchSellerData();
        return () => { unsubscribe.then(unsub => unsub && unsub()) };

    } else {
        // --- BUYER LOGIC (original logic) ---
        const q = query(
            collection(db, "transactions"), 
            where("userId", "==", user.uid),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const transactions: Transaction[] = [];
            snapshot.forEach(doc => {
                transactions.push(doc.data() as Transaction);
            });

            const monthlyData: { [key: string]: number } = {};
            transactions.forEach(tx => {
                if (tx.timestamp) {
                    const month = format(startOfMonth(tx.timestamp.toDate()), 'MMM yyyy');
                    if (!monthlyData[month]) {
                        monthlyData[month] = 0;
                    }
                    monthlyData[month] += tx.totalCost;
                }
            });
            
            let runningTotal = 0;
            const chartData = Object.keys(monthlyData).map(month => {
                runningTotal += monthlyData[month];
                return {
                    month: month.split(' ')[0],
                    value: runningTotal,
                };
            });

            if (chartData.length === 0) {
              setData([
                { month: "Jan", value: 0 }, { month: "Feb", value: 0 }, { month: "Mar", value: 0 },
                { month: "Apr", value: 0 }, { month: "May", value: 0 }, { month: "Jun", value: 0 }
              ]);
            } else {
               setData(chartData);
            }

            setLoading(false);
        });
        return () => unsubscribe();
    }

  }, [user, role]);

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 20 }}>
          <XAxis dataKey="month" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis 
            stroke="hsl(var(--foreground))" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `Rs.${Number(value) / 1000}k`} 
          />
          <Tooltip 
            cursor={{ fill: 'hsl(var(--card))' }} 
            content={<ChartTooltipContent 
                formatter={(value) => `Rs. ${Number(value).toLocaleString('en-IN')}`} 
            />} 
           />
          <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
