
"use client";

import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Send, MessageSquare, Wand2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { chatWithBot } from "@/ai/flows/ai-chatbot";
import { useToast } from "@/hooks/use-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { User as FirebaseUser } from 'firebase/auth';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

interface ChatPanelProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function ChatPanel({ isOpen, onOpenChange }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<'buyer' | 'seller' | 'admin'>('buyer');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await chatWithBot({ message: input, role: role });
      const botMessage: Message = { id: (Date.now() + 1).toString(), text: result.response, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error with chatbot:", error);
      toast({
        title: "Error",
        description: "The AI assistant is currently unavailable.",
        variant: "destructive",
      });
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-md p-0 flex flex-col" side="right">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Wand2 className="text-primary" />
            UrjaBot Assistant
          </SheetTitle>
           <SheetDescription>
            Your AI-powered guide for navigating UrjaSetu.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 flex flex-col bg-muted/20">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3",
                    message.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.sender === 'bot' && (
                    <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                      <AvatarFallback><Wand2 className="h-4 w-4"/></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-xs rounded-lg p-3 text-sm",
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border"
                    )}
                  >
                    {message.text}
                  </div>
                  {message.sender === 'user' && (
                     <Avatar className="h-8 w-8">
                      <AvatarFallback><User className="h-4 w-4"/></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-sm p-8">
                  Ask me anything about using the platform! For example: "How do I list a project?"
                </div>
              )}
              {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                  <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                    <AvatarFallback><Wand2 className="h-4 w-4"/></AvatarFallback>
                  </Avatar>
                  <div className="bg-background border rounded-lg p-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
               <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <div className="p-4 bg-background border-t">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask UrjaBot..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
