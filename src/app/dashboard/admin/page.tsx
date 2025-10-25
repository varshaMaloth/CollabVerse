'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { users } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  const router = useRouter();
  const currentUser = users[0]; // In a real app, you'd get this from auth context

  useEffect(() => {
    if (currentUser.role !== 'Project Manager') {
      router.replace('/dashboard');
    }
  }, [currentUser, router]);

  if (currentUser.role !== 'Project Manager') {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Welcome, Project Manager! This is where you can manage all project-wide settings.</p>
      </CardContent>
    </Card>
  );
}
