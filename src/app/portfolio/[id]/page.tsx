
"use client"

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, TrendingUp, PieChart, Wallet, ShoppingCart, Send } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { SolarProject, EnergyCredit, PortfolioAsset } from '@/lib/mock-data';
import type { User } from 'firebase/auth';

export default function PortfolioAssetDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string; // This is the marketplace ID
    const [marketAsset, setMarketAsset] = useState<SolarProject | EnergyCredit | null>(null);
    const [portfolioAsset, setPortfolioAsset] = useState<PortfolioAsset | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const isCredit = id.startsWith('credit-');
    const assetId = isCredit ? id.replace('credit-', '') : id; // This is the raw asset ID (e.g., sp1)
    
    useEffect(() => {
        if (!assetId || !user) return;

        const fetchAssets = async () => {
            setLoading(true);
            
            // Fetch portfolio asset using composite ID
            const portfolioAssetId = `${user.uid}_${assetId}`;
            const portfolioDocRef = doc(db, "portfolioAssets", portfolioAssetId);
            const portfolioDocSnap = await getDoc(portfolioDocRef);
            if (portfolioDocSnap.exists()) {
                setPortfolioAsset({ id: portfolioDocSnap.id, ...portfolioDocSnap.data() } as PortfolioAsset);
            }

            // Fetch market asset
            const marketCollectionName = isCredit ? 'energyCredits' : 'projects';
            const marketDocRef = doc(db, marketCollectionName, assetId);
            const marketDocSnap = await getDoc(marketDocRef);
            if (marketDocSnap.exists()) {
                setMarketAsset({ id: marketDocSnap.id, ...marketDocSnap.data() } as SolarProject | EnergyCredit);
            }

            setLoading(false);
        };

        fetchAssets();
    }, [assetId, isCredit, user]);

    if (loading) {
        return <div>Loading asset details...</div>;
    }

    if (!marketAsset || !portfolioAsset) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <h1 className="text-2xl font-bold">Asset not found</h1>
                <p className="text-muted-foreground mt-2">The asset you are looking for is not in your portfolio.</p>
                <Button asChild variant="outline" className="mt-4" onClick={() => router.back()}>
                    <span className="cursor-pointer flex items-center">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Portfolio
                    </span>
                </Button>
            </div>
        );
    }
    
    const name = (marketAsset as any).name || `${(marketAsset as any).projectName} Credits`;
    const totalValue = portfolioAsset.quantity * portfolioAsset.currentValue;

    return (
        <div className="space-y-8">
            <div>
                 <Button asChild variant="outline" size="sm" className="mb-4">
                    <Link href="/portfolio">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Portfolio
                    </Link>
                </Button>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">{name}</h1>
                <p className="text-muted-foreground mt-2">Manage your holdings for this asset.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                         <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Wallet /> Your Holdings</CardTitle>
                         </CardHeader>
                         <CardContent className="grid sm:grid-cols-2 gap-6 text-lg">
                            <div>
                                <p className="text-sm text-muted-foreground">Quantity Held</p>
                                <p className="font-bold text-2xl">{portfolioAsset.quantity.toLocaleString()} {portfolioAsset.type === 'Project' ? 'Tokens' : 'kWh'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Current Market Value</p>
                                <p className="font-bold text-2xl text-primary">Rs. {totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                             <div>
                                <p className="text-sm text-muted-foreground">Average Purchase Price</p>
                                <p className="font-bold text-2xl">Rs. {portfolioAsset.purchasePrice.toFixed(2)}</p>
                            </div>
                             <div>
                                <p className="text-sm text-muted-foreground">Unrealized Gain/Loss</p>
                                <p className="font-bold text-2xl">Rs. {(totalValue - (portfolioAsset.purchasePrice * portfolioAsset.quantity)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                         </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Asset Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="flex items-start gap-4">
                                <Image 
                                    src={marketAsset.imageUrl}
                                    alt={name}
                                    width={150}
                                    height={100}
                                    className="rounded-lg object-cover"
                                    data-ai-hint={(marketAsset as any).imageHint}
                                />
                                <div>
                                    <h3 className="font-bold">{name}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{marketAsset.description}</p>
                                     <Button asChild variant="link" className="p-0 h-auto mt-2">
                                        <Link href={`/marketplace/${id}`}>View on Marketplace <ArrowLeft className="h-4 w-4 rotate-180 ml-1" /></Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button size="lg" className="w-full" asChild>
                                <Link href={`/marketplace/${id}/trade`}><ShoppingCart className="mr-2"/> Buy More</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="w-full" asChild>
                                <Link href={`/portfolio/${id}/sell`}><Send className="mr-2"/> Sell</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

    