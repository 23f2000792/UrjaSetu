import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bell, CheckCircle, AlertTriangle } from "lucide-react";

const notifications = [
  {
    id: 1,
    icon: <CheckCircle className="h-5 w-5 text-primary" />,
    title: "Sale Completed",
    description: "You successfully sold 100 Mojave Solar Park tokens.",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    icon: <CheckCircle className="h-5 w-5 text-primary" />,
    title: "Purchase Successful",
    description: "You purchased 500 Thar Desert Array ECTs.",
    timestamp: "1 day ago",
  },
  {
    id: 3,
    icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    title: "KYC Verification",
    description: "Your advanced KYC verification has been approved.",
    timestamp: "3 days ago",
  },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Notifications</h1>
      <p className="text-muted-foreground max-w-2xl">
        Stay updated with the latest activity on your account.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-4 p-4 rounded-lg bg-card-foreground/5">
                <div>{notification.icon}</div>
                <div className="flex-1">
                  <p className="font-semibold">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                </div>
                <div className="text-xs text-muted-foreground">{notification.timestamp}</div>
              </div>
            ))}
            {notifications.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <Bell className="mx-auto h-12 w-12" />
                    <p className="mt-4">You have no new notifications.</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
