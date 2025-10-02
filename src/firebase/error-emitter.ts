
import { EventEmitter } from 'events';
import { useState, useEffect } from 'react';
import type { FirestorePermissionError } from './errors';

// This is a client-side only event emitter
const errorEmitter = new EventEmitter();

function useError() {
  const [error, setError] = useState<FirestorePermissionError | null>(null);

  useEffect(() => {
    const handler = (e: FirestorePermissionError) => {
      setError(e);
    };

    errorEmitter.on('permission-error', handler);

    return () => {
      errorEmitter.off('permission-error', handler);
    };
  }, []);

  return { error };
}

export { errorEmitter, useError };
