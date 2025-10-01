
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { UserProfile } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Leaf } from "lucide-react";

interface LeaderboardProps {
    topTraders: UserProfile[];
    topOffsetters: UserProfile[];
    loading: boolean;
}

export function Leaderboard({ topTraders, topOffsetters, loading }: LeaderboardProps) {

    const renderTableRows = (users: UserProfile[], valueKey: 'volume' | 'offset', unit: string) => {
        if (loading) {
            return Array.from({length: 5}).map((_, i) => (
                 <TableRow key={i}>
                    <TableCell><Skeleton className="h-8 w-4" /></TableCell>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                    </TableCell>
                    <TableCell className="text-right"><Skeleton className="h-6 w-20 ml-auto" /></TableCell>
                </TableRow>
            ))
        }
        if (users.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                        No data available yet.
                    </TableCell>
                </TableRow>
            );
        }
        return users.map((user, index) => (
             <TableRow key={user.id}>
                <TableCell className="font-bold text-lg">{index + 1}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={(user as any).avatar} data-ai-hint="person portrait"/>
                            <AvatarFallback>{(user as any).fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{(user as any).fullName}</span>
                    </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                    {valueKey === 'volume' ? 'Rs. ' : ''}
                    {((user as any)[valueKey] || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    {valueKey === 'volume' ? '' : ` ${unit}`}
                </TableCell>
            </TableRow>
        ))
    }


  return (
    <Tabs defaultValue="traders" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
        <TabsTrigger value="traders"><TrendingUp className="mr-2 h-4 w-4" /> Top Traders</TabsTrigger>
        <TabsTrigger value="offsetters"><Leaf className="mr-2 h-4 w-4" /> Top Carbon Offsetters</TabsTrigger>
      </TabsList>
      <TabsContent value="traders">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Trading Volume</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {renderTableRows(topTraders, 'volume', 'Rs.')}
            </TableBody>
        </Table>
      </TabsContent>
      <TabsContent value="offsetters">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Carbon Offset</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {renderTableRows(topOffsetters, 'offset', 'kg CO₂e')}
            </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
}
