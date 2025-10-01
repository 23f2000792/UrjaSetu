
"use client"

import { useParams } from 'next/navigation';
import { solarProjects, energyCredits } from '@/lib/mock-data';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Zap, MapPin, TrendingUp, FileText, CheckCircle, Package, Download } from 'lucide-react';
import Link from 'next/link';
import PortfolioChart from '@/components/dashboard/portfolio-chart'; // Reusing for demo

export default function AssetDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const isCredit = id.startsWith('credit-');
    const assetId = isCredit ? id.replace('credit-', '') : id;
    
    const asset = isCredit 
        ? energyCredits.find(c => c.id === assetId) 
        : solarProjects.find(p => p.id === assetId);

    if (!asset) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <h1 className="text-2xl font-bold">Asset not found</h1>
                <p className="text-muted-foreground mt-2">The asset you are looking for does not exist.</p>
                <Button asChild variant="outline" className="mt-4">
                    <Link href="/marketplace">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Marketplace
                    </Link>
                </Button>
            </div>
        );
    }

    const project = isCredit ? null : asset as typeof solarProjects[0];
    const credit = isCredit ? asset as typeof energyCredits[0] : null;

    const name = project?.name || `${credit?.projectName} Credits`;

    return (
        <div className="space-y-8">
            <div>
                 <Button asChild variant="outline" size="sm" className="mb-4">
                    <Link href="/marketplace">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Marketplace
                    </Link>
                </Button>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">{name}</h1>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                         <CardContent className="p-0">
                            <Image 
                                src={asset.imageUrl}
                                alt={name}
                                width={1200}
                                height={800}
                                className="w-full h-auto max-h-[450px] object-cover rounded-t-lg"
                                data-ai-hint={asset.imageHint}
                            />
                         </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{asset.description}</p>
                        </CardContent>
                    </Card>
                    
                    {project && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Historical Performance</CardTitle>
                                <CardDescription>Simulated energy generation over the last 12 months.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <PortfolioChart />
                            </CardContent>
                        </Card>
                    )}

                </div>
                <div className="space-y-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                           <CardTitle className="text-xl">
                                {isCredit ? 'Credit Details' : 'Project Details'}
                           </CardTitle>
                           <Badge variant="secondary" className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" /> Verified
                           </Badge>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                           {project && (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground flex items-center gap-2"><MapPin/>Location</span>
                                    <span className="font-medium">{project.location}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground flex items-center gap-2"><Zap/>Capacity</span>
                                    <span className="font-medium">{(project.capacity / 1000).toLocaleString()} MW</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground flex items-center gap-2"><TrendingUp/>Est. APY</span>
                                    <span className="font-medium text-primary">{project.expectedYield}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground flex items-center gap-2"><Package/>Panel Type</span>
                                    <span className="font-medium">{project.panelType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Operator</span>
                                    <span className="font-medium">{project.operator}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tokens Available</span>
                                    <span className="font-medium">{project.tokensAvailable.toLocaleString()} / {project.totalTokens.toLocaleString()}</span>
                                </div>
                            </>
                           )}
                           {credit && (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Project</span>
                                    <span className="font-medium">{credit.projectName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Vintage</span>
                                    <span className="font-medium">{credit.vintage}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Amount</span>
                                    <span className="font-medium">{credit.amount.toLocaleString()} kWh</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Credit Type</span>
                                    <span className="font-medium">{credit.creditType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Verifier</span>
                                    <span className="font-medium">{credit.verifier}</span>
                                </div>
                            </>
                           )}

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Price</span>
                                    <p className="text-2xl font-bold">Rs. {asset.price?.toFixed(2) || (asset as any).tokenPrice.toFixed(2)}</p>
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    <Button size="lg" className="w-full" asChild>
                        <Link href={`/marketplace/${id}/trade`}>Buy Now</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
