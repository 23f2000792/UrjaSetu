
'use client';

import React from 'react';
import { useError } from '@/firebase/error-emitter';

export function FirebaseErrorListener() {
  const { error } = useError();

  if (process.env.NODE_ENV === 'production' || !error) {
    return null;
  }
  
  // This will be caught by the Next.js error overlay
  throw error;
}
