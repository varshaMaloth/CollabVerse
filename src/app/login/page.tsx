'use client';

import { Login } from '@/components/auth/Login';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex h-16 items-center border-b px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="">CollabVerse</span>
        </Link>
      </div>
      <main className="flex flex-1 items-center justify-center bg-background p-4">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center items-center gap-2 mb-4">
                  <Briefcase className="h-8 w-8 text-primary" />
                  <h1 className="text-2xl font-semibold tracking-tight">
                    CollabVerse
                  </h1>
              </div>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>
                Sign in to access your collaborative workspace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Login />
            </CardContent>
            <CardFooter>
              <p className="px-8 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{' '}
                <Link
                  href="#"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="#"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
