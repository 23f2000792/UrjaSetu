
"use client";

import { useEffect, useState, useRef } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, onSnapshot, Timestamp, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useToast } from "@/hooks/use-toast";
import type { SolarProject } from '@/lib/mock-data';

// This component will be a client-side component that listens for notifications and does not render any UI.
export default function RealtimeNotificationListener() {
    const { toast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [sellerProjectIds, setSellerProjectIds] = useState<string[]>([]);
    const initialFetchDone = useRef<{ [key: string]: boolean }>({ 
        projects: false, 
        transactions: false,
        sales: false 
    });


    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                if (userDoc.exists()) {
                    const role = userDoc.data().role;
                    setUserRole(role);
                    if (role === 'seller') {
                        // Fetch the seller's project IDs
                        const projectsQuery = query(collection(db, "projects"), where("ownerId", "==", currentUser.uid));
                        const projectsSnapshot = await getDocs(projectsQuery);
                        const projectIds = projectsSnapshot.docs.map(doc => doc.id);
                        setSellerProjectIds(projectIds);
                    }
                }
            } else {
                setUserRole(null);
                setSellerProjectIds([]);
            }
            // Reset fetch state on user change
            initialFetchDone.current = { projects: false, transactions: false, sales: false };
        });
        return () => unsubscribeAuth();
    }, []);

    // Listener for new project listings (for buyers)
    useEffect(() => {
        if (!user || userRole !== 'buyer') return;

        const q = query(
            collection(db, 'projects'),
            where('createdAt', '>', Timestamp.now())
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            if (!initialFetchDone.current.projects) {
                initialFetchDone.current.projects = true;
                return;
            }
            
            for (const docChange of snapshot.docChanges()) {
                if (docChange.type === 'added') {
                    const project = docChange.doc.data();
                    if (project.ownerId !== user.uid) { // Should always be true for buyers
                        const notifDesc = `${project.name} is now available on the marketplace.`;
                        toast({
                            title: "New Project Listed! 🚀",
                            description: notifDesc,
                        });
                        const notificationRef = doc(collection(db, 'notifications'));
                        await setDoc(notificationRef, {
                            userId: user.uid,
                            type: 'new-listing',
                            title: 'New Project Listed',
                            description: notifDesc,
                            timestamp: serverTimestamp(),
                            isRead: false,
                            projectId: docChange.doc.id,
                        });
                    }
                }
            }
        });

        const timer = setTimeout(() => { initialFetchDone.current.projects = true; }, 2000);
        return () => { unsubscribe(); clearTimeout(timer); };
    }, [user, userRole, toast]);

    // Listener for user's own purchases (for buyers)
    useEffect(() => {
        if (!user || userRole !== 'buyer') return;

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
                    const notifDesc = `You bought ${tx.quantity} tokens of ${tx.projectName}.`;
                    toast({
                        title: "Purchase Successful ✅",
                        description: notifDesc,
                    });
                    const notificationRef = doc(collection(db, 'notifications'));
                    await setDoc(notificationRef, {
                        userId: user.uid,
                        type: 'purchase',
                        title: 'Purchase Successful',
                        description: notifDesc,
                        timestamp: serverTimestamp(),
                        isRead: false,
                        projectId: tx.projectId,
                    });
                 }
            }
        });
        
        const timer = setTimeout(() => { initialFetchDone.current.transactions = true; }, 2000);
        return () => { unsubscribe(); clearTimeout(timer); }
    }, [user, userRole, toast]);

    // Listener for sales on seller's projects
    useEffect(() => {
        if (userRole !== 'seller' || sellerProjectIds.length === 0) return;

        const q = query(
            collection(db, 'transactions'),
            where('projectId', 'in', sellerProjectIds),
            where('timestamp', '>', Timestamp.now())
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            if (!initialFetchDone.current.sales) {
                initialFetchDone.current.sales = true;
                return;
            }

            for (const docChange of snapshot.docChanges()) {
                if (docChange.type === 'added') {
                    const tx = docChange.doc.data();
                    const notifDesc = `Sold ${tx.quantity} tokens of ${tx.projectName}.`;
                    toast({
                        title: "New Sale! 💰",
                        description: notifDesc,
                    });

                    const notificationRef = doc(collection(db, 'notifications'));
                    await setDoc(notificationRef, {
                        userId: user.uid, // The notification is FOR the seller
                        type: 'sale',
                        title: 'New Sale',
                        description: notifDesc,
                        timestamp: serverTimestamp(),
                        isRead: false,
                        projectId: tx.projectId,
                    });
                }
            }
        });

        const timer = setTimeout(() => { initialFetchDone.current.sales = true; }, 2000);
        return () => { unsubscribe(); clearTimeout(timer); };
    }, [user, userRole, sellerProjectIds, toast]);


    // This component does not render anything.
    return null;
}
