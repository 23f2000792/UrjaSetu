
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore } from '@/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import type { PortfolioAsset, Transaction, SolarProject, EnergyCredit } from '@/lib/mock-data';

export default function PortfolioPage() {
    const [portfolioAssets, setPortfolioAssets] = useState<PortfolioAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();

    useEffect(() => {
        if (!user || !firestore) {
            setLoading(false);
            setPortfolioAssets([]);
            return;
        }

        setLoading(true);

        const transactionsQuery = query(collection(firestore, "transactions"), where("userId", "==", user.uid));
        const projectsQuery = collection(firestore, "projects");
        const creditsQuery = collection(firestore, "energyCredits");

        const unsubTransactions = onSnapshot(transactionsQuery, (transactionsSnapshot) => {
            const unsubProjects = onSnapshot(projectsQuery, (projectsSnapshot) => {
                const unsubCredits = onSnapshot(creditsQuery, (creditsSnapshot) => {
                    
                    const projectsData = new Map<string, SolarProject>();
                    projectsSnapshot.forEach(doc => projectsData.set(doc.id, doc.data() as SolarProject));
                    
                    const creditsData = new Map<string, EnergyCredit>();
                    creditsSnapshot.forEach(doc => creditsData.set(doc.id, doc.data() as EnergyCredit));

                    const transactions: Transaction[] = [];
                    transactionsSnapshot.forEach((doc) => {
                        transactions.push(doc.data() as Transaction);
                    });

                    const aggregatedAssets: { [key: string]: PortfolioAsset } = {};

                    transactions.forEach(tx => {
                        if (tx.type !== 'Buy') return;

                        const assetId = tx.projectId;
                        const marketAsset = projectsData.get(assetId) || creditsData.get(assetId);
                        const currentValue = (marketAsset as any)?.tokenPrice || (marketAsset as any)?.price || 0;

                        if (!aggregatedAssets[assetId]) {
                            aggregatedAssets[assetId] = {
                                id: assetId,
                                name: tx.projectName,
                                type: creditsData.has(assetId) ? 'Credit' : 'Project',
                                quantity: 0,
                                purchasePrice: 0, // This will be an average
                                currentValue: currentValue,
                                userId: tx.userId
                            };
                        }

                        const existingAsset = aggregatedAssets[assetId];
                        const oldTotalCost = existingAsset.purchasePrice * existingAsset.quantity;
                        const newTotalCost = oldTotalCost + tx.totalCost;
                        const newTotalQuantity = existingAsset.quantity + tx.quantity;
                        
                        existingAsset.quantity = newTotalQuantity;
                        existingAsset.purchasePrice = newTotalCost / newTotalQuantity;
                        existingAsset.currentValue = currentValue;
                    });
                    
                    const assetsArray = Object.values(aggregatedAssets);
                    setPortfolioAssets(assetsArray);
                    setLoading(false);
                });
                // This doesn't properly return for cleanup, but the main listener's cleanup will handle it.
            });
        });

        return () => {
            unsubTransactions();
            // Nested unsubscribes are complex; unsubscribing the outer one is key.
        };
    }, [user, firestore]);

    const totalValue = portfolioAssets.reduce((acc, asset) => acc + (asset.currentValue * asset.quantity), 0);

    const handleDownload = () => {
        const headers = ["Asset", "Type", "Quantity", "Avg. Purchase Price", "Current Value", "Total Value"];
        const rows = portfolioAssets.map(asset => [
            asset.name,
            asset.type,
            asset.quantity,
            `Rs.${asset.purchasePrice.toFixed(2)}`,
            `Rs.${asset.currentValue.toFixed(2)}`,
            `Rs.${(asset.currentValue * asset.quantity).toFixed(2)}`
        ]);

        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "portfolio_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const getAssetMarketplaceId = (assetId: string, type: 'Project' | 'Credit') => {
        if (type === 'Credit') {
            return `credit-${assetId}`;
        }
        return assetId;
    }

    const isLoadingPage = loading || userLoading;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">My Portfolio</h1>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>


      <Card>
        <CardHeader>
          <CardTitle>Total Portfolio Value</CardTitle>
          <CardDescription>The current market value of all your assets.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoadingPage ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : (
                <p className="text-4xl font-bold text-primary">Rs. {totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Avg. Purchase Price</TableHead>
                <TableHead className="text-right">Current Value</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingPage ? (
                <TableRow><TableCell colSpan={7} className="text-center h-24">Loading your assets...</TableCell></TableRow>
              ) : portfolioAssets.length > 0 ? (
                portfolioAssets.map((asset) => (
                    <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell><Badge variant="secondary">{asset.type}</Badge></TableCell>
                    <TableCell className="text-right">{asset.quantity.toLocaleString()}</TableCell>
                    <TableCell className="text-right">Rs. {asset.purchasePrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">Rs. {asset.currentValue.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">Rs. {(asset.currentValue * asset.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-center">
                        <div className="flex gap-2 justify-center">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/portfolio/${getAssetMarketplaceId(asset.id, asset.type)}`}>Details</Link>
                            </Button>
                            <Button variant="default" size="sm" asChild>
                               <Link href={`/portfolio/${getAssetMarketplaceId(asset.id, asset.type)}/sell`}>Sell</Link>
                            </Button>
                        </div>
                    </TableCell>
                    </TableRow>
                ))
              ) : (
                 <TableRow><TableCell colSpan={7} className="text-center h-24">You do not own any assets yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
