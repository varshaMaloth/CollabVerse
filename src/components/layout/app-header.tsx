'use client';

import { Menu, Search, Bell, Flame, Settings, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

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
import { Input } from '@/components/ui/input';

export function AppHeader() {
  const pathname = usePathname();
  const pageTitle = pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard';
  const [searchOpen, setSearchOpen] = useState(false);
  const streak = 7; // Mock streak number

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
        {searchOpen ? (
          <>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search across your project..."
                className="w-full bg-background pl-10"
                autoFocus
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setSearchOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close search</span>
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-lg font-semibold capitalize flex-1">
              {pageTitle}
            </h1>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full relative">
                      <Flame className="h-5 w-5 text-orange-500" />
                      <span className="sr-only">Streak</span>
                       <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {streak}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>You're on a {streak}-day streak!</p>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          'rounded-full',
                          pathname === '/dashboard/settings' && 'bg-muted'
                        )}
                      >
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
          </>
        )}
      </div>
    </header>
  );
}
