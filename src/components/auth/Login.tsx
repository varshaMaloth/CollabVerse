'use client';

import { useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="24px"
    height="24px"
    className="mr-2 h-4 w-4"
  >
    <path
      fill="#4285F4"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FFC107"
      d="M-3,34.5l5.657-5.657C-1.218,29.945,-2,27.025,-2,24c0-2.306,0.441-4.47,1.254-6.438L-3.403,11.9C-5.163,15.539,-6,19.658,-6,24C-6,28.712,-4.465,32.84,-2,36.198z"
    />
    <path
      fill="#34A853"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-5.657-5.657C30.07,35.257,27.225,36,24,36c-5.222,0-9.612-3.344-11.283-7.946l-5.657,5.657C9.043,39.636,15.958,44,24,44z"
    />
    <path
      fill="#4CAF50"
      d="M43.611,20.083L43.595,20L24,20v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l5.657,5.657C38.358,34.612,42.224,29.592,42.224,24C42.224,22.461,42.062,20.95,41.78,19.499L43.611,20.083z"
    />
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
