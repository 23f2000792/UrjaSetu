import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ShieldCheck, LogIn } from "lucide-react";

export default function ProfilePage() {
  const isAuthenticated = false; // Mock authentication state

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">User Profile</h1>
      
      {isAuthenticated ? (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="https://picsum.photos/seed/user/100/100" data-ai-hint="person portrait" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="text-xl font-bold">User Name</p>
                  <p className="text-sm text-muted-foreground">user@email.com</p>
                </div>
                <Button variant="outline">Edit Profile</Button>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Manage your account and verification status.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="wallet">Wallet Address</Label>
                  <Input id="wallet" readOnly value="0x1234...5678" />
                </div>
                
                <Card className="bg-accent/10 border-accent">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle className="text-lg">KYC Status</CardTitle>
                            <CardDescription className="text-accent-foreground/80">
                                Your identity has been verified.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="font-semibold text-primary">Tier 2: Verified</p>
                        <p className="text-sm text-muted-foreground mt-1">You have full access to all platform features.</p>
                        <Button variant="link" className="p-0 h-auto mt-2">View Verification Details</Button>
                    </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>Please connect your wallet to view your profile and manage your assets.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <LogIn className="h-16 w-16 text-primary mb-6" />
            <Button size="lg">Connect Wallet</Button>
            <p className="text-xs text-muted-foreground mt-4">By connecting, you agree to our Terms of Service.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
