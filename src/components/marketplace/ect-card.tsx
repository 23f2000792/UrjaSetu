import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { EnergyCredit } from "@/lib/mock-data";
import { Calendar, Bolt } from "lucide-react";

export default function ECTCard({ credit }: { credit: EnergyCredit }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <Image
          src={credit.imageUrl}
          alt={credit.projectName}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
          data-ai-hint={credit.imageHint}
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <CardTitle className="text-lg mb-2">{credit.projectName} Credits</CardTitle>
        <div className="space-y-2 text-sm mt-auto">
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1"><Bolt className="h-4 w-4"/> Amount</span>
            <span>{credit.amount.toLocaleString()} kWh</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1"><Calendar className="h-4 w-4"/> Vintage</span>
            <span>{credit.vintage}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-primary/90 hover:bg-primary text-primary-foreground">
            Buy at ${credit.price.toFixed(2)}/kWh
        </Button>
      </CardFooter>
    </Card>
  );
}
