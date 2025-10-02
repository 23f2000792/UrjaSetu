
"use client";

import { useEffect, useState } from "react";
import DocumentUploadForm from "@/components/documents/document-upload-form";
import DocumentList, { Document } from "@/components/documents/document-list";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import type { User } from 'firebase/auth';
import { useUser, useFirestore } from "@/firebase";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || !firestore) {
      setLoading(false);
      return;
    }

    const q = query(collection(firestore, "documents"), where("ownerId", "==", user.uid));
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const docsData: Document[] = [];
        querySnapshot.forEach((doc) => {
          docsData.push({ id: doc.id, ...doc.data() } as Document);
        });
        setDocuments(docsData);
        setLoading(false);
      },
      (error) => {
        const permissionError = new FirestorePermissionError({ path: q.path, operation: 'list'});
        errorEmitter.emit('permission-error', permissionError);
        toast({
          title: "Error",
          description: "Could not fetch your documents.",
          variant: "destructive",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, firestore, toast]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Document Management</h1>
      <p className="text-muted-foreground max-w-2xl">
        Upload and manage your project documents for verification. All uploads will be reviewed by our compliance team.
      </p>
      
      <DocumentUploadForm />
      <DocumentList documents={documents} loading={loading || userLoading} />

    </div>
  );
}
