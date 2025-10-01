
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "Message Sent!",
                description: "Thank you for contacting us. We'll get back to you shortly.",
            });
            setName('');
            setEmail('');
            setMessage('');
        }, 1000);
    }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary">Get in Touch</h1>
        <p className="max-w-xl mx-auto text-lg text-muted-foreground mt-4">
          We're here to help. Whether you have a question about our platform, investments, or partnerships, we'd love to hear from you.
        </p>
      </div>

      <div className="container grid lg:grid-cols-2 gap-12">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>Fill out the form and our team will get back to you within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Your message..." value={message} onChange={(e) => setMessage(e.target.value)} rows={6} required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : <><Send className="mr-2 h-4 w-4" /> Send Message</>}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="space-y-6 pt-6">
            <h2 className="text-2xl font-bold">Contact Information</h2>
            <div className="space-y-4 text-muted-foreground">
                <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-foreground">Our Office</h3>
                        <p>123 Green Energy Lane, Bengaluru, Karnataka 560102, India</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                     <div>
                        <h3 className="font-semibold text-foreground">Email Us</h3>
                        <p>General Inquiries: <a href="mailto:contact@urjasetu.com" className="underline hover:text-primary">contact@urjasetu.com</a></p>
                        <p>Support: <a href="mailto:support@urjasetu.com" className="underline hover:text-primary">support@urjasetu.com</a></p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                     <div>
                        <h3 className="font-semibold text-foreground">Call Us</h3>
                        <p>+91 (080) 1234 5678</p>
                        <p className="text-sm">(Mon-Fri, 9am - 6pm IST)</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
