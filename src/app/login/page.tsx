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
      <main className="flex-1">
        <div className="container relative h-full flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div
              className="absolute inset-0 bg-cover"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb3VudGFpbnxlbnwwfHx8fDE3MjE4MzE5ODJ8MA&ixlib=rb-4.1.0&w=1080&q=80')",
                backgroundPosition: 'center',
                filter: 'grayscale(100%) brightness(50%)',
              }}
            />
            <div className="relative z-20 flex items-center text-lg font-medium">
              <Briefcase className="mr-2 h-6 w-6" />
              CollabVerse
            </div>
            <div className="relative z-20 mt-auto">
              <blockquote className="space-y-2">
                <p className="text-lg">
                  “This platform has transformed how our team collaborates. It’s
                  intuitive, powerful, and brings all our project management
                  needs under one roof.”
                </p>
                <footer className="text-sm">Sofia Davis, Project Manager</footer>
              </blockquote>
            </div>
          </div>
          <div className="lg:p-8 flex items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
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
        </div>
      </main>
    </div>
  );
}
