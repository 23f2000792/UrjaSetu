
"use client";

import { useEffect, useState, useRef } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, onSnapshot, Timestamp, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useToast } from "@/hooks/use-toast";

// This component will be a client-side component that listens for notifications and does not render any UI.
export default function RealtimeNotificationListener() {
    const { toast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const initialFetchDone = useRef<{ [key: string]: boolean }>({ projects: false, transactions: false });


    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            // Reset fetch state on user change
            initialFetchDone.current = { projects: false, transactions: false };
        });
        return () => unsubscribeAuth();
    }, []);

    // Listener for new project listings (for all users)
    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'projects'),
            where('createdAt', '>', Timestamp.now())
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            if (!initialFetchDone.current.projects) {
                // This is the initial snapshot, don't show notifications for existing data.
                initialFetchDone.current.projects = true;
                return;
            }
            
            for (const docChange of snapshot.docChanges()) {
                if (docChange.type === 'added') {
                    const project = docChange.doc.data();
                    // Don't notify the owner of their own new project
                    if (project.ownerId !== user.uid) {
                        toast({
                            title: "New Project Listed! 🚀",
                            description: `${project.name} is now available on the marketplace.`,
                        });
                        // Also write this to the user's notification collection
                        const notificationRef = doc(collection(db, 'notifications'));
                        await setDoc(notificationRef, {
                            userId: user.uid,
                            type: 'new-listing',
                            title: 'New Project Listed',
                            description: `${project.name} is now available.`,
                            timestamp: serverTimestamp(),
                            isRead: false,
                            projectId: docChange.doc.id,
                        });
                    }
                }
            }
        });

        // Set initial fetch to true after a short delay to avoid race conditions
        const timer = setTimeout(() => {
            initialFetchDone.current.projects = true;
        }, 2000);

        return () => {
            unsubscribe();
            clearTimeout(timer);
        };
    }, [user, toast]);

    // Listener for user-specific purchases and sales
    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'transactions'),
            where('userId', '==', user.uid),
            where('timestamp', '>', Timestamp.now())
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
             if (!initialFetchDone.current.transactions) {
                initialFetchDone.current.transactions = true;
                return;
            }

            for (const docChange of snapshot.docChanges()) {
                 if (docChange.type === 'added') {
                    const tx = docChange.doc.data();
                    if (tx.type === 'Buy') {
                        toast({
                            title: "Purchase Successful ✅",
                            description: `You bought ${tx.quantity} tokens of ${tx.projectName}.`,
                        });
                        const notificationRef = doc(collection(db, 'notifications'));
                        await setDoc(notificationRef, {
                            userId: user.uid,
                            type: 'purchase',
                            title: 'Purchase Successful',
                            description: `You bought ${tx.quantity} tokens of ${tx.projectName}.`,
                            timestamp: serverTimestamp(),
                            isRead: false,
                            projectId: tx.projectId,
                        });
                    }
                    // A simple sale notification can be implemented here if a 'sellerId' is added to transactions
                }
            }
        });
        
        const timer = setTimeout(() => {
            initialFetchDone.current.transactions = true;
        }, 2000);

        return () => {
            unsubscribe();
            clearTimeout(timer);
        }
    }, [user, toast]);


    // This component does not render anything.
    return null;
}
