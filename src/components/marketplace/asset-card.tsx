import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SolarProject } from "@/lib/mock-data";
import { MapPin, Zap, TrendingUp } from "lucide-react";

export default function AssetCard({ project }: { project: SolarProject }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <Image
          src={project.imageUrl}
          alt={project.name}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
          data-ai-hint={project.imageHint}
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
        <div className="text-sm text-muted-foreground flex items-center gap-2 mb-4">
          <MapPin className="h-4 w-4" />
          <span>{project.location}</span>
        </div>
        <div className="space-y-2 text-sm mt-auto">
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1"><Zap className="h-4 w-4"/> Capacity</span>
            <span>{(project.capacity / 1000).toLocaleString()} MW</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1"><TrendingUp className="h-4 w-4"/> APY</span>
            <span className="font-semibold text-primary">{project.expectedYield}%</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-primary/90 hover:bg-primary text-primary-foreground">
            Trade at ${project.tokenPrice.toFixed(2)}
        </Button>
      </CardFooter>
    </Card>
  );
}
