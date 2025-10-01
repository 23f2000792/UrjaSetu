
"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssetCard from "@/components/marketplace/asset-card";
import ECTCard from "@/components/marketplace/ect-card";
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import type { SolarProject, EnergyCredit } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";

export default function MarketplacePage() {
  const [projects, setProjects] = useState<SolarProject[]>([]);
  const [credits, setCredits] = useState<EnergyCredit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubProjects = onSnapshot(collection(db, "projects"), (snapshot) => {
      const projectsData: SolarProject[] = [];
      snapshot.forEach((doc) => {
        projectsData.push({ id: doc.id, ...doc.data() } as SolarProject);
      });
      setProjects(projectsData);
      setLoading(false);
    });

    const unsubCredits = onSnapshot(collection(db, "energyCredits"), (snapshot) => {
        const creditsData: EnergyCredit[] = [];
        snapshot.forEach((doc) => {
            creditsData.push({ id: doc.id, ...doc.data() } as EnergyCredit);
        });
        setCredits(creditsData);
    });


    return () => {
        unsubProjects();
        unsubCredits();
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Marketplace</h1>
        <MarketplaceFilters />
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="projects">Solar Projects</TabsTrigger>
          <TabsTrigger value="credits">Energy Credits</TabsTrigger>
        </TabsList>
        <TabsContent value="projects" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading ? (
                Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-96" />)
            ) : (
                projects.map((project) => (
                    <AssetCard key={project.id} project={project} />
                ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="credits" className="mt-6">
           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading && !credits.length ? (
                Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-80" />)
            ) : (
                 credits.map((credit) => (
                    <ECTCard key={credit.id} credit={credit} />
                 ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    