'use client';

import dynamic from 'next/dynamic';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { format } from 'date-fns';
import type { Task, CalendarEvent } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const ReportGenerator = dynamic(() => import('./report-generator').then(mod => mod.ReportGenerator), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[400px]" />,
});

export function DynamicReportGenerator() {
  const firestore = useFirestore();
  const { data: tasks, loading: tasksLoading } = useCollection<Task>(collection(firestore, 'tasks'));
  const { data: events, loading: eventsLoading } = useCollection<CalendarEvent>(collection(firestore, 'events'));

  if (tasksLoading || eventsLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  const completedTasks = tasks?.filter((task) => task.status === 'Done') ?? [];
  const taskCompletionSummary =
    completedTasks.length > 0
      ? completedTasks.map((task) => `- ${task.title}`).join('\n')
      : 'No tasks were completed this week.';

  const upcomingDeadlinesList = events?.filter(
    (event) => event.type === 'deadline' && event.start.toDate() >= new Date()
  ) ?? [];
  
  const upcomingDeadlines =
    upcomingDeadlinesList.length > 0
      ? upcomingDeadlinesList
          .map(
            (event) =>
              `- ${event.title} on ${format(event.start.toDate(), 'MMMM d, yyyy')}`
          )
          .join('\n')
      : 'No upcoming deadlines.';
  
  const inProgressTasks = tasks?.filter(task => task.status === 'In Progress').length ?? 0;
  const toDoTasks = tasks?.filter(task => task.status === 'To Do').length ?? 0;

  const overallProjectStatus = `Project is progressing. ${inProgressTasks} tasks are in progress and ${toDoTasks} tasks are in the backlog.`;

  return (
      <ReportGenerator
        defaultSummary={taskCompletionSummary}
        defaultDeadlines={upcomingDeadlines}
        defaultStatus={overallProjectStatus}
      />
  );
}
