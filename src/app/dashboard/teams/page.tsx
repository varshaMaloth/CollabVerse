'use client';

import { useCollection } from '@/firebase';
import { useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Flame, MessageCircle, Star, UserPlus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { AddMemberDialog } from '@/components/dashboard/add-member-dialog';

function UserCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-col items-center p-6 text-center">
        <Skeleton className="h-20 w-20 rounded-full mb-4" />
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-24" />
      </CardContent>
      <Separator />
      <div className="p-4 grid grid-cols-2 gap-2 text-sm">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full col-span-2" />
      </div>
      <div className="p-4 border-t bg-muted/50 flex justify-center items-center rounded-b-lg">
        <Skeleton className="h-5 w-24" />
      </div>
    </Card>
  );
}

export default function TeamsPage() {
  const firestore = useFirestore();
  const usersCollectionRef = collection(firestore, 'users');
  const { data: users, loading } = useCollection<UserProfile>(usersCollectionRef);

  // Helper to generate a consistent number from a string (like a UID)
  const getStableNumber = (str: string, max: number) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return (Math.abs(hash) % max) + 1;
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Meet the talented individuals driving this project forward.
            </CardDescription>
          </div>
          <AddMemberDialog />
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading && (
                <>
                    <UserCardSkeleton />
                    <UserCardSkeleton />
                    <UserCardSkeleton />
                </>
            )}
            {users && users.map((user) => (
              <Card key={user.uid} className="flex flex-col">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
                    <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">{user.displayName}</h3>
                  <p className="text-muted-foreground">{user.role}</p>
                </CardContent>
                <Separator />
                <div className="p-4 grid grid-cols-2 gap-2 text-sm">
                   <Button variant="outline" size="sm">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Connect
                   </Button>
                   <Button variant="outline" size="sm">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message
                   </Button>
                   <Button variant="outline" size="sm" className="col-span-2">
                    <Star className="mr-2 h-4 w-4" />
                    Give Feedback
                   </Button>
                </div>
                 <div className="p-4 border-t bg-muted/50 flex justify-center items-center rounded-b-lg">
                    <Flame className="h-5 w-5 text-orange-500 mr-2" />
                    <span className="text-sm font-semibold">
                      {getStableNumber(user.uid, 20)} Day Streak
                    </span>
                 </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
