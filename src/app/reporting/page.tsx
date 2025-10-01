
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar as CalendarIcon, Zap, Leaf } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { collection, onSnapshot, query, where, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from 'firebase/auth';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

type ReportingData = {
    date: string;
    generated: number;
    offset: number;
}

export default function ReportingPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ReportingData[]>([]);
    const [date, setDate] = useState<DateRange | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    });

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(setUser);
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!user || !date?.from) {
            setLoading(false);
            setData([]);
            return;
        };

        setLoading(true);

        const q = query(
            collection(db, "transactions"),
            where("userId", "==", user.uid),
            where("timestamp", ">=", Timestamp.fromDate(date.from)),
            where("timestamp", "<=", Timestamp.fromDate(date.to || date.from))
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const dailyData: {[key: string]: { generated: number, offset: number }} = {};

            snapshot.forEach(doc => {
                const transaction = doc.data();
                const dateStr = format(transaction.timestamp.toDate(), "yyyy-MM-dd");
                
                if (!dailyData[dateStr]) {
                    dailyData[dateStr] = { generated: 0, offset: 0 };
                }
                
                // Example calculation: 1 token purchased = 120 kWh
                const energy = transaction.quantity * 120;
                dailyData[dateStr].generated += energy;
                dailyData[dateStr].offset += energy * 0.707;
            });

            const formattedData = Object.keys(dailyData).map(date => ({
                date,
                generated: dailyData[date].generated,
                offset: Math.round(dailyData[date].offset)
            })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
            setData(formattedData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching reporting data: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, date]);

    const totalGenerated = data.reduce((acc, item) => acc + item.generated, 0);
    const totalOffset = data.reduce((acc, item) => acc + item.offset, 0);

    const handleDownload = () => {
        const doc = new jsPDF();
        const tableColumns = ["Date", "Energy Generated (kWh)", "Carbon Offset (kg CO₂e)"];
        const tableRows = data.map(item => [
            format(new Date(item.date), "LLL dd, y"),
            item.generated.toLocaleString(),
            item.offset.toLocaleString()
        ]);
        
        doc.setFontSize(18);
        doc.text("Sustainability Report", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);

        const dateRange = `Period: ${date?.from ? format(date.from, 'LLL dd, y') : ''} - ${date?.to ? format(date.to, 'LLL dd, y') : ''}`;
        doc.text(dateRange, 14, 30);
        
        doc.setFontSize(12);
        doc.text(`Total Energy Generated: ${totalGenerated.toLocaleString()} kWh`, 14, 40);
        doc.text(`Total Carbon Offset: ${totalOffset.toLocaleString()} kg CO₂e`, 14, 48);

        (doc as any).autoTable({
            startY: 55,
            head: [tableColumns],
            body: tableRows,
        });

        doc.save(`UrjaSetu_Report_${format(new Date(), "yyyy-MM-dd")}.pdf`);
    };

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
                <Button variant="outline" onClick={handleDownload}>
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
                  {loading ? <Skeleton className="h-10 w-1/2" /> : <p className="text-4xl font-bold text-primary">{totalGenerated.toLocaleString()} kWh</p>}
                  <p className="text-sm text-muted-foreground">in the selected period</p>
              </CardContent>
          </Card>
           <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Leaf /> Total Carbon Offset</CardTitle>
              </CardHeader>
              <CardContent>
                  {loading ? <Skeleton className="h-10 w-1/2" /> : <p className="text-4xl font-bold text-primary">{totalOffset.toLocaleString()} kg CO₂e</p>}
                  <p className="text-sm text-muted-foreground">Equivalent to planting {Math.round(totalOffset/58).toLocaleString()} trees</p>
              </CardContent>
          </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Historical Performance</CardTitle>
            <CardDescription>Energy generation and carbon offset over the selected period.</CardDescription>
        </CardHeader>
        <CardContent>
            {loading ? (
                <div className="h-[400px] w-full flex items-center justify-center">
                    <Skeleton className="h-full w-full" />
                </div>
            ) : data.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[400px] w-full">
                    <BarChart data={data}>
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
            ) : (
                <div className="h-[400px] w-full flex items-center justify-center text-muted-foreground">
                    No data available for the selected period.
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

    