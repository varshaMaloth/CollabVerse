'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

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

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <p className="text-foreground">Loading CollabVerse...</p>
    </div>
  );
}
