
'use client';

import { useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Chrome } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Login() {
  const auth = useAuth();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    if (!auth) {
      console.error("Auth service is not available.");
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Button
        onClick={handleGoogleSignIn}
        variant="outline"
        className="w-full"
      >
        <Chrome className="mr-2 h-4 w-4" />
        Sign in with Google
      </Button>
    </div>
  );
}
