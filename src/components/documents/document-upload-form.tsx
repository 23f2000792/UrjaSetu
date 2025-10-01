
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";

export default function DocumentUploadForm() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload a New Document</CardTitle>
                <CardDescription>Select the document type and choose a file to upload.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="document-type">Document Type</Label>
                        <Select>
                            <SelectTrigger id="document-type">
                                <SelectValue placeholder="Select document type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="prospectus">Project Prospectus</SelectItem>
                                <SelectItem value="certification">Energy Certification</SelectItem>
                                <SelectItem value="legal">Legal Agreement</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="document-file">File</Label>
                        <Input id="document-file" type="file" />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                </Button>
            </CardFooter>
        </Card>
    )
}
