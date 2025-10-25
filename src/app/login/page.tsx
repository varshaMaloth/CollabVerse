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
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <div className="text-center mb-4">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Briefcase className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">
              CollabVerse
            </h1>
          </div>
          <p className="text-muted-foreground">
            A centralized platform to manage tasks, meetings, and project milestones.
          </p>
        </div>
        <Card>
          <CardHeader className="text-center">
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
    </div>
  );
}