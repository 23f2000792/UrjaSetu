import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Gift, Star, Trophy } from "lucide-react";
import { UserBadges } from "@/components/rewards/user-badges";
import { Leaderboard } from "@/components/rewards/leaderboard";
import { Input } from "@/components/ui/input";

export default function RewardsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Rewards & Gamification</h1>
      <p className="text-muted-foreground max-w-2xl">
        Engage with the platform, earn rewards, and climb the leaderboards. Your participation helps drive the renewable energy revolution.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Star className="h-6 w-6" /> Your Badges</CardTitle>
            <CardDescription>Achievements you've unlocked on your journey.</CardDescription>
          </CardHeader>
          <CardContent>
            <UserBadges />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Gift className="h-6 w-6" />Referral Program</CardTitle>
            <CardDescription>Share UrjaSetu and earn rewards.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <p className="text-sm text-muted-foreground">Your referral code</p>
                <div className="flex items-center gap-2 mt-1">
                    <Input readOnly value="REF-USER-1234" className="font-mono" />
                    <Button variant="outline" size="icon">
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
             </div>
             <p className="text-sm text-muted-foreground pt-2">
                Share your code with friends. When they sign up, you'll both receive a bonus of 10 URJA tokens!
             </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Trophy className="h-6 w-6" />Leaderboards</CardTitle>
            <CardDescription>See how you stack up against other users.</CardDescription>
        </CardHeader>
        <CardContent>
            <Leaderboard />
        </CardContent>
      </Card>
    </div>
  );
}
