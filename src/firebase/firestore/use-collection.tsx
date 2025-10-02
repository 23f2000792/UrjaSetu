
'use client';
import {
  onSnapshot,
  query,
  Query,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
} from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';

import { useFirestore } from '@/firebase/provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export interface UseCollectionOptions {
  deps?: any[];
}

export function useCollection<T>(
  query: Query<DocumentData> | null,
  options: UseCollectionOptions = {}
) {
  const { deps = [] } = options;
  const db = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const memoizedQuery = useMemo(() => query, [JSON.stringify(query), ...deps]);

  useEffect(() => {
    if (!memoizedQuery || !db) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const unsubscribe = onSnapshot(
      memoizedQuery,
      (snapshot: QuerySnapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(data);
        setLoading(false);
      },
      (serverError: FirestoreError) => {
        const permissionError = new FirestorePermissionError({
          path: (memoizedQuery as any)._path?.canonicalId(),
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedQuery, db]);

  return { data, loading };
}
