'use client';

import { Menu, Search, Bell, Flame, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AppSidebar } from './app-sidebar';
import { UserNav } from './user-nav';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const pathname = usePathname();
  const pageTitle = pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard';

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 sticky top-0 z-30">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <AppSidebar />
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:gap-2 lg:gap-4">
        <h1 className="text-lg font-semibold capitalize flex-1">
          {pageTitle}
        </h1>
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span className="sr-only">Streak</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>You're on a streak for completing tasks on time!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
           <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                 <Link href="/dashboard/settings">
                  <Button variant="ghost" size="icon" className={cn("rounded-full", pathname === '/dashboard/settings' && 'bg-muted')}>
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
