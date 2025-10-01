
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, Leaf, DollarSign, ListTree, Sun } from "lucide-react";
import PortfolioChart from "@/components/dashboard/portfolio-chart";
import RecentActivity from "@/components/dashboard/recent-activity";
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import type { PortfolioAsset, SolarProject, Transaction, EnergyCredit } from '@/lib/mock-data';
import { Skeleton } from '@/components/ui/skeleton';

// Assuming Rupee icon is not available in lucide-react, using a simple string
const CurrencyIcon = () => <span className="h-4 w-4 text-muted-foreground">Rs.</span>;

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const docRef = doc(db, "users", user.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setRole(docSnap.data().role);
          } else {
            console.log("No such user document!");
            setRole('buyer'); // Default to buyer if no role found
          }
        } catch (error) {
            console.error("Error getting user document:", error);
            setRole('buyer'); // Default to buyer on error
        }
      } else {
        // User is signed out
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (role === 'seller') {
    return <SellerDashboard user={user} />;
  }
  
  // Default to UserDashboard if role is 'buyer' or not set (for fallback)
  return <UserDashboard user={user} />;
}


function UserDashboard({ user }: { user: User | null }) {
    const [portfolioValue, setPortfolioValue] = useState(0);
    const [energyGenerated, setEnergyGenerated] = useState(0);
    const [carbonOffset, setCarbonOffset] = useState(0);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);

        const transactionsQuery = query(collection(db, "transactions"), where("userId", "==", user.uid));
        const projectsQuery = collection(db, "projects");
        const creditsQuery = collection(db, "energyCredits");

        const unsubTransactions = onSnapshot(transactionsQuery, (transactionsSnapshot) => {
            const unsubProjects = onSnapshot(projectsQuery, (projectsSnapshot) => {
                const unsubCredits = onSnapshot(creditsQuery, (creditsSnapshot) => {
                    
                    const projectsData = new Map<string, SolarProject>();
                    projectsSnapshot.forEach(doc => projectsData.set(doc.id, doc.data() as SolarProject));
                    
                    const creditsData = new Map<string, EnergyCredit>();
                    creditsSnapshot.forEach(doc => creditsData.set(doc.id, doc.data() as EnergyCredit));

                    const userTransactions: Transaction[] = [];
                    transactionsSnapshot.forEach((doc) => {
                        userTransactions.push({ id: doc.id, ...doc.data() } as Transaction);
                    });
                    
                    const aggregatedAssets: { [key: string]: { quantity: number; currentValue: number } } = {};

                    userTransactions.forEach(tx => {
                        if (tx.type !== 'Buy') return;

                        const assetId = tx.projectId;
                        const marketAsset = projectsData.get(assetId) || creditsData.get(assetId);
                        const currentValue = (marketAsset as any)?.tokenPrice || (marketAsset as any)?.price || 0;

                        if (!aggregatedAssets[assetId]) {
                            aggregatedAssets[assetId] = { quantity: 0, currentValue: currentValue };
                        }
                        
                        aggregatedAssets[assetId].quantity += tx.quantity;
                        aggregatedAssets[assetId].currentValue = currentValue; // Ensure current value is updated
                    });
                    
                    let totalValue = 0;
                    let totalEnergy = 0;
                    Object.values(aggregatedAssets).forEach(asset => {
                        totalValue += asset.quantity * asset.currentValue;
                        // Assuming 1 token = 120kWh generated over its lifetime so far
                        totalEnergy += asset.quantity * 120;
                    });

                    setPortfolioValue(totalValue);
                    setEnergyGenerated(totalEnergy);
                    // Assuming 1 kWh = 0.707 kg CO2e
                    setCarbonOffset(totalEnergy * 0.707);

                    setRecentTransactions(userTransactions.sort((a,b) => b.timestamp.seconds - a.timestamp.seconds).slice(0, 5));
                    setLoading(false);
                });
                return unsubCredits;
            });
            return unsubProjects;
        });

        return () => {
            unsubTransactions();
        };
    }, [user]);

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

function SellerDashboard({ user }: { user: User | null }) {
    const [projects, setProjects] = useState<SolarProject[]>([]);
    const [salesByProject, setSalesByProject] = useState<{ [projectId: string]: Transaction[] }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const projectsQuery = query(collection(db, "projects"), where("ownerId", "==", user.uid));
        
        const unsubProjects = onSnapshot(projectsQuery, (projectsSnapshot) => {
            const projectsData: SolarProject[] = [];
            const projectIds: string[] = [];
            
            projectsSnapshot.forEach((doc) => {
                const project = { id: doc.id, ...doc.data() } as SolarProject;
                projectsData.push(project);
                projectIds.push(project.id);
            });
            setProjects(projectsData);
            setLoading(false);
            
            // Set up listeners for each project's transactions
            const salesListeners = projectIds.map(projectId => {
                const salesQuery = query(collection(db, "transactions"), where("projectId", "==", projectId));
                return onSnapshot(salesQuery, (salesSnapshot) => {
                    const salesData: Transaction[] = [];
                    salesSnapshot.forEach(doc => {
                        salesData.push({ id: doc.id, ...doc.data() } as Transaction);
                    });
                    setSalesByProject(prevSales => ({
                        ...prevSales,
                        [projectId]: salesData
                    }));
                });
            });

            return () => {
                salesListeners.forEach(unsub => unsub());
            };
        });

        return () => {
            unsubProjects();
        };
    }, [user]);

    const allSales = Object.values(salesByProject).flat();
    const recentSales = allSales.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds).slice(0, 10);

    const totalRevenue = allSales.reduce((acc, sale) => acc + sale.totalCost, 0);
    const activeProjectsCount = projects.filter(p => (p as any).status === 'Verified').length;
    
    const tokensSold = allSales.reduce((acc, sale) => acc + sale.quantity, 0);
    const energySold = tokensSold * 120; // Assuming 1 token = 120kWh
    
    const totalCapacity = projects.reduce((acc, p) => acc + p.capacity, 0);

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

