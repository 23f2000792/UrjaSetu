
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { EnergyCredit } from "@/lib/mock-data";
import { Calendar, Bolt } from "lucide-react";

export default function ECTCard({ credit }: { credit: EnergyCredit }) {
  const creditId = `credit-${credit.id}`;
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
      <CardHeader className="p-0 relative">
         <Link href={`/marketplace/${creditId}`}>
            <Image
            src={credit.imageUrl}
            alt={credit.projectName}
            width={600}
            height={400}
            className="w-full h-48 object-cover"
            data-ai-hint={credit.imageHint}
            />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <CardTitle className="text-lg mb-2">
            <Link href={`/marketplace/${creditId}`} className="hover:underline">
                {credit.projectName} Credits
            </Link>
        </CardTitle>
        <div className="space-y-2 text-sm mt-auto">
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1"><Bolt className="h-4 w-4"/> Amount</span>
            <span>{credit.amount.toLocaleString()} kWh</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1"><Calendar className="h-4 w-4"/> Vintage</span>
            <span>{credit.vintage}</span>
          </div>
           <div className="flex justify-between items-center pt-1">
            <span className="text-muted-foreground">Price / kWh</span>
            <span className="font-bold text-lg">Rs. {credit.price.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
         <Button variant="outline" asChild>
            <Link href={`/marketplace/${creditId}`}>Details</Link>
        </Button>
        <Button asChild>
            <Link href={`/marketplace/${creditId}/trade`}>Buy Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
