
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, User } from "lucide-react";
import Link from "next/link";


export default function ProfilePage() {
  const isAuthenticated = false; // Mock authentication state - will be replaced with real auth

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">User Profile</h1>
      
      {isAuthenticated ? (
        <p>User is authenticated. Show profile details here.</p>
        // The detailed profile UI will be built out once auth is fully integrated
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
