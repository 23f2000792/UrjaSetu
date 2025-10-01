"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, Sun } from "lucide-react";

export default function AppHeader() {
    return (
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:hidden">
            <SidebarTrigger>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Sidebar</span>
                </Button>
            </SidebarTrigger>
             <div className="flex items-center gap-2">
                <Sun className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-primary">UrjaSetu</h1>
            </div>
        </header>
    );
}
