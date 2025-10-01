
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, User, ShieldCheck, Mail, Edit } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import type { User as FirebaseUser } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        const userRole = localStorage.getItem('userRole');
        setRole(userRole);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar')?.imageUrl || '';

  if (isLoading) {
      return <div>Loading profile...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">User Profile</h1>
      
      {user ? (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={userAvatar} data-ai-hint="person portrait" />
                      <AvatarFallback>{user.email ? user.email.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold">{user.displayName || "User Name"}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                  <Badge className="mt-2 capitalize">{role}</Badge>
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>KYC Status</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-primary"/>
                    <span className="font-medium text-primary">Verified</span>
                </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Account Details</CardTitle>
                    <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4"/> Edit Profile</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 items-center">
                        <span className="font-medium text-muted-foreground">Full Name</span>
                        <span className="col-span-2">{user.displayName || "John Doe"}</span>
                    </div>
                     <div className="grid grid-cols-3 items-center">
                        <span className="font-medium text-muted-foreground">Email Address</span>
                        <span className="col-span-2 flex items-center gap-2">{user.email} <Badge variant="secondary">Verified</Badge></span>
                    </div>
                     <div className="grid grid-cols-3 items-center">
                        <span className="font-medium text-muted-foreground">Role</span>
                        <span className="col-span-2 capitalize">{role}</span>
                    </div>
                     <div className="grid grid-cols-3 items-center">
                        <span className="font-medium text-muted-foreground">Wallet Address</span>
                        <span className="col-span-2 font-mono text-sm">0x123...abc</span>
                    </div>
                </CardContent>
            </Card>
             <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Manage your email and push notification preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                   <p className="text-muted-foreground">Notification settings will be available here.</p>
                </CardContent>
            </Card>
             <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Subscription</CardTitle>
                    <CardDescription>Manage your subscription plan.</CardDescription>
                </CardHeader>
                <CardContent>
                   <p className="text-muted-foreground">Your current plan: <span className="font-bold text-primary">Free Tier</span></p>
                   <Button variant="outline" className="mt-4">Upgrade to Pro</Button>
                </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User /> Please Login</CardTitle>
            <CardDescription>Connect your account to manage your profile, assets, and settings.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <LogIn className="h-16 w-16 text-primary mb-6" />
            <Button size="lg" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Don't have an account? <Link href="/signup" className="underline hover:text-primary">Sign up</Link>.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
