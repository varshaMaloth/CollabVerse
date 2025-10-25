'use client';

import { useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
        <path d="M15.5 16.5c-2.4 1.5-5.6 1.5-8 0"/>
        <path d="M20.5 11.5c0 6.6-5.4 12-12 12s-12-5.4-12-12 5.4-12 12-12 12 5.4 12 12Z"/>
        <path d="M15.5 5c-2.4-1.5-5.6-1.5-8 0"/>
        <path d="M12 2.5v20"/>
        <path d="M20.5 11.5c-4.4 0-8-1.8-8-4s3.6-4 8-4"/>
        <path d="M3.5 11.5c4.4 0 8 1.8 8 4s-3.6 4-8 4"/>
    </svg>
);


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
        <GoogleIcon />
        Sign in with Google
      </Button>
    </div>
  );
}
