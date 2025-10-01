"use client";

import { useState } from "react";
import { summarizeEnergyInsights } from "@/ai/flows/ai-summarize-energy-insights";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const sampleEnergyData = JSON.stringify({
  totalKwhGenerated: 1234,
  dateRange: "2024-06-01 to 2024-06-30",
  assets: ["Mojave Solar Park", "Rooftop Revolution"]
}, null, 2);

const sampleSustainabilityData = JSON.stringify({
  carbonOffsetKg: 874,
  renewableEnergyPercentage: 95,
  environmentalImpactScore: "A+"
}, null, 2);

export default function InsightsGenerator() {
  const [energyData, setEnergyData] = useState(sampleEnergyData);
  const [sustainabilityData, setSustainabilityData] = useState(sampleSustainabilityData);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setSummary("");
    try {
      const result = await summarizeEnergyInsights({
        energyGenerationData: energyData,
        sustainabilityMetrics: sustainabilityData,
      });
      setSummary(result.summary);
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Summary</CardTitle>
        <CardDescription>
          Input your energy and sustainability data in JSON format to get an AI-generated summary. We've filled it with sample data for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="energy-data">Energy Generation Data</Label>
            <Textarea
              id="energy-data"
              value={energyData}
              onChange={(e) => setEnergyData(e.target.value)}
              rows={10}
              className="font-code text-sm"
              placeholder="Enter energy data as JSON..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sustainability-data">Sustainability Metrics</Label>
            <Textarea
              id="sustainability-data"
              value={sustainabilityData}
              onChange={(e) => setSustainabilityData(e.target.value)}
              rows={10}
              className="font-code text-sm"
              placeholder="Enter sustainability metrics as JSON..."
            />
          </div>
        </div>
        {isLoading && (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}
        {summary && (
          <Alert className="bg-accent/10 border-accent text-accent-foreground">
            <Wand2 className="h-4 w-4 !text-accent-foreground" />
            <AlertTitle>AI Summary</AlertTitle>
            <AlertDescription className="prose prose-sm text-accent-foreground/90">
              {summary}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerate} disabled={isLoading || !energyData || !sustainabilityData}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Generate Insight
        </Button>
      </CardFooter>
    </Card>
  );
}
