
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { UserProfile } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";

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
                <TableCell className="text-right">{(user as any)[valueKey].toLocaleString()} {unit}</TableCell>
            </TableRow>
        ))
    }


  return (
    <Tabs defaultValue="traders" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
        <TabsTrigger value="traders">Top Traders</TabsTrigger>
        <TabsTrigger value="offsetters">Top Carbon Offsetters</TabsTrigger>
      </TabsList>
      <TabsContent value="traders">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Volume (Rs.)</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {renderTableRows(topTraders, 'volume' as any, 'Rs.')}
            </TableBody>
        </Table>
      </TabsContent>
      <TabsContent value="offsetters">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Carbon Offset (kg CO₂e)</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {renderTableRows(topOffsetters, 'offset' as any, 'kg')}
            </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
}

    