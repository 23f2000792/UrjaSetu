
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Leaf, Zap, Globe } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  const teamMembers = [
    { name: 'Aditi Sharma', role: 'CEO & Founder', imageId: 'trader1' },
    { name: 'Rohan Verma', role: 'CTO & Co-Founder', imageId: 'trader2' },
    { name: 'Priya Singh', role: 'Lead Engineer', imageId: 'trader4' },
    { name: 'Arjun Das', role: 'Head of Operations', imageId: 'trader3' },
  ];
  
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-main')?.imageUrl || '';

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center pt-12 pb-20 bg-card rounded-lg">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary mb-4">Our Mission</h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
            To democratize access to renewable energy investments, making it simple for anyone, anywhere to support and profit from the global transition to clean energy.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="container">
         <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
                <h2 className="text-3xl font-bold text-primary">The UrjaSetu Story</h2>
                <p className="text-muted-foreground">
                    Founded in 2024, UrjaSetu was born from a simple yet powerful idea: what if everyone could invest directly in solar energy projects? We saw a world transitioning to renewables but realized that the financial benefits were often concentrated, and the process was too complex for everyday investors.
                </p>
                 <p className="text-muted-foreground">
                    We decided to build a bridge ("Setu") to this new energy ("Urja") economy. By leveraging blockchain technology, we are breaking down the barriers to entry, creating a transparent, secure, and efficient marketplace for tokenized solar assets. Our platform empowers individuals to become active participants in building a sustainable future while generating financial returns.
                </p>
            </div>
            <div>
                <Image src={heroImage} alt="Our Story" width={600} height={400} className="rounded-lg shadow-lg" data-ai-hint="solar panels" />
            </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="container">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                        <Leaf className="h-8 w-8 text-primary"/>
                    </div>
                    <CardTitle className="pt-4">Sustainability</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">We are committed to accelerating the adoption of clean energy and creating a positive environmental impact with every transaction.</p>
                </CardContent>
            </Card>
            <Card className="text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                        <Zap className="h-8 w-8 text-primary"/>
                    </div>
                    <CardTitle className="pt-4">Accessibility</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">We believe that investing in renewables should be for everyone. Our platform is designed to be user-friendly and inclusive.</p>
                </CardContent>
            </Card>
             <Card className="text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                        <Globe className="h-8 w-8 text-primary"/>
                    </div>
                    <CardTitle className="pt-4">Transparency</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Through blockchain technology, we provide an immutable and transparent ledger for all investments and energy credits.</p>
                </CardContent>
            </Card>
        </div>
      </section>

      {/* Team Section */}
      <section className="container">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map(member => {
            const memberImage = PlaceHolderImages.find(p => p.id === member.imageId)?.imageUrl || '';
            return (
              <div key={member.name} className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={memberImage} data-ai-hint="person portrait" />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  );
}
