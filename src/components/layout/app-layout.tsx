
"use client";

import { usePathname } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar";
import AppHeader from "@/components/layout/header";
import React, { useState } from "react";
import ChatPanel from '@/components/chatbot/chat-panel';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isLandingPage = pathname === '/';
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (isLandingPage || isAuthPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
        <Sidebar>
            <AppSidebar onChatToggle={() => setIsChatOpen(o => !o)} />
        </Sidebar>
        <SidebarInset>
            <AppHeader />
            <main className="p-4 sm:p-6 lg:p-8">
                {children}
            </main>
            <ChatPanel isOpen={isChatOpen} onOpenChange={setIsChatOpen} />
        </SidebarInset>
    </SidebarProvider>
  );
}
