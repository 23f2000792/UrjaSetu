
import DocumentUploadForm from "@/components/documents/document-upload-form";
import DocumentList from "@/components/documents/document-list";

export default function DocumentsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Document Management</h1>
      <p className="text-muted-foreground max-w-2xl">
        Upload and manage your project documents for verification. All uploads will be reviewed by our compliance team.
      </p>
      
      <DocumentUploadForm />
      <DocumentList />

    </div>
  );
}
