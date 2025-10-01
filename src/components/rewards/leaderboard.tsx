"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const topTraders = [
    { rank: 1, user: "CryptoKing", volume: 150000, avatar: "https://picsum.photos/seed/trader1/40/40", imageHint: 'person portrait' },
    { rank: 2, user: "SolarQueen", volume: 125000, avatar: "https://picsum.photos/seed/trader2/40/40", imageHint: 'person portrait' },
    { rank: 3, user: "WattWatcher", volume: 110000, avatar: "https://picsum.photos/seed/trader3/40/40", imageHint: 'person portrait' },
    { rank: 4, user: "EcoInvestor", volume: 95000, avatar: "https://picsum.photos/seed/trader4/40/40", imageHint: 'person portrait' },
    { rank: 5, user: "GridGuru", volume: 80000, avatar: "https://picsum.photos/seed/trader5/40/40", imageHint: 'person portrait' },
];

const topOffsetters = [
    { rank: 1, user: "CarbonSlayer", offset: 5000, avatar: "https://picsum.photos/seed/offset1/40/40", imageHint: 'person portrait' },
    { rank: 2, user: "GreenGiant", offset: 4500, avatar: "https://picsum.photos/seed/offset2/40/40", imageHint: 'person portrait' },
    { rank: 3, user: "PlanetProtector", offset: 4200, avatar: "https://picsum.photos/seed/offset3/40/40", imageHint: 'person portrait' },
    { rank: 4, user: "RenewableRachel", offset: 3800, avatar: "https://picsum.photos/seed/offset4/40/40", imageHint: 'person portrait' },
    { rank: 5, user: "SolarSam", offset: 3500, avatar: "https://picsum.photos/seed/offset5/40/40", imageHint: 'person portrait' },
];

export function Leaderboard() {
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
                    <TableHead className="text-right">Volume (USD)</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {topTraders.map(trader => (
                    <TableRow key={trader.rank}>
                        <TableCell className="font-bold text-lg">{trader.rank}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={trader.avatar} data-ai-hint={trader.imageHint}/>
                                    <AvatarFallback>{trader.user.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{trader.user}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-right">${trader.volume.toLocaleString()}</TableCell>
                    </TableRow>
                ))}
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
                {topOffsetters.map(offsetter => (
                    <TableRow key={offsetter.rank}>
                        <TableCell className="font-bold text-lg">{offsetter.rank}</TableCell>
                        <TableCell>
                             <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={offsetter.avatar} data-ai-hint={offsetter.imageHint}/>
                                    <AvatarFallback>{offsetter.user.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{offsetter.user}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-right">{offsetter.offset.toLocaleString()} kg</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
}
