'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Loader2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '@/lib/types';

type AddEventDialogProps = {
    type: 'meeting' | 'deadline'
}

export function AddEventDialog({ type }: AddEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date>();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!firestore || !date) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a date.',
      });
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const time = formData.get('time') as string;
    const meetingLink = formData.get('meetingLink') as string;
    
    const [hours, minutes] = time.split(':').map(Number);
    const startDate = new Date(date);
    startDate.setHours(hours, minutes);

    const newEvent: Omit<CalendarEvent, 'uid'> = {
      title,
      start: Timestamp.fromDate(startDate),
      type,
    };
    
    if (type === 'meeting' && meetingLink) {
        newEvent.meetingLink = meetingLink;
    }

    const eventsCollectionRef = collection(firestore, 'events');
    
    addDoc(eventsCollectionRef, newEvent)
      .then(() => {
        toast({
          title: 'Event Created',
          description: `Event "${title}" has been successfully added.`,
        });
        setOpen(false);
        setDate(undefined);
        (event.target as HTMLFormElement).reset();
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: eventsCollectionRef.path,
          operation: 'create',
          requestResourceData: newEvent,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const buttonLabel = type === 'meeting' ? 'Add Event' : 'Add Deadline';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
            {type === 'meeting' ? <PlusCircle className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
            {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{buttonLabel}</DialogTitle>
            <DialogDescription>
              Fill out the details below to create a new {type}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" name="title" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                    Date
                </Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "col-span-3 justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input id="time" name="time" type="time" className="col-span-3" required />
            </div>
            {type === 'meeting' && (
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="meetingLink" className="text-right">
                        Meeting Link
                    </Label>
                    <Input id="meetingLink" name="meetingLink" type="url" placeholder="https://meet.google.com/..." className="col-span-3" />
                </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
