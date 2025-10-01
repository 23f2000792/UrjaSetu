
"use client";

import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssetCard from "@/components/marketplace/asset-card";
import ECTCard from "@/components/marketplace/ect-card";
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import type { SolarProject, EnergyCredit } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";

export default function MarketplacePage() {
  const [projects, setProjects] = useState<SolarProject[]>([]);
  const [credits, setCredits] = useState<EnergyCredit[]>([]);
  const [loading, setLoading] = useState(true);

  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("yield-desc");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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

  const filteredProjects = useMemo(() => {
    return projects
      .filter(project => 
        project.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        project.location.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortOption) {
          case 'yield-desc':
            return b.expectedYield - a.expectedYield;
          case 'yield-asc':
            return a.expectedYield - b.expectedYield;
          case 'price-desc':
            return b.tokenPrice - a.tokenPrice;
          case 'price-asc':
            return a.tokenPrice - b.tokenPrice;
          default:
            return 0;
        }
      });
  }, [projects, debouncedSearchQuery, sortOption]);

  const filteredCredits = useMemo(() => {
     return credits
      .filter(credit => 
        credit.projectName.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      )
      .sort((a, b) => {
         switch (sortOption) {
          case 'price-desc':
            return b.price - a.price;
          case 'price-asc':
            return a.price - b.price;
          default:
            return 0;
        }
      })
  }, [credits, debouncedSearchQuery, sortOption]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Marketplace</h1>
        <MarketplaceFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
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
                filteredProjects.map((project) => (
                    <AssetCard key={project.id} project={project} />
                ))
            )}
             {!loading && filteredProjects.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center">No projects match your criteria.</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="credits" className="mt-6">
           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading && !credits.length ? (
                Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-80" />)
            ) : (
                 filteredCredits.map((credit) => (
                    <ECTCard key={credit.id} credit={credit} />
                 ))
            )}
             {!loading && filteredCredits.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center">No credits match your criteria.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    