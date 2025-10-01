
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Timestamp } from "firebase/firestore";
import { Skeleton } from "../ui/skeleton";

export interface Document {
  id: string;
  fileName: string;
  fileURL: string;
  fileType: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  uploadedAt: Timestamp;
}

interface DocumentListProps {
  documents: Document[];
  loading: boolean;
}

export default function DocumentList({ documents, loading }: DocumentListProps) {

    const formatDate = (timestamp: Timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }

    const getBadgeVariant = (status: Document['status']) => {
        switch (status) {
            case 'Approved':
                return 'secondary';
            case 'Pending':
                return 'outline';
            case 'Rejected':
                return 'destructive';
            default:
                return 'default';
        }
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Documents</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>File Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Uploaded At</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                             Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : documents.length > 0 ? (
                            documents.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell className="font-medium">{doc.fileName}</TableCell>
                                    <TableCell>{doc.fileType}</TableCell>
                                    <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant={getBadgeVariant(doc.status)} 
                                            className={doc.status === 'Approved' ? 'bg-primary/20 text-primary' : ''}
                                        >
                                            {doc.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                   <a href={doc.fileURL} target="_blank" rel="noopener noreferrer">
                                                      <Download className="mr-2 h-4 w-4" />
                                                      Download
                                                    </a>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                   <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <FileText className="h-8 w-8" />
                                        You have not uploaded any documents.
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
