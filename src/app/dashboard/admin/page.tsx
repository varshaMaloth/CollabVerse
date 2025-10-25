'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { users, tasks } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function AdminPage() {
  const router = useRouter();
  const currentUser = users[0]; 

  useEffect(() => {
    if (currentUser.role !== 'Project Manager') {
      router.replace('/dashboard');
    }
  }, [currentUser, router]);

  const projectProgress = useMemo(() => {
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter(task => task.status === 'Done').length;
    return totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;
  }, []);

  const tasksByStatus = useMemo(() => {
    const statuses = ['To Do', 'In Progress', 'Done'];
    return statuses.map(status => ({
      name: status,
      count: tasks.filter(task => task.status === status).length,
    }));
  }, []);
  
  const teamWorkInfo = useMemo(() => {
    return users.map(user => {
        const userTasks = tasks.filter(task => task.assignees.some(a => a.id === user.id));
        const tasksDone = userTasks.filter(t => t.status === 'Done').length;
        // Mock active time
        const lastActive = `${Math.floor(Math.random() * 24)} hours ago`;
        return {
            ...user,
            tasksAssigned: userTasks.length,
            tasksDone,
            lastActive
        };
    })
  }, []);

  if (currentUser.role !== 'Project Manager') {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <Card>
            <CardHeader>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>Welcome, Project Manager! Here's an overview of your project.</CardDescription>
            </CardHeader>
       </Card>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center gap-4">
                <Progress value={projectProgress} className="h-3" />
                <span className="font-semibold text-lg">{Math.round(projectProgress)}%</span>
             </div>
             <p className="text-sm text-muted-foreground">Overall task completion status.</p>
             <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tasksByStatus}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{
                                background: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                            }}
                        />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">Total Tasks</span>
                    <span className="text-2xl font-bold">{tasks.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">Tasks In Progress</span>
                    <span className="text-2xl font-bold">{tasks.filter(t => t.status === 'In Progress').length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">Completed Tasks</span>
                    <span className="text-2xl font-bold">{tasks.filter(t => t.status === 'Done').length}</span>
                </div>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Activity</CardTitle>
          <CardDescription>An overview of team member engagement and workload.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Tasks Assigned</TableHead>
                <TableHead>Tasks Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamWorkInfo.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{member.lastActive}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{member.tasksAssigned}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">{member.tasksDone}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
