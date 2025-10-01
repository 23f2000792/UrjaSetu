
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
    const [userRole, setUserRole] = useState<string | null>(null);
    const [sellerProjectIds, setSellerProjectIds] = useState<string[]>([]);
    
    // Use a ref to track if the initial fetch for each listener is done.
    const initialFetchDone = useRef<{ [key: string]: boolean }>({});

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Reset flags on user change
                initialFetchDone.current = {};
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                if (userDoc.exists()) {
                    const role = userDoc.data().role;
                    setUserRole(role);
                    if (role === 'seller') {
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
        });
        return () => unsubscribeAuth();
    }, []);

    // Listener for new project listings (for buyers)
    useEffect(() => {
        if (!user || userRole !== 'buyer') return;
        
        initialFetchDone.current['projects'] = false;
        
        const q = query(
            collection(db, 'projects'),
            where('createdAt', '>', new Timestamp(0,0)) // Listen to all projects
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            if (!initialFetchDone.current['projects']) {
                initialFetchDone.current['projects'] = true;
                return;
            }
            
            for (const docChange of snapshot.docChanges()) {
                if (docChange.type === 'added') {
                    const project = docChange.doc.data();
                    if (project.ownerId !== user.uid) { // Don't notify for own projects
                        const notifDesc = `${project.name} is now available on the marketplace.`;
                        toast({
                            title: "New Project Listed! 🚀",
                            description: notifDesc,
                        });
                        // No need to create a notification doc here, as it's a general broadcast toast
                    }
                }
            }
        });

        return () => unsubscribe();
    }, [user, userRole, toast]);

    // Listener for notifications targeted at the current user
    useEffect(() => {
        if (!user) return;

        initialFetchDone.current['notifications'] = false;
        
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!initialFetchDone.current['notifications']) {
                initialFetchDone.current['notifications'] = true;
                return; // Ignore initial data
            }

            for (const docChange of snapshot.docChanges()) {
                 if (docChange.type === 'added') {
                    const notification = docChange.doc.data();
                    
                    let title = "New Notification";
                    if (notification.type === 'purchase') title = "Purchase Successful ✅";
                    if (notification.type === 'sale') title = "New Sale! 💰";
                    if (notification.type === 'dispute') title = "New Dispute Filed ⚠️";
                    if (notification.type === 'dispute-update') title = "Dispute Updated 📢";

                    toast({
                        title: title,
                        description: notification.description,
                    });
                 }
            }
        });
        
        return () => unsubscribe();
    }, [user, toast]);


    // This component does not render anything.
    return null;
}
