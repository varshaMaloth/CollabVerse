import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useUser, useFirestore } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * AdminDashboard
 *
 * Replace or extend Card contents with your real dashboard widgets.
 * This file uses standard TSX syntax (React import included) to avoid
 * parsers that expect an explicit React import.
 */
const AdminDashboard: React.FC = () => {
    const router = useRouter();
    const firestore = useFirestore();
    const { data: user } = useUser();
    const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
    const { data: currentUser, loading: userLoading } = useDoc<UserProfile>(userDocRef);

    useEffect(() => {
        if (!userLoading && currentUser?.role && currentUser.role !== 'Project Manager') {
        router.replace('/dashboard');
        }
    }, [currentUser, userLoading, router]);

    if (userLoading || !currentUser || currentUser.role !== 'Project Manager') {
        return (
        <div className="flex h-full w-full items-center justify-center">
            <p>Verifying permissions...</p>
        </div>
        );
    }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
           <CardDescription>Welcome, Project Manager! Here's an overview of your project.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Welcome to the admin dashboard. Add your widgets here.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            <li>Users: —</li>
            <li>Active: —</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
