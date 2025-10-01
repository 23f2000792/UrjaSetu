
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, DollarSign, Image as ImageIcon } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Image from "next/image";

export default function AddFarmPage() {
  const [projectName, setProjectName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [panelType, setPanelType] = useState("");
  const [description, setDescription] = useState("");
  const [totalTokens, setTotalTokens] = useState("");
  const [tokenPrice, setTokenPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
        toast({ title: "Not Authenticated", description: "You must be logged in.", variant: "destructive" });
        return;
    }
    if (!projectName || !location || !capacity || !totalTokens || !tokenPrice || !imageUrl) {
      toast({ title: "Missing Fields", description: "Please fill out all required fields and provide a project image URL.", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    try {
      // Add project details to Firestore
      await addDoc(collection(db, "projects"), {
        ownerId: user.uid,
        name: projectName,
        location,
        capacity: Number(capacity),
        panelType,
        description,
        imageUrl,
        totalTokens: Number(totalTokens),
        tokensAvailable: Number(totalTokens), // Initially, all tokens are available
        tokenPrice: Number(tokenPrice),
        status: "Pending", // Projects need verification
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Project Submitted",
        description: `${projectName} has been submitted for verification.`,
      });
      router.push("/seller/projects");
    } catch (error) {
      console.error("Error adding project:", error);
      toast({
        title: "Submission Failed",
        description: "An unexpected error occurred while adding your project.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Add a New Solar Project</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details below to list your solar energy project on the UrjaSetu marketplace.
        </p>
      </div>
      <form onSubmit={handleAddProject}>
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Provide core information about your solar farm.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input id="project-name" placeholder="e.g., Sahara Sun Farm" value={projectName} onChange={(e) => setProjectName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g., Rajasthan, India" value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="capacity">Total Capacity (kW)</Label>
                <Input id="capacity" type="number" placeholder="e.g., 50000" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
              </div>
               <div className="space-y-2">
                <Label htmlFor="panel-type">Solar Panel Type</Label>
                <Input id="panel-type" placeholder="e.g., Monocrystalline PERC" value={panelType} onChange={(e) => setPanelType(e.target.value)} />
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea id="description" placeholder="Describe the project's goals, impact, and technology..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
              </div>
          </CardContent>
        </Card>
        
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Tokenization</CardTitle>
                <CardDescription>Define the token parameters for your project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="total-tokens">Total Token Supply</Label>
                        <Input id="total-tokens" type="number" placeholder="e.g., 1000000" value={totalTokens} onChange={(e) => setTotalTokens(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="token-price">Price per Token (in Rs.)</Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="token-price" type="number" placeholder="e.g., 80" className="pl-8" value={tokenPrice} onChange={(e) => setTokenPrice(e.target.value)} required />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Project Media</CardTitle>
            <CardDescription>Provide a URL for the main project image.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="project-image-url" className="flex items-center gap-2"><ImageIcon /> Project Image URL (Required)</Label>
                <Input 
                  id="project-image-url" 
                  type="url" 
                  placeholder="https://example.com/image.png" 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)} 
                  required 
                />
            </div>
            {imageUrl && (
              <div className="mt-4">
                <Label>Image Preview</Label>
                <div className="mt-2 rounded-lg border aspect-video max-h-64 overflow-hidden relative bg-muted">
                    <Image src={imageUrl} alt="Project image preview" layout="fill" objectFit="cover" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-end">
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Project for Review
          </Button>
        </div>
      </form>
    </div>
  );
}
