
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Briefcase, Zap, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import type { User } from 'firebase/auth';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Project {
  id: string;
  name: string;
  location: string;
  capacity: number;
  status: 'Pending' | 'Verified' | 'Rejected';
  createdAt: Timestamp;
}

export default function SellerProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
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

    const q = query(collection(db, "projects"), where("ownerId", "==", user.uid));
    const unsubscribe = onSnapshot(q,
      (querySnapshot) => {
        const projectsData: Project[] = [];
        querySnapshot.forEach((doc) => {
          projectsData.push({ id: doc.id, ...doc.data() } as Project);
        });
        setProjects(projectsData.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds));
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching projects:", error);
        toast({
          title: "Error",
          description: "Could not fetch your projects.",
          variant: "destructive",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, toast]);

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'Verified': return <CheckCircle className="h-5 w-5 text-primary" />;
      case 'Pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Rejected': return <AlertTriangle className="h-5 w-5 text-destructive" />;
    }
  };

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
        case 'Verified': return 'secondary';
        case 'Pending': return 'outline';
        case 'Rejected': return 'destructive';
    }
  }


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">My Solar Projects</h1>
            <p className="text-muted-foreground max-w-2xl mt-2">
                Manage your existing solar farm listings and add new ones.
            </p>
        </div>
        <Button asChild>
          <Link href="/seller/add-farm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Project
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-64" />)}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge variant={getStatusBadge(project.status)}>{project.status}</Badge>
                </div>
                <CardDescription>{project.location}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4" />
                    <span>{project.capacity.toLocaleString()} kW Capacity</span>
                </div>
              </CardContent>
              <CardContent>
                 <Button variant="outline" className="w-full">
                    Manage Project
                 </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No projects listed yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started by listing your first solar project on the marketplace.
          </p>
          <Button asChild className="mt-6">
            <Link href="/seller/add-farm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Project
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

    