
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type SolarProject } from "@/lib/mock-data";
import { Loader2, Edit, DollarSign, Zap } from "lucide-react";

interface EditProjectFormProps {
    project: SolarProject;
}

export default function EditProjectForm({ project }: EditProjectFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    
    // Form state
    const [name, setName] = useState(project.name);
    const [location, setLocation] = useState(project.location);
    const [panelType, setPanelType] = useState(project.panelType);
    const [description, setDescription] = useState(project.description);
    const [imageUrl, setImageUrl] = useState(project.imageUrl);
    const [tokenPrice, setTokenPrice] = useState(project.tokenPrice.toString());
    const [capacity, setCapacity] = useState(project.capacity.toString());

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const projectRef = doc(db, "projects", project.id);

        try {
            await updateDoc(projectRef, {
                name,
                location,
                panelType,
                description,
                imageUrl,
                tokenPrice: Number(tokenPrice),
                capacity: Number(capacity),
            });

            toast({
                title: "Project Updated",
                description: "Your project details have been successfully saved.",
            });
            setIsOpen(false);
        } catch (error: any) {
            console.error("Error updating project:", error);
            toast({
                title: "Update Failed",
                description: `There was an error updating your project: ${error.message}`,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><Edit className="mr-2 h-4 w-4" /> Edit Project</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <form onSubmit={handleUpdate}>
                    <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                        <DialogDescription>Update the details for "{project.name}". Click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Project Name</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="tokenPrice">Price per Token</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="tokenPrice" type="number" value={tokenPrice} onChange={(e) => setTokenPrice(e.target.value)} className="pl-8"/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="capacity">Capacity (kW)</Label>
                                 <div className="relative">
                                    <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="pl-8" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="panelType">Panel Type</Label>
                            <Input id="panelType" value={panelType} onChange={(e) => setPanelType(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input id="imageUrl" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
