
import { AdminDisputeList } from "@/components/admin/admin-dispute-list";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AdminDisputesPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Admin: Dispute Management</h1>
      <p className="text-muted-foreground max-w-2xl">
        Review, investigate, and resolve user-submitted disputes to maintain a fair and trustworthy marketplace.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>New Disputes</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">3</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Under Review</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">12</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Resolved This Week</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">8</p>
            </CardContent>
        </Card>
      </div>

      <AdminDisputeList />

    </div>
  );
}
