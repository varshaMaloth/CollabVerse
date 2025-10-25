'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Calendar,
  FileText,
  BarChart2,
  Settings,
  Briefcase,
  Github,
  Users,
  Shield,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { users } from '@/lib/data';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navItems = [
  { href: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/dashboard/teams', icon: Users, label: 'Teams' },
  { href: '/dashboard/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/dashboard/repositories', icon: Github, label: 'Repositories' },
  { href: '/dashboard/documents', icon: FileText, label: 'Documents' },
  { href: '/dashboard/reports', icon: BarChart2, label: 'Reports' },
];

const adminNavItem = {
  href: '/dashboard/admin',
  icon: Shield,
  label: 'Admin',
};

export function AppSidebar() {
  const pathname = usePathname();
  const currentUser = users[0]; // In a real app, this would come from an auth provider

  return (
    <aside className="hidden border-r bg-card md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-4 lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="">CollabVerse</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                    isActive && 'bg-muted text-primary'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
             {currentUser.role === 'Project Manager' && (
              <Link
                href={adminNavItem.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  pathname === adminNavItem.href && 'bg-muted text-primary'
                )}
              >
                <adminNavItem.icon className="h-4 w-4" />
                {adminNavItem.label}
              </Link>
            )}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <p className="text-xs text-muted-foreground text-center">© 2024 CollabVerse</p>
        </div>
      </div>
    </aside>
  );
}
