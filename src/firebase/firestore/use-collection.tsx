
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  startAt,
  startAfter,
  endAt,
  endBefore,
  type DocumentData,
  type CollectionReference,
  type Query,
} from 'firebase/firestore';

import { useFirestore } from '@/firebase/provider';
import type { FirebaseError } from 'firebase/app';

export type CollectionOptions = {
  where?: (readonly [string,
    '<' | '<=' | '==' | '!=' | '>=' | '>',
    any])[];
  orderBy?: (readonly [string, ('asc' | 'desc')?])[];
  limit?: number;
  startAt?: any[];
  startAfter?: any[];
  endAt?: any[];
  endBefore?: any[];
};

export function useCollection<T = DocumentData>(
  collection: CollectionReference<T> | null,
  options: CollectionOptions = {}
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirebaseError | null>(null);

  const optionsRef = useRef(options);

  useEffect(() => {
    if (!collection) {
      setLoading(false);
      return;
    }

    let q: Query<T> = collection;

    if (optionsRef.current.where) {
      optionsRef.current.where.forEach((w) => {
        q = query(q, where(...w));
      });
    }

    if (optionsRef.current.orderBy) {
      optionsRef.current.orderBy.forEach((o) => {
        q = query(q, orderBy(...o));
      });
    }

    if (optionsRef.current.limit) {
      q = query(q, limit(optionsRef.current.limit));
    }

    if (optionsRef.current.startAt) {
      q = query(q, startAt(...optionsRef.current.startAt));
    }

    if (optionsRef.current.startAfter) {
      q = query(q, startAfter(...optionsRef.current.startAfter));
    }

    if (optionsRef.current.endAt) {
      q = query(q, endAt(...optionsRef.current.endAt));
    }

    if (optionsRef.current.endBefore) {
      q = query(q, endBefore(...optionsRef.current.endBefore));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setData(snapshot.docs.map((doc) => doc.data()));
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collection]);

  return { data, loading, error };
}
