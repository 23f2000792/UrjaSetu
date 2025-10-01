
"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, ShieldCheck, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
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
import { doc, getDoc, collection, serverTimestamp, addDoc } from 'firebase/firestore';
import type { SolarProject, EnergyCredit, Transaction } from '@/lib/mock-data';
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
            const price = (asset as any).tokenPrice || (asset as any).price;
            const sellerId = (asset as SolarProject).ownerId;

            // Create a transaction document. A backend function would listen to this collection.
            const transactionData: Omit<Transaction, 'id'> = {
                userId: user.uid,
                sellerId: sellerId,
                projectId: assetId,
                projectName: (asset as any).name || (asset as any).projectName,
                quantity: quantity,
                pricePerUnit: price,
                totalCost: quantity * price,
                type: 'Buy',
                status: 'Pending', // Status is pending until backend processes it.
                timestamp: serverTimestamp() as any
            };

            await addDoc(collection(db, "transactions"), transactionData);
            
            setShowConfirmation(true);

        } catch (e: any) {
            console.error("Purchase failed: ", e);
            toast({
                title: "Purchase Failed",
                description: e.message || "Could not complete the purchase. Please check permissions.",
                variant: "destructive",
            });
        } finally {
            setIsPurchasing(false);
        }
    };


    if (loading) {
        return <div className="max-w-xl mx-auto p-4"><Loader2 className="mx-auto h-12 w-12 animate-spin text-primary"/></div>;
    }

    if (!asset) {
        return <div className="text-center p-8">Asset not found</div>;
    }
    
    const name = (asset as any).name || `${(asset as any).projectName} Credits`;
    const price = (asset as any).tokenPrice || (asset as any).price;
    const unit = isCredit ? 'kWh' : 'Token(s)';
    const available = (asset as SolarProject).tokensAvailable || (asset as EnergyCredit).amount;

    const totalCost = quantity * price;

    return (
        <div className="max-w-xl mx-auto">
            <Button asChild variant="outline" size="sm" className="mb-4">
                <Link href={`/marketplace/${id}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Details
                </Link>
            </Button>
        
            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-primary text-xl">Buy {name}</CardTitle>
                    <CardDescription>You are purchasing {unit}. Your purchase will be processed securely.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total Cost</span>
                            <span>Rs. {totalCost.toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex-col items-stretch p-6 pt-2 gap-4">
                    <Button size="lg" onClick={handlePurchase} disabled={isPurchasing}>
                        {isPurchasing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Pay Now
                    </Button>
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span>Secure payment powered by UrjaSetu.</span>
                    </div>
                </CardFooter>
            </Card>

            <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <CheckCircle className="h-6 w-6 text-primary" />
                        Purchase Submitted
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Your purchase of <strong>{quantity} {unit}</strong> of <strong>{name}</strong> for <strong>Rs. {totalCost.toFixed(2)}</strong> has been submitted for processing. The assets will appear in your portfolio shortly.
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
