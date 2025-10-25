import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { events } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function CalendarPage() {
  const today = new Date();
  const upcomingEvents = events
    .filter((event) => event.start >= today)
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Events</CardTitle>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-4 p-3 rounded-lg bg-card hover:bg-muted transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    {event.type === 'meeting' ? <CalendarIcon className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(event.start, "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <Badge variant={event.type === 'meeting' ? 'secondary' : 'default'} className={event.type === 'meeting' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}>
                    {event.type}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No upcoming events.</p>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="flex justify-center items-center">
        <Calendar
          mode="single"
          selected={today}
          className="p-0"
          classNames={{
            root: "w-full h-full",
            months: "w-full h-full flex justify-center items-center",
            month: "w-full",
            caption_label: "text-lg font-bold",
            head_row: "grid grid-cols-7",
            row: "grid grid-cols-7"
          }}
          modifiers={{
            event: events.map(e => e.start),
          }}
          modifiersStyles={{
            event: { 
              color: 'hsl(var(--accent-foreground))',
              backgroundColor: 'hsl(var(--accent))',
            }
          }}
        />
      </Card>
    </div>
  );
}
