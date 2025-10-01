
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar as CalendarIcon, Zap, Leaf } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";

const energyData = [
  { date: "2024-07-01", generated: 22, offset: 15 },
  { date: "2024-07-02", generated: 35, offset: 24 },
  { date: "2024-07-03", generated: 42, offset: 29 },
  { date: "2024-07-04", generated: 38, offset: 26 },
  { date: "2024-07-05", generated: 51, offset: 35 },
  { date: "2024-07-06", generated: 45, offset: 31 },
  { date: "2024-07-07", generated: 48, offset: 33 },
];

const chartConfig = {
    generated: {
        label: "Energy Generated (kWh)",
        color: "hsl(var(--primary))",
    },
    offset: {
        label: "Carbon Offset (kg CO₂e)",
        color: "hsl(var(--chart-2))",
    }
}

export default function ReportingPage() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: subDays(new Date(), 7),
        to: new Date(),
    });

  return (
    <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Sustainability Reporting</h1>
                <p className="text-muted-foreground max-w-2xl mt-2">
                    Track your environmental impact and energy generation over time.
                </p>
            </div>
             <div className="flex items-center gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        id="date"
                        variant={"outline"}
                        className="w-[260px] justify-start text-left font-normal"
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                            <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                            </>
                            ) : (
                            format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                </Button>
            </div>
        </div>

      <div className="grid gap-6 md:grid-cols-2">
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Zap /> Total Energy Generated</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-4xl font-bold text-primary">350 kWh</p>
                  <p className="text-sm text-muted-foreground">in the selected period</p>
              </CardContent>
          </Card>
           <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Leaf /> Total Carbon Offset</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-4xl font-bold text-primary">245 kg CO₂e</p>
                  <p className="text-sm text-muted-foreground">Equivalent to planting 4 trees</p>
              </CardContent>
          </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Historical Performance</CardTitle>
            <CardDescription>Energy generation and carbon offset over the selected period.</CardDescription>
        </CardHeader>
        <CardContent>
             <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <BarChart data={energyData}>
                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => format(new Date(value), "MMM d")}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="generated" fill="var(--color-generated)" radius={4} />
                    <Bar dataKey="offset" fill="var(--color-offset)" radius={4} />
                </BarChart>
            </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
