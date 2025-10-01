
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Leaf, Zap, Shield, Repeat, Package, BarChart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LandingProjectCard from "@/components/landing/landing-project-card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { SolarProject } from "@/lib/mock-data";

export default function LandingPage() {
    const heroImage = PlaceHolderImages.find(p => p.id === 'hero-main')?.imageUrl || "https://picsum.photos/seed/hero-main/1200/800";
    const featuresImage = PlaceHolderImages.find(p => p.id === 'features')?.imageUrl || "https://picsum.photos/seed/features/1200/900";
    
    const placeholderProjects: SolarProject[] = [
        {
          id: 'sp1',
          name: 'Mojave Solar Park',
          location: 'California, USA',
          capacity: 5000,
          tokenPrice: 85,
          expectedYield: 8.5,
          imageUrl: PlaceHolderImages.find(p => p.id === 'sp1')?.imageUrl || '',
          imageHint: 'solar panels',
          description: '', operator: '', panelType: '', totalTokens: 0, tokensAvailable: 0, ownerId: ''
        },
        {
          id: 'sp2',
          name: 'Thar Desert Array',
          location: 'Rajasthan, India',
          capacity: 2245,
          tokenPrice: 75,
          expectedYield: 9.2,
          imageUrl: PlaceHolderImages.find(p => p.id === 'sp2')?.imageUrl || '',
          imageHint: 'desert solar',
          description: '', operator: '', panelType: '', totalTokens: 0, tokensAvailable: 0, ownerId: ''
        },
        {
          id: 'sp3',
          name: 'Rooftop Revolution',
          location: 'Berlin, Germany',
          capacity: 800,
          tokenPrice: 95,
          expectedYield: 7.8,
          imageUrl: PlaceHolderImages.find(p => p.id === 'sp3')?.imageUrl || '',
          imageHint: 'rooftop solar',
          description: '', operator: '', panelType: '', totalTokens: 0, tokensAvailable: 0, ownerId: ''
        },
        {
          id: 'sp4',
          name: 'Sunshine Valley',
          location: 'Queensland, Australia',
          capacity: 1500,
          tokenPrice: 80,
          expectedYield: 9.0,
          imageUrl: PlaceHolderImages.find(p => p.id === 'sp4')?.imageUrl || '',
          imageHint: 'solar farm',
          description: '', operator: '', panelType: '', totalTokens: 0, tokensAvailable: 0, ownerId: ''
        }
    ];


  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
        <Link href="#" className="flex items-center justify-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">UrjaSetu</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link
            href="/login"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Login
          </Link>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-card">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_550px] lg:gap-12 xl:grid-cols-[1fr_650px]">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter text-primary sm:text-5xl xl:text-6xl/none">
                    Empower Solar Energy Through Tokenization.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    UrjaSetu is a decentralized marketplace for tokenized solar assets. Buy, sell, and stake solar energy tokens seamlessly while making a real-world impact.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/marketplace">
                      Explore Marketplace
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src={heroImage}
                width="1200"
                height="800"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                data-ai-hint="solar panels sunset"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-20 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  A Simple Path to Green Investing
                </h2>
                <p className="max-w-[800px] text-muted-foreground md:text-lg">
                  We connect you directly to solar energy projects, making sustainable investing transparent and accessible.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 md:grid-cols-3 md:gap-12">
              <div className="flex flex-col items-center text-center gap-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Package className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">1. List or Buy Solar Tokens</h3>
                    <p className="text-muted-foreground">
                      Solar projects are vetted and converted into digital asset tokens on the blockchain, representing ownership or energy credits.
                    </p>
                  </div>
              </div>
               <div className="flex flex-col items-center text-center gap-4">
                   <div className="bg-primary/10 p-4 rounded-full">
                    <Repeat className="w-10 h-10 text-primary" />
                  </div>
                   <div className="space-y-2">
                    <h3 className="text-xl font-bold">2. Earn Energy Credits & Rewards</h3>
                    <p className="text-muted-foreground">
                      Earn rewards from your staked assets and the energy generated by the projects you've invested in.
                    </p>
                   </div>
              </div>
              <div className="flex flex-col items-center text-center gap-4">
                   <div className="bg-primary/10 p-4 rounded-full">
                    <BarChart className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">3. Track Sustainability Impact</h3>
                    <p className="text-muted-foreground">
                      Track your impact and returns with our AI-powered analytics and sustainability reporting tools.
                    </p>
                  </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-24 lg:py-32 bg-muted/50">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm font-medium">
                Why UrjaSetu?
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                The Future of Energy Investing is Here
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-lg">
                UrjaSetu leverages blockchain technology to remove barriers, increase transparency, and empower individuals to participate in the renewable energy revolution.
              </p>
              <ul className="grid gap-6">
                <li className="flex items-start gap-4">
                  <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">Tokenized Solar Assets</h3>
                    <p className="text-muted-foreground">Invest in large-scale solar projects with any budget through fractional ownership.</p>
                  </div>
                </li>
                 <li className="flex items-start gap-4">
                  <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">Energy Credit Tokens (ECT)</h3>
                    <p className="text-muted-foreground">Trade verified energy credits generated from renewable sources on our open marketplace.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">Marketplace & Staking</h3>
                    <p className="text-muted-foreground">Securely buy and sell tokens, and stake your assets to earn rewards and participate in governance.</p>
                  </div>
                </li>
                 <li className="flex items-start gap-4">
                  <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">Analytics & AI Insights</h3>
                    <p className="text-muted-foreground">Get AI-powered summaries of your portfolio's performance and environmental impact.</p>
                  </div>
                </li>
              </ul>
            </div>
             <Image
                src={featuresImage}
                width={1200}
                height={900}
                alt="Feature"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center"
                data-ai-hint="renewable energy infographic"
              />
          </div>
        </section>
        
        {/* Invest Section */}
        <section className="w-full py-20 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Invest in Top Solar Projects</h2>
                    <p className="max-w-[800px] text-muted-foreground md:text-lg">
                        Browse a curated selection of high-impact solar energy projects from around the globe.
                    </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {placeholderProjects.map((project) => (
                        <LandingProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </section>


        {/* CTA Section */}
        <section className="w-full py-20 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Join the Energy Revolution Today
              </h2>
              <p className="mx-auto max-w-[600px] md:text-xl">
                Create your account, connect your wallet, and start building a portfolio that powers a sustainable tomorrow.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
               <Button asChild size="lg" variant="secondary">
                <Link href="/signup">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-muted/50 border-t">
        <div className="container flex flex-col gap-4 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <span className="font-semibold">UrjaSetu</span>
            </div>
            <p className="text-xs text-muted-foreground sm:ml-8">
              &copy; {new Date().getFullYear()} UrjaSetu. All rights reserved.
            </p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
              <Link
                href="/about"
                className="text-xs hover:underline underline-offset-4"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-xs hover:underline underline-offset-4"
              >
                Contact
              </Link>
              <Link
                href="/terms"
                className="text-xs hover:underline underline-offset-4"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-xs hover:underline underline-offset-4"
              >
                Privacy
              </Link>
            </nav>
        </div>
      </footer>
    </div>
  );
}
