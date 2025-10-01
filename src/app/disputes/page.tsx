
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserDisputeList } from "@/components/disputes/user-dispute-list";

export default function DisputesPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Dispute Resolution</h1>
      <p className="text-muted-foreground max-w-2xl">
        If you have an issue with a transaction, please file a dispute below. Our team will review the case and mediate a resolution.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>File a New Dispute</CardTitle>
          <CardDescription>Provide as much detail as possible about the issue.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="transaction-id">Transaction ID</Label>
            <Input id="transaction-id" placeholder="Enter the transaction hash or order ID" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dispute-details">Details of the Issue</Label>
            <Textarea id="dispute-details" placeholder="Describe the problem in detail..." rows={5} />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Submit Dispute</Button>
        </CardFooter>
      </Card>
      
      <UserDisputeList />
    </div>
  );
}
