
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Jan", value: 1000000 },
  { month: "Feb", value: 1050000 },
  { month: "Mar", value: 1020000 },
  { month: "Apr", value: 1100000 },
  { month: "May", value: 1150000 },
  { month: "Jun", value: 1245000 },
  { month: "Jul", value: 1230000 },
  { month: "Aug", value: 1280000 },
  { month: "Sep", value: 1350000 },
  { month: "Oct", value: 1320000 },
  { month: "Nov", value: 1380000 },
  { month: "Dec", value: 1450000 },
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
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 20 }}>
          <XAxis dataKey="month" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis 
            stroke="hsl(var(--foreground))" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `Rs.${Number(value) / 100000}L`} 
          />
          <Tooltip 
            cursor={{ fill: 'hsl(var(--card))' }} 
            content={<ChartTooltipContent 
                formatter={(value) => `Rs. ${Number(value).toLocaleString('en-IN')}`} 
            />} 
           />
          <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
