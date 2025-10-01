import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const proposals = [
  { id: 'GP-001', title: 'Increase Staking Rewards by 5%', status: 'Active' },
  { id: 'GP-002', title: 'Fund a new solar project in Africa', status: 'Passed' },
  { id: 'GP-003', title: 'Update platform fee structure', status: 'Failed' },
];

export default function StakingPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Staking & Governance</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Stake URJA Tokens</CardTitle>
            <CardDescription>Stake your tokens to earn rewards and participate in governance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground">Your Staked Balance</span>
                <span className="text-2xl font-bold">1,000 URJA</span>
            </div>
            <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground">Estimated APY</span>
                <span className="text-2xl font-bold text-primary">12.5%</span>
            </div>
            <div className="flex gap-2 pt-4">
                <Input placeholder="Amount to stake" />
                <Button>Stake</Button>
            </div>
             <div className="flex gap-2">
                <Input placeholder="Amount to unstake" />
                <Button variant="outline">Unstake</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Staking Rewards</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center space-y-2">
                <p className="text-4xl font-bold text-primary">25.3 URJA</p>
                <p className="text-muted-foreground">Unclaimed Rewards</p>
                <Button variant="outline" className="w-full mt-4">Claim Rewards</Button>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Governance Proposals</CardTitle>
          <CardDescription>Vote on proposals to shape the future of UrjaSetu.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {proposals.map(proposal => (
                        <TableRow key={proposal.id}>
                            <TableCell className="text-muted-foreground">{proposal.id}</TableCell>
                            <TableCell className="font-medium">{proposal.title}</TableCell>
                            <TableCell>
                                <Badge variant={
                                    proposal.status === 'Active' ? 'default' :
                                    proposal.status === 'Passed' ? 'secondary' : 'destructive'
                                } className={proposal.status === 'Active' ? 'bg-accent text-accent-foreground' : ''}>{proposal.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm">View</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

    </div>
  );
}
