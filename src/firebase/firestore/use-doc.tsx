
'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, type DocumentReference, type DocumentData } from 'firebase/firestore';

import { useFirestore } from '@/firebase/provider';
import type { FirebaseError } from 'firebase/app';

export function useDoc<T = DocumentData>(doc: DocumentReference<T> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirebaseError | null>(null);

  useEffect(() => {
    if (!doc) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc,
      (snapshot) => {
        setData(snapshot.data() ?? null);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [doc]);

  return { data, loading, error };
}
