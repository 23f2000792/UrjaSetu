import InsightsGenerator from "@/components/insights/insights-generator";

export default function InsightsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">AI Energy Insights</h1>
      <p className="text-muted-foreground max-w-2xl">
        Leverage the power of AI to get clear, concise, and actionable summaries of your energy generation and sustainability metrics. Simply provide your data to make better-informed decisions.
      </p>
      <InsightsGenerator />
    </div>
  );
}
