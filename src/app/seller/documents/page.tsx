
"use client";

import { useEffect, useState } from "react";
import DocumentUploadForm from "@/components/documents/document-upload-form";
import DocumentList, { Document } from "@/components/documents/document-list";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import type { User } from 'firebase/auth';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, "documents"), where("ownerId", "==", user.uid));
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
        console.error("Error fetching documents:", error);
        toast({
          title: "Error",
          description: "Could not fetch your documents.",
          variant: "destructive",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, toast]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">My Documents</h1>
      <p className="text-muted-foreground max-w-2xl">
        Upload and manage your KYC documents and project certifications. All uploads will be reviewed for compliance.
      </p>
      
      <DocumentUploadForm />
      <DocumentList documents={documents} loading={loading} />

    </div>
  );
}
