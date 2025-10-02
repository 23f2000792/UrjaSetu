
'use client';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { createContext, ReactNode, useContext } from 'react';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export interface FirebaseProviderProps {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
  children?: ReactNode;
}

const FirebaseContext = createContext<FirebaseProviderProps>({
  firebaseApp: null,
  auth: null,
  firestore: null,
});

export function FirebaseProvider({
  firebaseApp,
  auth,
  firestore,
  children,
}: FirebaseProviderProps) {
  return (
    <FirebaseContext.Provider
      value={{
        firebaseApp,
        auth,
        firestore,
      }}
    >
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebaseApp() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error(
      'useFirebaseApp must be used within a FirebaseProvider'
    );
  }
  return context.firebaseApp;
}

export function useAuth() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context.auth;
}

export function useFirestore() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error(
      'useFirestore must be used within a FirebaseProvider'
    );
  }
  return context.firestore;
}
