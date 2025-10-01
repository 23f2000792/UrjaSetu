
"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { auth, db } from '@/lib/firebase';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { SolarProject, EnergyCredit, PortfolioAsset } from '@/lib/mock-data';

export default function SellPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const id = params.id as string;

    const [quantity, setQuantity] = useState(1);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [marketAsset, setMarketAsset] = useState<SolarProject | EnergyCredit | null>(null);
    const [portfolioAsset, setPortfolioAsset] = useState<PortfolioAsset | null>(null);
    const [loading, setLoading] = useState(true);

    const isCredit = id.startsWith('credit-');
    const assetId = isCredit ? id.replace('credit-', '') : id;

     useEffect(() => {
        if (!assetId) return;

        const fetchAssets = async () => {
            setLoading(true);
            
            // Fetch portfolio asset
            const portfolioDocRef = doc(db, "portfolioAssets", assetId);
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
    }, [assetId, isCredit]);
    
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!marketAsset || !portfolioAsset) {
        return <div>Asset not found in your portfolio.</div>;
    }
    
    const name = (marketAsset as any).name || `${(marketAsset as any).projectName} Credits`;
    const unit = portfolioAsset.type === 'Project' ? 'Token(s)' : 'kWh';
    const price = portfolioAsset.currentValue;

    const totalValue = quantity * price;

    const handleSell = async () => {
        const user = auth.currentUser;
        if (!user || !user.email) {
            toast({ title: "Error", description: "You must be logged in to sell assets.", variant: "destructive" });
            return;
        }

        if (quantity > portfolioAsset.quantity) {
             toast({ title: "Invalid Quantity", description: "You cannot sell more than you own.", variant: "destructive" });
            return;
        }
        
        if (!password) {
            toast({ title: "Password Required", description: "Please enter your password to confirm the sale.", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        
        try {
            // Re-authenticate user for security
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);

            // If re-authentication is successful, proceed with the sale logic
            console.log("User re-authenticated. Processing sale...");
            // In a real app, you would now call a backend function to execute the trade
            
            setTimeout(() => {
                 toast({
                    title: "Sale Successful",
                    description: `You sold ${quantity} ${unit} of ${name}.`,
                });
                setShowConfirmation(true);
                setIsLoading(false);
            }, 1500);

        } catch (error) {
            console.error(error);
            toast({
                title: "Authentication Failed",
                description: "The password you entered is incorrect. Please try again.",
                variant: "destructive",
            });
            setIsLoading(false);
        }
    };


    return (
        <div className="max-w-2xl mx-auto">
            <Button asChild variant="outline" size="sm" className="mb-4">
                <Link href={`/portfolio/${id}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Holding Details
                </Link>
            </Button>
        
            <Card>
                <CardHeader>
                    <CardTitle>Sell {name}</CardTitle>
                    <CardDescription>
                        You currently hold {portfolioAsset.quantity.toLocaleString()} {unit}. 
                        The current market price is Rs. {price.toFixed(2)} per {portfolioAsset.type === 'Project' ? 'Token' : 'kWh'}.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label htmlFor="quantity">Quantity to Sell</Label>
                        <Input 
                            id="quantity" 
                            type="number" 
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            max={portfolioAsset.quantity}
                        />
                    </div>

                    <Separator />

                    <div className="space-y-2 text-base">
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Market Price</span>
                            <span>Rs. {price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Quantity</span>
                            <span>x {quantity}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Estimated Proceeds</span>
                            <span>Rs. {totalValue.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground pt-1">This amount does not include potential transaction fees.</p>
                    </div>

                    <Separator />
                    
                    <div className="space-y-2">
                        <Label htmlFor="password" className="flex items-center gap-2"><Lock /> Confirm with Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password to confirm sale"
                            disabled={isLoading}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button size="lg" className="w-full" onClick={handleSell} disabled={isLoading}>
                         {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm & Sell
                    </Button>
                </CardFooter>
            </Card>

             <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Sale Confirmed</AlertDialogTitle>
                        <AlertDialogDescription>
                            Your sale of <strong>{quantity} {unit}</strong> of <strong>{name}</strong> for an estimated <strong>Rs. {totalValue.toFixed(2)}</strong> has been processed. The funds will be credited to your account shortly.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogAction asChild>
                       <Button onClick={() => router.push('/portfolio')} className="w-full">
                            Return to Portfolio
                       </Button>
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

    