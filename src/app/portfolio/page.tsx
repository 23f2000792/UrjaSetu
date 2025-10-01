
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { portfolioAssets } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import Link from "next/link";

export default function PortfolioPage() {
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

    const getAssetId = (assetId: string, type: 'Project' | 'Credit') => {
        if (type === 'Credit') {
            // The mock ID for credits is `ec` + number, we need `credit-ec` + number for URL
            return `credit-${assetId}`;
        }
        return assetId;
    }

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
            <p className="text-4xl font-bold text-primary">Rs. {totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
              {portfolioAssets.map((asset) => (
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
                            <Link href={`/portfolio/${getAssetId(asset.id, asset.type)}`}>Details</Link>
                        </Button>
                        <Button variant="default" size="sm" asChild>
                           <Link href={`/portfolio/${getAssetId(asset.id, asset.type)}/sell`}>Sell</Link>
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
