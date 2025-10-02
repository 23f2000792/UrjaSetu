
'use client';
import { ReactNode, useMemo } from 'react';

import {
  FirebaseProvider,
  FirebaseProviderProps,
} from '@/firebase/provider';
import { initializeFirebase } from '.';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const firebaseContext = useMemo<FirebaseProviderProps>(() => {
    return initializeFirebase();
  }, []);

  return (
    <FirebaseProvider
      firestore={firebaseContext.firestore}
      auth={firebaseContext.auth}
      firebaseApp={firebaseContext.firebaseApp}
    >
      {children}
    </FirebaseProvider>
  );
}
