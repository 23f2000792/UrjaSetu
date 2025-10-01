
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bell, CheckCircle, AlertTriangle, Store, ShoppingCart, TrendingUp } from "lucide-react";
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Notification {
  id: string;
  type: 'new-listing' | 'purchase' | 'sale';
  title: string;
  description: string;
  timestamp: Timestamp;
  isRead: boolean;
  userId?: string;
  projectId?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
        collection(db, 'notifications'), 
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
        setNotifications(notifs);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching notifications:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new-listing': return <Store className="h-5 w-5 text-blue-500" />;
      case 'purchase': return <ShoppingCart className="h-5 w-5 text-primary" />;
      case 'sale': return <TrendingUp className="h-5 w-5 text-green-500" />;
      default: return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  }
  
  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };


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
            {loading && (
              Array.from({length: 3}).map((_, i) => (
                <div key={i} className="flex items-start gap-4 p-4">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                </div>
              ))
            )}
            {!loading && notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-4 p-4 rounded-lg bg-card-foreground/5">
                <div>{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <p className="font-semibold">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                </div>
                <div className="text-xs text-muted-foreground">{formatDate(notification.timestamp)}</div>
              </div>
            ))}
            {!loading && notifications.length === 0 && (
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
