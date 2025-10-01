
"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CreditCard, ShieldCheck, Landmark, QrCode, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, runTransaction, collection, addDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import type { SolarProject, EnergyCredit, PortfolioAsset } from '@/lib/mock-data';
import type { User } from 'firebase/auth';

export default function TradePage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const id = params.id as string;

    const [quantity, setQuantity] = useState(1);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [asset, setAsset] = useState<SolarProject | EnergyCredit | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
          setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const isCredit = id.startsWith('credit-');
    const assetId = isCredit ? id.replace('credit-', '') : id;
    const collectionName = isCredit ? 'energyCredits' : 'projects';

    useEffect(() => {
        if (!assetId) return;
        const fetchAsset = async () => {
            setLoading(true);
            const docRef = doc(db, collectionName, assetId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setAsset({ id: docSnap.id, ...docSnap.data() } as SolarProject | EnergyCredit);
            } else {
                console.log("No such document!");
            }
            setLoading(false);
        };
        fetchAsset();
    }, [assetId, collectionName]);

    const handlePurchase = async () => {
        if (!user) {
            toast({ title: "Not Authenticated", description: "You must be logged in to make a purchase.", variant: "destructive" });
            return;
        }
        if (!asset) {
             toast({ title: "Error", description: "Asset could not be loaded.", variant: "destructive" });
            return;
        }

        setIsPurchasing(true);
        
        try {
            const projectRef = doc(db, collectionName, assetId);
            const portfolioAssetId = `${user.uid}_${assetId}`;
            const portfolioAssetRef = doc(db, "portfolioAssets", portfolioAssetId);
            
            await runTransaction(db, async (transaction) => {
                const projectDoc = await transaction.get(projectRef);
                const portfolioDoc = await transaction.get(portfolioAssetRef);

                if (!projectDoc.exists()) {
                    throw "Project does not exist!";
                }

                const currentProjectData = projectDoc.data() as SolarProject;
                const newTokensAvailable = currentProjectData.tokensAvailable - quantity;

                if (newTokensAvailable < 0) {
                    throw "Not enough tokens available for this purchase.";
                }

                // 1. Update project token count
                transaction.update(projectRef, { tokensAvailable: newTokensAvailable });

                // 2. Create a new transaction record
                const newTransactionRef = doc(collection(db, "transactions"));
                transaction.set(newTransactionRef, {
                    userId: user.uid,
                    projectId: assetId,
                    projectName: (asset as any).name || (asset as any).projectName,
                    quantity: quantity,
                    pricePerUnit: (asset as any).tokenPrice || (asset as any).price,
                    totalCost: quantity * ((asset as any).tokenPrice || (asset as any).price),
                    type: 'Buy',
                    status: 'Completed',
                    timestamp: serverTimestamp()
                });

                // 3. Create or update portfolio asset
                if (portfolioDoc.exists()) {
                    // Portfolio asset exists, update it
                    const currentPortfolioAsset = portfolioDoc.data() as PortfolioAsset;
                    const newQuantity = currentPortfolioAsset.quantity + quantity;
                    const newTotalCost = (currentPortfolioAsset.purchasePrice * currentPortfolioAsset.quantity) + (quantity * ((asset as any).tokenPrice || (asset as any).price));
                    const newAvgPrice = newTotalCost / newQuantity;
                    transaction.update(portfolioAssetRef, {
                        quantity: newQuantity,
                        purchasePrice: newAvgPrice,
                        currentValue: (asset as any).tokenPrice || (asset as any).price,
                    });
                } else {
                    // Portfolio asset does not exist, create it
                    const newPortfolioAsset: PortfolioAsset = {
                        id: assetId,
                        name: (asset as any).name || (asset as any).projectName,
                        type: isCredit ? 'Credit' : 'Project',
                        quantity: quantity,
                        purchasePrice: (asset as any).tokenPrice || (asset as any).price,
                        currentValue: (asset as any).tokenPrice || (asset as any).price,
                        userId: user.uid,
                    };
                    transaction.set(portfolioAssetRef, newPortfolioAsset);
                }
            });
            
            setShowConfirmation(true);

        } catch (e: any) {
            console.error("Purchase transaction failed: ", e);
            toast({
                title: "Purchase Failed",
                description: e.message || "Could not complete the purchase. Please check permissions and try again.",
                variant: "destructive",
            });
        } finally {
            setIsPurchasing(false);
        }
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!asset) {
        return <div>Asset not found</div>;
    }
    
    const name = (asset as any).name || `${(asset as any).projectName} Credits`;
    const price = (asset as any).tokenPrice || (asset as any).price;
    const unit = isCredit ? 'kWh' : 'Token(s)';
    const available = (asset as SolarProject).tokensAvailable || (asset as EnergyCredit).amount;

    const totalCost = quantity * price;

    return (
        <div className="max-w-4xl mx-auto">
            <Button asChild variant="outline" size="sm" className="mb-4">
                <Link href={`/marketplace/${id}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Details
                </Link>
            </Button>
        
            <Card className="overflow-hidden">
                <div className="grid md:grid-cols-[2fr_3fr]">
                    <div className="p-6 bg-muted/30">
                        <CardHeader className="p-0">
                            <CardTitle className="text-primary text-xl">{name}</CardTitle>
                            <CardDescription>You are purchasing {unit}.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 pt-6 space-y-4">
                            <div>
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input 
                                    id="quantity" 
                                    type="number" 
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    min="1"
                                    max={available}
                                    disabled={isPurchasing}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    {available.toLocaleString()} available
                                </p>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Price / {isCredit ? 'kWh' : 'Token'}</span>
                                    <span>Rs. {price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Quantity</span>
                                    <span>x {quantity}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-base">
                                    <span>Total Cost</span>
                                    <span>Rs. {totalCost.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </div>
                    <div className="p-6">
                        <Tabs defaultValue="card" className="w-full">
                             <TabsList className="grid w-full grid-cols-3 mb-6">
                                <TabsTrigger value="card" disabled={isPurchasing}><CreditCard className="mr-2 h-4 w-4"/>Card</TabsTrigger>
                                <TabsTrigger value="netbanking" disabled={isPurchasing}><Landmark className="mr-2 h-4 w-4"/>Net Banking</TabsTrigger>
                                <TabsTrigger value="upi" disabled={isPurchasing}><QrCode className="mr-2 h-4 w-4"/>UPI</TabsTrigger>
                            </TabsList>

                            <TabsContent value="card">
                                <CardHeader className="p-0">
                                    <CardTitle className="flex items-center gap-2 text-base">Card Details</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 pt-6 space-y-4">
                                    <div>
                                        <Label htmlFor="card-number">Card Number</Label>
                                        <Input id="card-number" placeholder="**** **** **** 1234" disabled={isPurchasing}/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="expiry">Expiry</Label>
                                            <Input id="expiry" placeholder="MM/YY" disabled={isPurchasing}/>
                                        </div>
                                        <div>
                                            <Label htmlFor="cvc">CVC</Label>
                                            <Input id="cvc" placeholder="123" disabled={isPurchasing}/>
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="name-on-card">Name on Card</Label>
                                        <Input id="name-on-card" placeholder="John Doe" disabled={isPurchasing}/>
                                    </div>
                                </CardContent>
                            </TabsContent>

                            <TabsContent value="netbanking">
                                 <CardHeader className="p-0">
                                    <CardTitle className="flex items-center gap-2 text-base">Select Bank</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 pt-6 space-y-4">
                                    <Select disabled={isPurchasing}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose your bank" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sbi">State Bank of India</SelectItem>
                                            <SelectItem value="hdfc">HDFC Bank</SelectItem>
                                            <SelectItem value="icici">ICICI Bank</SelectItem>
                                            <SelectItem value="axis">Axis Bank</SelectItem>
                                            <SelectItem value="kotak">Kotak Mahindra Bank</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">You will be redirected to your bank's portal to complete the payment.</p>
                                </CardContent>
                            </TabsContent>

                            <TabsContent value="upi">
                                <CardHeader className="p-0">
                                    <CardTitle className="flex items-center gap-2 text-base">UPI Payment</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 pt-6 space-y-4">
                                    <div>
                                        <Label htmlFor="upi-id">UPI ID</Label>
                                        <Input id="upi-id" placeholder="yourname@bank" disabled={isPurchasing}/>
                                    </div>
                                </CardContent>
                            </TabsContent>
                        </Tabs>

                         <CardFooter className="flex-col items-stretch p-0 pt-6 gap-4">
                            <Button size="lg" onClick={handlePurchase} disabled={isPurchasing}>
                                {isPurchasing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Pay Rs. {totalCost.toFixed(2)}
                            </Button>
                             <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                <span>Secure payment powered by UrjaSetu.</span>
                            </div>
                        </CardFooter>
                    </div>
                </div>
            </Card>

            <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <CheckCircle className="h-6 w-6 text-primary" />
                        Payment Successful
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Your purchase of <strong>{quantity} {unit}</strong> of <strong>{name}</strong> for <strong>Rs. {totalCost.toFixed(2)}</strong> was successful. The assets have been added to your portfolio.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogAction asChild>
                       <Button onClick={() => router.push('/portfolio')} className="w-full">
                            View Portfolio
                       </Button>
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    );
}
