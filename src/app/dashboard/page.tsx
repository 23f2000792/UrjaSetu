
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, Leaf, ShieldAlert } from "lucide-react";
import PortfolioChart from "@/components/dashboard/portfolio-chart";
import RecentActivity from "@/components/dashboard/recent-activity";
import { AdminStats } from "@/components/admin/admin-stats";

// Assuming Rupee icon is not available in lucide-react, using a simple string
const CurrencyIcon = () => <span className="h-4 w-4 text-muted-foreground">Rs.</span>;

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // We'll use localStorage to persist the role selection for this simulation
    const userRole = localStorage.getItem('userRole');
    setRole(userRole);
  }, []);

  if (role === null) {
    // You can add a loading spinner here
    return <div>Loading dashboard...</div>;
  }

  if (role === 'seller') {
    return <AdminDashboard />;
  }
  
  if (role === 'buyer') {
    return <UserDashboard />;
  }

  return <div>Loading dashboard...</div>;
}


function UserDashboard() {
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
            <div className="text-2xl font-bold">Rs. 12,45,000.00</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Generated</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234 kWh</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Offset</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">874 kg CO₂e</div>
            <p className="text-xs text-muted-foreground">Equivalent to planting 15 trees</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <PortfolioChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Seller Dashboard</h1>

      <AdminStats />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Marketplace Performance</CardTitle>
            <CardDescription>An overview of trading volume and activity.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for a more detailed admin-specific chart */}
            <PortfolioChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Platform Activity</CardTitle>
            <CardDescription>A feed of recent user actions.</CardDescription>
          </CardHeader>
          <CardContent>
             {/* Placeholder for admin-specific activity feed */}
            <RecentActivity />
          </CardContent>
        </Card>
      </div>
       <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldAlert />Monitoring</CardTitle>
            <CardDescription>Key areas for administrative oversight.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                  <CardHeader>
                      <CardTitle className="text-lg">Pending KYC</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-3xl font-bold">5</p>
                      <p className="text-sm text-muted-foreground">verifications to review</p>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader>
                      <CardTitle className="text-lg">Open Disputes</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-3xl font-bold">2</p>
                      <p className="text-sm text-muted-foreground">cases require attention</p>
                  </CardContent>
              </Card>
               <Card>
                  <CardHeader>
                      <CardTitle className="text-lg">Suspicious Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-3xl font-bold">1</p>
                      <p className="text-sm text-muted-foreground">flagged transaction</p>
                  </CardContent>
              </Card>
          </CardContent>
        </Card>
    </div>
  );
}
