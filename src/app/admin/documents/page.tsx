
import DocumentReviewList from "@/components/admin/document-review-list";

export default function AdminDocumentsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Admin: Document Review</h1>
      <p className="text-muted-foreground max-w-2xl">
        Review and approve or reject documents uploaded by sellers.
      </p>
      
      <DocumentReviewList />

    </div>
  );
}
