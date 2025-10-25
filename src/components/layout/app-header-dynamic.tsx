'use client';

import dynamic from 'next/dynamic';

const AppHeader = dynamic(() => import('@/components/layout/app-header').then(mod => mod.AppHeader), {
  ssr: false,
});

export function DynamicAppHeader() {
  return <AppHeader />;
}
