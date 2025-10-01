"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const topTraders = [
    { rank: 1, user: "CryptoKing", volume: 150000, avatar: PlaceHolderImages.find(p => p.id === 'trader1')?.imageUrl || '', imageHint: 'person portrait' },
    { rank: 2, user: "SolarQueen", volume: 125000, avatar: PlaceHolderImages.find(p => p.id === 'trader2')?.imageUrl || '', imageHint: 'person portrait' },
    { rank: 3, user: "WattWatcher", volume: 110000, avatar: PlaceHolderImages.find(p => p.id === 'trader3')?.imageUrl || '', imageHint: 'person portrait' },
    { rank: 4, user: "EcoInvestor", volume: 95000, avatar: PlaceHolderImages.find(p => p.id === 'trader4')?.imageUrl || '', imageHint: 'person portrait' },
    { rank: 5, user: "GridGuru", volume: 80000, avatar: PlaceHolderImages.find(p => p.id === 'trader5')?.imageUrl || '', imageHint: 'person portrait' },
];

const topOffsetters = [
    { rank: 1, user: "CarbonSlayer", offset: 5000, avatar: PlaceHolderImages.find(p => p.id === 'offset1')?.imageUrl || '', imageHint: 'person portrait' },
    { rank: 2, user: "GreenGiant", offset: 4500, avatar: PlaceHolderImages.find(p => p.id === 'offset2')?.imageUrl || '', imageHint: 'person portrait' },
    { rank: 3, user: "PlanetProtector", offset: 4200, avatar: PlaceHolderImages.find(p => p.id === 'offset3')?.imageUrl || '', imageHint: 'person portrait' },
    { rank: 4, user: "RenewableRachel", offset: 3800, avatar: PlaceHolderImages.find(p => p.id === 'offset4')?.imageUrl || '', imageHint: 'person portrait' },
    { rank: 5, user: "SolarSam", offset: 3500, avatar: PlaceHolderImages.find(p => p.id === 'offset5')?.imageUrl || '', imageHint: 'person portrait' },
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
