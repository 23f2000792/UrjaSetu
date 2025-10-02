
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc, deleteDoc, increment } from "firebase/firestore";
import { type SolarProject } from "@/lib/mock-data";
import { Loader2, Edit, DollarSign, Zap, Package, Trash2 } from "lucide-react";
import { useFirestore } from "@/firebase";

interface EditProjectFormProps {
    project: SolarProject;
}

export default function EditProjectForm({ project }: EditProjectFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const firestore = useFirestore();
    
    // Form state
    const [name, setName] = useState(project.name);
    const [location, setLocation] = useState(project.location);
    const [panelType, setPanelType] = useState(project.panelType);
    const [description, setDescription] = useState(project.description);
    const [imageUrl, setImageUrl] = useState(project.imageUrl);
    const [tokenPrice, setTokenPrice] = useState(project.tokenPrice.toString());
    const [capacity, setCapacity] = useState(project.capacity.toString());
    const [totalTokens, setTotalTokens] = useState(project.totalTokens.toString());

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore) return;
        setIsLoading(true);

        const projectRef = doc(firestore, "projects", project.id);
        const newTotalTokens = Number(totalTokens);
        const oldTotalTokens = project.totalTokens;
        
        let tokensToAdd = 0;
        if (newTotalTokens > oldTotalTokens) {
            tokensToAdd = newTotalTokens - oldTotalTokens;
        }

        try {
            await updateDoc(projectRef, {
                name,
                location,
                panelType,
                description,
                imageUrl,
                tokenPrice: Number(tokenPrice),
                capacity: Number(capacity),
                totalTokens: newTotalTokens,
                tokensAvailable: increment(tokensToAdd)
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

    const handleDelete = async () => {
        if (!firestore) return;
        setIsDeleting(true);
        try {
            await deleteDoc(doc(firestore, "projects", project.id));
            toast({
                title: "Project Deleted",
                description: `${project.name} has been permanently deleted.`,
            });
            router.push("/seller/projects");
        } catch (error: any) {
            console.error("Error deleting project: ", error);
            toast({
                title: "Deletion Failed",
                description: `Could not delete project: ${error.message}`,
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    };


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><Edit className="mr-2 h-4 w-4" /> Edit Project</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <form onSubmit={handleUpdate}>
                    <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                        <DialogDescription>Update the details for "{project.name}". Click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-8 max-h-[70vh] overflow-y-auto pr-4">
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
                                <Label htmlFor="tokenPrice">Price per Token (Rs.)</Label>
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
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="total-tokens">Total Token Supply</Label>
                                <div className="relative">
                                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="total-tokens" type="number" min={project.totalTokens - project.tokensAvailable} value={totalTokens} onChange={(e) => setTotalTokens(e.target.value)} className="pl-8"/>
                                </div>
                                <p className="text-xs text-muted-foreground">Cannot be lower than tokens already sold.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="panelType">Panel Type</Label>
                                <Input id="panelType" value={panelType} onChange={(e) => setPanelType(e.target.value)} />
                            </div>
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
                    <DialogFooter className="pt-6 border-t flex justify-between w-full">
                        <div>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button type="button" variant="destructive" disabled={isLoading}>
                                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                        Delete Project
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your project and all associated data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                            Yes, delete project
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
