'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CalendarEvent } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Video } from "lucide-react";
import { format } from "date-fns";
import { AddEventDialog } from '@/components/dashboard/add-event-dialog';
import { useCollection, useFirestore } from '@/firebase';
import { collection, orderBy, query, where, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function UpcomingEventsSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 rounded-lg">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
             <div className="flex items-start gap-4 p-3 rounded-lg">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
        </div>
    )
}

const ClientOnlyCalendar = dynamic(() => import('@/components/ui/calendar').then(mod => mod.Calendar), {
  ssr: false,
  loading: () => <div className="p-4"><Skeleton className="w-full h-[280px]" /></div>,
});

export default function CalendarPage() {
  const firestore = useFirestore();
  const today = new Date();
  
  const eventsCollectionRef = collection(firestore, 'events');
  const eventsQuery = query(
      eventsCollectionRef, 
      where('start', '>=', Timestamp.fromDate(today)),
      orderBy('start', 'asc')
    );
  const { data: upcomingEvents, loading } = useCollection<CalendarEvent>(eventsQuery);

  const allEventsQuery = collection(firestore, 'events');
  const { data: allEvents } = useCollection<CalendarEvent>(allEventsQuery);

  const eventDates = useMemo(() => {
    return allEvents ? allEvents.map(e => e.start.toDate()) : [];
  }, [allEvents]);


  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Events</CardTitle>
          <div className="flex gap-2">
            <AddEventDialog type="meeting" />
            <AddEventDialog type="deadline" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading && <UpcomingEventsSkeleton />}
            {!loading && upcomingEvents && upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.uid} className="flex items-start gap-4 p-3 rounded-lg bg-card hover:bg-muted transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    {event.type === 'meeting' ? <CalendarIcon className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(event.start.toDate(), "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {event.type === 'meeting' && event.meetingLink && (
                        <Button asChild variant="outline" size="sm">
                            <Link href={event.meetingLink} target="_blank">
                                <Video className="h-4 w-4 mr-2" />
                                Join Meeting
                            </Link>
                        </Button>
                    )}
                    <Badge variant={event.type === 'meeting' ? 'secondary' : 'default'} className={event.type === 'meeting' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}>
                        {event.type}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              !loading && <p className="text-muted-foreground text-center py-4">No upcoming events.</p>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex justify-center items-center p-0">
          <ClientOnlyCalendar
            mode="single"
            selected={today}
            className="p-0 w-full"
            classNames={{
              months: "w-full flex justify-center",
              month: "w-full max-w-sm",
              caption_label: "text-lg font-bold",
              head_row: "grid grid-cols-7",
              row: "grid grid-cols-7"
            }}
            modifiers={{
              event: eventDates,
            }}
            modifiersStyles={{
              event: { 
                color: 'hsl(var(--accent-foreground))',
                backgroundColor: 'hsl(var(--accent))',
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
