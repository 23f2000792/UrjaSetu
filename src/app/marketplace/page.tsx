import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { solarProjects, energyCredits } from "@/lib/mock-data";
import AssetCard from "@/components/marketplace/asset-card";
import ECTCard from "@/components/marketplace/ect-card";
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters";

export default function MarketplacePage() {
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
            {solarProjects.map((project) => (
              <AssetCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="credits" className="mt-6">
           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {energyCredits.map((credit) => (
              <ECTCard key={credit.id} credit={credit} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
