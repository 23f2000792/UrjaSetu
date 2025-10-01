
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";


export function MarketplaceFilters() {
    return (
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search assets..." className="pl-10 w-full sm:w-64" />
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Filters
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>Filter Assets</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-2 space-y-4">
                         <div className="space-y-2">
                            <Label>Sort by</Label>
                            <Select defaultValue="yield-desc">
                                <SelectTrigger>
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yield-desc">Expected Yield (High to Low)</SelectItem>
                                    <SelectItem value="yield-asc">Expected Yield (Low to High)</SelectItem>
                                    <SelectItem value="price-desc">Token Price (High to Low)</SelectItem>
                                    <SelectItem value="price-asc">Token Price (Low to High)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Location</Label>
                             <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Locations" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="usa">USA</SelectItem>
                                    <SelectItem value="india">India</SelectItem>
                                    <SelectItem value="germany">Germany</SelectItem>
                                    <SelectItem value="australia">Australia</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="w-full">Apply Filters</Button>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
