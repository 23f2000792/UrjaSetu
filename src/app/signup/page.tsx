
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { setDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserPlus, Zap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
        toast({
            title: "Role not selected",
            description: "Please select whether you are a Buyer or a Seller.",
            variant: "destructive",
        });
        return;
    }
    if (!agreedToTerms) {
        toast({
            title: "Terms and Conditions",
            description: "You must agree to the terms and conditions to sign up.",
            variant: "destructive",
        });
        return;
    }
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save user role and full name to Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: email,
        role: role,
      });

      // Also set role in local storage for immediate use in this session
      localStorage.setItem('userRole', role);

      toast({
        title: "Account Created",
        description: "Welcome to UrjaSetu! You are now logged in.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <Link href="/" className="flex items-center justify-center gap-2 mb-4">
                    <Zap className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold text-primary">UrjaSetu</span>
                </Link>
                <h1 className="text-2xl font-bold">Create an Account</h1>
                <p className="text-muted-foreground">
                    Join UrjaSetu and start investing in a greener future.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Sign Up</CardTitle>
                </CardHeader>
                <form onSubmit={handleSignup}>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="full-name">Full Name</Label>
                        <Input
                            id="full-name"
                            placeholder="John Doe"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            minLength={8}
                        />
                        <p className="text-xs text-muted-foreground">Password must be at least 8 characters long.</p>
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="role">I am a...</Label>
                        <Select onValueChange={setRole} defaultValue={role} disabled={isLoading}>
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="buyer">Buyer / Investor</SelectItem>
                                <SelectItem value="seller">Seller / Project Developer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} disabled={isLoading}/>
                        <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            I agree to the <Link href="/terms" className="underline">Terms & Conditions</Link>
                        </label>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full" disabled={isLoading || !agreedToTerms || !role}>
                    {isLoading ? <Loader2 className="animate-spin" /> : "Create Account"}
                    </Button>
                </CardFooter>
                </form>
            </Card>
             <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{" "}
                <Link href="/login" className="underline hover:text-primary">
                    Login
                </Link>
            </p>
        </div>
    </div>
  );
}
