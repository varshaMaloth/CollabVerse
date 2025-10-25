'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/firebase';

export default function Home() {
  const router = useRouter();
  const { data: user, loading } = useUser();

  useEffect(() => {
    if (loading) return; 

    if (user) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router, user, loading]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <p className="text-foreground">Loading CollabVerse...</p>
    </div>
  );
}
