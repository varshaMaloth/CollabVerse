'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const AdminDashboard = dynamic(() => import('./admin-dashboard'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[600px]" />,
});

export function DynamicAdminDashboard() {
  return <AdminDashboard />;
}
