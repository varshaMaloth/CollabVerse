import { tasks } from '@/lib/data';
import type { TaskStatus } from '@/lib/types';
import { TaskCard } from '@/components/dashboard/task-card';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const columns: { title: TaskStatus; tasks: typeof tasks }[] = [
  {
    title: 'To Do',
    tasks: tasks.filter((task) => task.status === 'To Do'),
  },
  {
    title: 'In Progress',
    tasks: tasks.filter((task) => task.status === 'In Progress'),
  },
  {
    title: 'Done',
    tasks: tasks.filter((task) => task.status === 'Done'),
  },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Task Board</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {columns.map((column) => (
          <div key={column.title} className="rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              {column.title}
              <span className="ml-2 text-sm text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                {column.tasks.length}
              </span>
            </h3>
            <div className="space-y-4">
              {column.tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
