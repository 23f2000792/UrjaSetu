
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import DocumentReviewList, { Document } from "@/components/admin/document-review-list";

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "documents"), where("status", "==", "Pending"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docsData: Document[] = [];
      querySnapshot.forEach((doc) => {
        docsData.push({ id: doc.id, ...doc.data() } as Document);
      });
      setDocuments(docsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching documents:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Admin: Document Review</h1>
      <p className="text-muted-foreground max-w-2xl">
        Review and approve or reject documents uploaded by sellers.
      </p>
      
      <DocumentReviewList documents={documents} loading={loading} />

    </div>
  );
}
