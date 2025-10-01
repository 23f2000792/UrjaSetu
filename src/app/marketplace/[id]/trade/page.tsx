
"use client"

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { solarProjects, energyCredits } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CreditCard, ShieldCheck, Landmark, QrCode, CheckCircle, XCircle } from 'lucide-react';
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
} from "@/components/ui/alert-dialog"

export default function TradePage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const id = params.id as string;

    const [quantity, setQuantity] = useState(1);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);


    const isCredit = id.startsWith('credit-');
    const assetId = isCredit ? id.replace('credit-', '') : id;

    const asset = isCredit
        ? energyCredits.find(c => c.id === assetId)
        : solarProjects.find(p => p.id === assetId);

    if (!asset) {
        return <div>Asset not found</div>;
    }
    
    const name = (asset as any).name || `${(asset as any).projectName} Credits`;
    const price = (asset as any).tokenPrice || (asset as any).price;
    const unit = isCredit ? 'kWh' : 'Token(s)';

    const totalCost = quantity * price;

    const handlePurchase = () => {
        // Mock purchase logic
        toast({
            title: "Processing Payment...",
            description: `Attempting to purchase ${quantity} ${unit} of ${name}.`,
        });

        // Simulate a successful payment
        setPurchaseSuccess(true);
        setShowConfirmation(true);
    };


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
                                />
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
                                <TabsTrigger value="card"><CreditCard className="mr-2 h-4 w-4"/>Card</TabsTrigger>
                                <TabsTrigger value="netbanking"><Landmark className="mr-2 h-4 w-4"/>Net Banking</TabsTrigger>
                                <TabsTrigger value="upi"><QrCode className="mr-2 h-4 w-4"/>UPI</TabsTrigger>
                            </TabsList>

                            <TabsContent value="card">
                                <CardHeader className="p-0">
                                    <CardTitle className="flex items-center gap-2 text-base">Card Details</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 pt-6 space-y-4">
                                    <div>
                                        <Label htmlFor="card-number">Card Number</Label>
                                        <Input id="card-number" placeholder="**** **** **** 1234" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="expiry">Expiry</Label>
                                            <Input id="expiry" placeholder="MM/YY" />
                                        </div>
                                        <div>
                                            <Label htmlFor="cvc">CVC</Label>
                                            <Input id="cvc" placeholder="123" />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="name-on-card">Name on Card</Label>
                                        <Input id="name-on-card" placeholder="John Doe" />
                                    </div>
                                </CardContent>
                            </TabsContent>

                            <TabsContent value="netbanking">
                                 <CardHeader className="p-0">
                                    <CardTitle className="flex items-center gap-2 text-base">Select Bank</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 pt-6 space-y-4">
                                    <Select>
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
                                        <Input id="upi-id" placeholder="yourname@bank" />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Separator className="flex-1"/>
                                        <span className="text-muted-foreground text-xs">OR</span>
                                        <Separator className="flex-1"/>
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-2 text-center p-4 border-dashed border-2 rounded-lg">
                                        <QrCode className="h-16 w-16 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">Scan QR code with your UPI app</p>
                                    </div>
                                </CardContent>
                            </TabsContent>
                        </Tabs>

                         <CardFooter className="flex-col items-stretch p-0 pt-6 gap-4">
                            <Button size="lg" onClick={handlePurchase}>
                                Pay Rs. {totalCost.toFixed(2)}
                            </Button>
                             <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                <span>Secure payment powered by Stripe.</span>
                            </div>
                        </CardFooter>
                    </div>
                </div>
            </Card>

            <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        {purchaseSuccess ? (
                            <>
                                <CheckCircle className="h-6 w-6 text-primary" />
                                Payment Successful
                            </>
                        ) : (
                            <>
                                <XCircle className="h-6 w-6 text-destructive" />
                                Payment Failed
                            </>
                        )}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {purchaseSuccess ? (
                            <>
                            Your purchase of <strong>{quantity} {unit}</strong> of <strong>{name}</strong> for <strong>Rs. {totalCost.toFixed(2)}</strong> was successful. The assets have been added to your portfolio.
                            </>
                        ) : (
                            "There was an issue processing your payment. Please try again or use a different payment method."
                        )}
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogAction asChild>
                       <Button onClick={() => router.push('/portfolio')} className="w-full">
                            {purchaseSuccess ? 'View Portfolio' : 'Try Again'}
                       </Button>
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    );
}
