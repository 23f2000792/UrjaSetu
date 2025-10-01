
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Store,
  Wallet,
  Lightbulb,
  Coins,
  Settings,
  Sun,
  User,
  LogOut,
  Gift,
  Code,
  Bell,
  FileText,
  Shield,
  LogIn,
  Gavel,
  AreaChart,
} from 'lucide-react';


const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/marketplace', icon: Store, label: 'Marketplace' },
  { href: '/portfolio', icon: Wallet, label: 'Portfolio' },
  { href: '/insights', icon: Lightbulb, label: 'AI Insights' },
  { href: '/staking', icon: Coins, label: 'Staking' },
  { href: '/rewards', icon: Gift, label: 'Rewards' },
  { href: '/reporting', icon: AreaChart, label: 'Reporting' },
  { href: '/documents', icon: FileText, label: 'Documents' },
  { href: '/disputes', icon: Gavel, label: 'Disputes' },
  { href: '/api', icon: Code, label: 'API' },
];

const adminNavItems = [
    { href: '/admin/documents', icon: Shield, label: 'Document Review' },
    { href: '/admin/disputes', icon: Gavel, label: 'Dispute Management' },
]

const isAuthenticated = true; // Mock authentication state

export function AppSidebar() {
  const pathname = usePathname();

  const isNavItemActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 w-full p-2">
          <Sun className="w-8 h-8 flex-shrink-0 text-primary" />
          <h1 className="text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">
            UrjaSetu
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  as="a"
                  isActive={isNavItemActive(item.href)}
                  tooltip={item.label}
                  className="justify-start"
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        <SidebarSeparator />
        
        <SidebarMenu>
            <p className="text-xs text-muted-foreground px-4 py-2 group-data-[collapsible=icon]:hidden">Admin</p>
             {adminNavItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  as="a"
                  isActive={isNavItemActive(item.href)}
                  tooltip={item.label}
                  className="justify-start"
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

      </SidebarContent>

      <SidebarFooter className="mt-auto">
        {isAuthenticated ? (
          <>
            {/* Expanded Footer */}
            <div className="group-data-[collapsible=icon]:hidden">
              <SidebarSeparator />
              <div className="p-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start gap-2 p-2 h-auto">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://picsum.photos/seed/user/40/40" data-ai-hint="person portrait" />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium">User Name</span>
                          <span className="text-xs text-muted-foreground">user@email.com</span>
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/notifications"><Bell className="mr-2 h-4 w-4" />Notifications</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Collapsed Footer */}
            <div className="hidden group-data-[collapsible=icon]:block">
              <SidebarSeparator />
              <div className="p-2 flex justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage src="https://picsum.photos/seed/user/40/40" data-ai-hint="person portrait" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem asChild>
                      <Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/notifications"><Bell className="mr-2 h-4 w-4" />Notifications</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </>
        ) : (
          <div className="p-2 group-data-[collapsible=icon]:hidden">
             <SidebarSeparator />
            <Link href="/profile">
              <Button className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </Link>
          </div>
        )}
      </SidebarFooter>
    </>
  );
}
