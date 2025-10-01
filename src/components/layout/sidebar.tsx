
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Zap,
  User,
  LogOut,
  Gift,
  Bell,
  FileText,
  Shield,
  LogIn,
  Gavel,
  AreaChart,
  Briefcase,
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth'; 
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from "firebase/firestore";
import type { User as FirebaseUser } from 'firebase/auth';
import { useState, useEffect } from 'react';


const userNavItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/marketplace', icon: Store, label: 'Marketplace' },
  { href: '/portfolio', icon: Wallet, label: 'Portfolio' },
  { href: '/insights', icon: Lightbulb, label: 'AI Insights' },
  { href: '/staking', icon: Coins, label: 'Staking' },
  { href: '/rewards', icon: Gift, label: 'Rewards' },
  { href: '/reporting', icon: AreaChart, label: 'Reporting' },
  { href: '/disputes', icon: Gavel, label: 'Disputes' },
];

const sellerNavItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/seller/projects', icon: Briefcase, label: 'My Projects' },
    { href: '/seller/disputes', icon: Gavel, label: 'Dispute Management' },
];

const sharedBottomNavItems = [
];


export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      if (user) {
        setUser(user);
        const docRef = doc(db, "users", user.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userRole = docSnap.data().role;
            setRole(userRole);
          } else {
             // Fallback for users created before Firestore role storage
            const localRole = localStorage.getItem('userRole');
            if (localRole) {
                setRole(localRole);
            } else {
                console.log("User document not found and no local role.");
                setRole('buyer'); // Default to buyer
            }
          }
        } catch (error) {
            console.error("Error fetching user role, falling back to localStorage", error);
            const localRole = localStorage.getItem('userRole');
             if (localRole) {
                setRole(localRole);
            } else {
                setRole('buyer'); // Default to buyer
            }
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar')?.imageUrl || '';
  
  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem('userRole');
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/');
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "An error occurred while logging out.",
        variant: "destructive",
      });
    }
  };

  const isNavItemActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };
  
  const navItems = role === 'seller' ? sellerNavItems : userNavItems;

  if (isLoading) {
    return (
        <>
            <SidebarHeader>
                 <Link href="/" className="flex items-center gap-2 w-full p-2">
                    <Zap className="w-8 h-8 flex-shrink-0 text-primary" />
                </Link>
            </SidebarHeader>
            <SidebarContent>
                {/* You can add a skeleton loader here */}
            </SidebarContent>
        </>
    );
  }

  return (
    <>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 w-full p-2">
          <Zap className="w-8 h-8 flex-shrink-0 text-primary" />
          <h1 className="text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">
            UrjaSetu
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {user && navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href}>
                <SidebarMenuButton
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
        {user ? (
          <>
             {/* Shared Bottom Nav */}
            <SidebarContent className="flex-grow-0">
                <SidebarMenu>
                     <SidebarSeparator />
                     {sharedBottomNavItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                        <Link href={item.href}>
                            <SidebarMenuButton
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

            {/* Expanded Footer */}
            <div className="group-data-[collapsible=icon]:hidden">
              <SidebarSeparator />
              <div className="p-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start gap-2 p-2 h-auto">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={userAvatar} data-ai-hint="person portrait" />
                          <AvatarFallback>{user.email ? user.email.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium capitalize">{role === 'seller' ? 'Solar Farm Owner' : 'Buyer'}</span>
                          <span className="text-xs text-muted-foreground truncate">{user.email}</span>
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
                    <DropdownMenuItem onClick={handleLogout}>
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
                      <AvatarImage src={userAvatar} data-ai-hint="person portrait" />
                      <AvatarFallback>{user.email ? user.email.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
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
                    <DropdownMenuItem onClick={handleLogout}>
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
            <Link href="/login">
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
