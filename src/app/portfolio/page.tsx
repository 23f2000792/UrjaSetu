import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { portfolioAssets } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

export default function PortfolioPage() {
    const totalValue = portfolioAssets.reduce((acc, asset) => acc + (asset.currentValue * asset.quantity), 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">My Portfolio</h1>
        <Button variant="outline">
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
            <p className="text-4xl font-bold text-primary">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
                  <TableCell className="text-right">${asset.purchasePrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${asset.currentValue.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">${(asset.currentValue * asset.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-2 justify-center">
                        <Button variant="outline" size="sm">Sell</Button>
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
