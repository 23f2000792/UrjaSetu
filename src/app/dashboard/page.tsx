
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, Leaf, DollarSign, ListTree, Sun } from "lucide-react";
import PortfolioChart from "@/components/dashboard/portfolio-chart";
import RecentActivity from "@/components/dashboard/recent-activity";
import { useCollection, useDoc, useUser, useFirestore } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import type { PortfolioAsset, SolarProject, Transaction, EnergyCredit } from '@/lib/mock-data';
import { Skeleton } from '@/components/ui/skeleton';

// Assuming Rupee icon is not available in lucide-react, using a simple string
const CurrencyIcon = () => <span className="h-4 w-4 text-muted-foreground">Rs.</span>;

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { data: userProfile, loading: profileLoading } = useDoc<any>(user && firestore ? doc(firestore, "users", user.uid) : null);
  
  const loading = userLoading || profileLoading;

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (userProfile?.role === 'seller') {
    return <SellerDashboard user={user} />;
  }
  
  return <UserDashboard user={user} />;
}


function UserDashboard({ user }: { user: any | null }) {
    const firestore = useFirestore();
    const [portfolioValue, setPortfolioValue] = useState(0);
    const [energyGenerated, setEnergyGenerated] = useState(0);
    const [carbonOffset, setCarbonOffset] = useState(0);
    
    const { data: transactions, loading: transactionsLoading } = useCollection<Transaction>(
        user && firestore ? query(collection(firestore, "transactions"), where("userId", "==", user.uid)) : null
    );
    const { data: projects, loading: projectsLoading } = useCollection<SolarProject>(
        user && firestore ? collection(firestore, "projects") : null
    );
    const { data: credits, loading: creditsLoading } = useCollection<EnergyCredit>(
        user && firestore ? collection(firestore, "energyCredits") : null
    );

    const loading = transactionsLoading || projectsLoading || creditsLoading;

    useEffect(() => {
        if (loading || !transactions || !projects || !credits) return;

        const projectsData = new Map(projects.map(p => [p.id, p]));
        const creditsData = new Map(credits.map(c => [c.id, c]));

        const aggregatedAssets: { [key: string]: { quantity: number; currentValue: number } } = {};

        transactions.forEach(tx => {
            if (tx.type !== 'Buy') return;

            const assetId = tx.projectId;
            const marketAsset = projectsData.get(assetId) || creditsData.get(assetId);
            const currentValue = (marketAsset as any)?.tokenPrice || (marketAsset as any)?.price || 0;

            if (!aggregatedAssets[assetId]) {
                aggregatedAssets[assetId] = { quantity: 0, currentValue: currentValue };
            }
            
            aggregatedAssets[assetId].quantity += tx.quantity;
            aggregatedAssets[assetId].currentValue = currentValue;
        });
        
        let totalValue = 0;
        let totalEnergy = 0;
        Object.values(aggregatedAssets).forEach(asset => {
            totalValue += asset.quantity * asset.currentValue;
            totalEnergy += asset.quantity * 120;
        });

        setPortfolioValue(totalValue);
        setEnergyGenerated(totalEnergy);
        setCarbonOffset(totalEnergy * 0.707);

    }, [transactions, projects, credits, loading]);

    const recentTransactions = transactions?.sort((a,b) => (b.timestamp as any).seconds - (a.timestamp as any).seconds).slice(0, 5) || [];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <CurrencyIcon />
          </CardHeader>
          <CardContent>
             {loading ? <Skeleton className="h-8 w-3/4" /> : <div className="text-2xl font-bold">Rs. {portfolioValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>}
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Generated</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{energyGenerated.toLocaleString()} kWh</div>}
            <p className="text-xs text-muted-foreground">Lifetime total from your assets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Offset</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{carbonOffset.toFixed(0)} kg CO₂e</div>}
            <p className="text-xs text-muted-foreground">Equivalent to planting {Math.round(carbonOffset/58).toLocaleString()} trees</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <PortfolioChart role="buyer"/>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity activities={recentTransactions} loading={loading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SellerDashboard({ user }: { user: any | null }) {
    const firestore = useFirestore();

    const { data: projects, loading: projectsLoading } = useCollection<SolarProject>(
        user && firestore ? query(collection(firestore, "projects"), where("ownerId", "==", user.uid)) : null
    );

    const projectIds = projects?.map(p => p.id) || [];

    const { data: sales, loading: salesLoading } = useCollection<Transaction>(
        user && firestore && projectIds.length > 0 ? query(collection(firestore, "transactions"), where("projectId", "in", projectIds)) : null
    );
    
    const loading = projectsLoading || salesLoading;

    const recentSales = sales?.sort((a, b) => (b.timestamp as any).seconds - (a.timestamp as any).seconds).slice(0, 10) || [];
    const totalRevenue = sales?.reduce((acc, sale) => acc + sale.totalCost, 0) || 0;
    const activeProjectsCount = projects?.filter(p => (p as any).status === 'Verified').length || 0;
    const tokensSold = sales?.reduce((acc, sale) => acc + sale.quantity, 0) || 0;
    const energySold = tokensSold * 120;
    const totalCapacity = projects?.reduce((acc, p) => acc + p.capacity, 0) || 0;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Solar Farm Owner Dashboard</h1>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                     {loading ? <Skeleton className="h-8 w-3/4" /> : <div className="text-2xl font-bold">Rs. {totalRevenue.toLocaleString('en-IN')}</div>}
                    <p className="text-xs text-muted-foreground">from token sales</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                    <ListTree className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{activeProjectsCount}</div>}
                     <p className="text-xs text-muted-foreground">Verified & listed projects</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Energy Sold (Est.)</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{energySold.toLocaleString()} kWh</div>}
                    <p className="text-xs text-muted-foreground">based on tokens sold</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
                    <Sun className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{(totalCapacity / 1000).toLocaleString()} MW</div>}
                    <p className="text-xs text-muted-foreground">Across all your projects</p>
                </CardContent>
            </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription>An overview of token sales and revenue.</CardDescription>
          </CardHeader>
          <CardContent>
            <PortfolioChart role="seller" />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Sales Activity</CardTitle>
            <CardDescription>A feed of recent token purchases for your projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity activities={recentSales} loading={loading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
