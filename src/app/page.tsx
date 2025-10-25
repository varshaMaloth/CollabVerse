'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Loading } from '@/components/layout/loading';

export default function Home() {
  const router = useRouter();
  const { data: user, loading } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    if (loading || !firestore) return;

    if (user) {
      const userDocRef = doc(firestore, 'users', user.uid);
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists() && docSnap.data().role) {
          router.replace('/dashboard');
        } else {
          router.replace('/welcome');
        }
      });
    } else {
      router.replace('/login');
    }
  }, [router, user, loading, firestore]);

  return <Loading text="Loading CollabVerse..." />;
}
