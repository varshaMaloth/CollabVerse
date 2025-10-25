import { ReportGenerator } from '@/components/dashboard/report-generator';
import { tasks, events } from '@/lib/data';
import { format } from 'date-fns';

export default function ReportsPage() {
  const completedTasks = tasks.filter((task) => task.status === 'Done');
  const taskCompletionSummary =
    completedTasks.length > 0
      ? completedTasks.map((task) => `- ${task.title}`).join('\n')
      : 'No tasks were completed this week.';

  const upcomingDeadlinesList = events.filter(
    (event) => event.type === 'deadline' && event.start >= new Date()
  );
  const upcomingDeadlines =
    upcomingDeadlinesList.length > 0
      ? upcomingDeadlinesList
          .map(
            (event) =>
              `- ${event.title} on ${format(event.start, 'MMMM d, yyyy')}`
          )
          .join('\n')
      : 'No upcoming deadlines.';
  
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
  const toDoTasks = tasks.filter(task => task.status === 'To Do').length;

  const overallProjectStatus = `Project is progressing well. ${inProgressTasks} tasks are in progress and ${toDoTasks} tasks are in the backlog.`;


  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-6">Automated Progress Reports</h2>
      <ReportGenerator
        defaultSummary={taskCompletionSummary}
        defaultDeadlines={upcomingDeadlines}
        defaultStatus={overallProjectStatus}
      />
    </div>
  );
}
