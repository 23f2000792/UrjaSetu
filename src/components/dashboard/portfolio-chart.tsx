"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Jan", value: 10000 },
  { month: "Feb", value: 10500 },
  { month: "Mar", value: 10200 },
  { month: "Apr", value: 11000 },
  { month: "May", value: 11500 },
  { month: "Jun", value: 12450 },
  { month: "Jul", value: 12300 },
  { month: "Aug", value: 12800 },
  { month: "Sep", value: 13500 },
  { month: "Oct", value: 13200 },
  { month: "Nov", value: 13800 },
  { month: "Dec", value: 14500 },
]

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--primary))",
  },
}

export default function PortfolioChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
          <XAxis dataKey="month" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
          <Tooltip 
            cursor={{ fill: 'hsl(var(--card))' }} 
            content={<ChartTooltipContent 
                formatter={(value) => `$${Number(value).toLocaleString()}`} 
            />} 
           />
          <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
