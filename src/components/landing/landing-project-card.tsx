
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SolarProject } from "@/lib/mock-data";
import { MapPin, Zap, TrendingUp, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LandingProjectCard({ project }: { project: SolarProject }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <Link href={`/marketplace/${project.id}`}>
            <Image
            src={project.imageUrl}
            alt={project.name}
            width={600}
            height={400}
            className="w-full h-48 object-cover"
            data-ai-hint={project.imageHint}
            />
        </Link>
         <Badge variant="secondary" className="absolute top-2 right-2 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> Verified
         </Badge>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <CardTitle className="text-lg mb-2">
            <Link href={`/marketplace/${project.id}`} className="hover:underline">
                {project.name}
            </Link>
        </CardTitle>
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
           <div className="flex justify-between items-center pt-1">
            <span className="text-muted-foreground">Price</span>
            <span className="font-bold text-lg">Rs. {project.tokenPrice.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
