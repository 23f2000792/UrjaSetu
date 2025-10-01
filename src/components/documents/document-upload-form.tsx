
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";


export default function DocumentUploadForm() {
    const [file, setFile] = useState<File | null>(null);
    const [documentType, setDocumentType] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    }

    const handleUpload = async () => {
        const user = auth.currentUser;
        if (!user) {
            toast({ title: "Not Authenticated", description: "You must be logged in to upload documents.", variant: "destructive" });
            return;
        }
        if (!file || !documentType) {
            toast({ title: "Missing Fields", description: "Please select a file and document type.", variant: "destructive" });
            return;
        }

        setIsLoading(true);

        try {
            const storage = getStorage();
            const storageRef = ref(storage, `documents/${user.uid}/${file.name}`);

            // Upload file
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Add document metadata to Firestore
            await addDoc(collection(db, "documents"), {
                ownerId: user.uid,
                fileName: file.name,
                fileURL: downloadURL,
                fileType: documentType,
                status: "Pending",
                uploadedAt: serverTimestamp(),
            });

            toast({ title: "Success", description: "Document uploaded for review." });
            setFile(null);
            setDocumentType("");
            // Reset the file input visually
            const fileInput = document.getElementById('document-file') as HTMLInputElement;
            if (fileInput) fileInput.value = "";

        } catch (error) {
            console.error("Error uploading document: ", error);
            toast({ title: "Upload Failed", description: "There was an error uploading your document.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }

    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload a New Document</CardTitle>
                <CardDescription>Select the document type and choose a file to upload for verification.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="document-type">Document Type</Label>
                        <Select onValueChange={setDocumentType} value={documentType} disabled={isLoading}>
                            <SelectTrigger id="document-type">
                                <SelectValue placeholder="Select document type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Project Prospectus">Project Prospectus</SelectItem>
                                <SelectItem value="Energy Certification">Energy Certification</SelectItem>
                                <SelectItem value="Legal Agreement">Legal Agreement</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="document-file">File</Label>
                        <Input id="document-file" type="file" onChange={handleFileChange} disabled={isLoading}/>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleUpload} disabled={isLoading || !file || !documentType}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    Upload Document
                </Button>
            </CardFooter>
        </Card>
    )
}
