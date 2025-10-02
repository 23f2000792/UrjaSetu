
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, XCircle } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Timestamp } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";
import { useFirestore } from "@/firebase";

export interface Document {
  id: string;
  fileName: string;
  fileURL: string;
  fileType: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  uploadedAt: Timestamp;
  ownerId: string;
  // We can add ownerEmail or projectName if we store it during upload
}

interface DocumentReviewListProps {
  documents: Document[];
  loading: boolean;
}

export default function DocumentReviewList({ documents, loading }: DocumentReviewListProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleUpdateStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    if (!firestore) return;
    const docRef = doc(firestore, "documents", id);
    try {
      await updateDoc(docRef, { status: status });
      toast({
        title: "Success",
        description: `Document has been ${status.toLowerCase()}.`,
      });
    } catch (error) {
      console.error("Error updating document status: ", error);
      toast({
        title: "Error",
        description: "Could not update the document status.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Uploaded At</TableHead>
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
                    <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                </TableRow>
            ))
            ) : documents.length > 0 ? (
              documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <a href={doc.fileURL} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        {doc.fileName}
                    </a>
                  </TableCell>
                  <TableCell>{doc.fileType}</TableCell>
                  <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="icon" className="text-primary hover:text-primary" onClick={() => handleUpdateStatus(doc.id, 'Approved')}>
                        <CheckCircle className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleUpdateStatus(doc.id, 'Rejected')}>
                        <XCircle className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <FileText className="h-8 w-8" />
                            No pending documents to review.
                        </div>
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
