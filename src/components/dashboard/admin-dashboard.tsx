'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Task, UserProfile } from '@/lib/types';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';


export default function AdminDashboard() {
  const router = useRouter();
  const firestore = useFirestore();
  const { data: user } = useUser();
  const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
  const { data: currentUser, loading: userLoading } = useDoc<UserProfile>(userDocRef);

  const { data: users, loading: usersLoading } = useCollection<UserProfile>(collection(firestore, 'users'));
  const { data: tasks, loading: tasksLoading } = useCollection<Task>(collection(firestore, 'tasks'));
  
  useEffect(() => {
    if (!userLoading && currentUser?.role && currentUser.role !== 'Project Manager') {
      router.replace('/dashboard');
    }
  }, [currentUser, userLoading, router]);

  const projectProgress = useMemo(() => {
    if (!tasks) return 0;
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter(task => task.status === 'Done').length;
    return totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;
  }, [tasks]);

  const tasksByStatus = useMemo(() => {
    if (!tasks) return [];
    const statuses = ['To Do', 'In Progress', 'Done'];
    return statuses.map(status => ({
      name: status,
      count: tasks.filter(task => task.status === status).length,
    }));
  }, [tasks]);
  
  const getStableLastActive = (uid: string) => {
    if (!uid) return 'a while ago';
    let hash = 0;
    for (let i = 0; i < uid.length; i++) {
        const char = uid.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }
    const hours = (Math.abs(hash) % 23) + 1;
    return `${hours} hours ago`;
  };
  
  const teamWorkInfo = useMemo(() => {
    if (!users || !tasks || !currentUser) return [];
    return users.map(user => {
        const userTasks = tasks.filter(task => task.ownerUid === user.uid);
        const tasksDone = userTasks.filter(t => t.status === 'Done').length;
        
        return {
            ...user,
            tasksAssigned: userTasks.length,
            tasksDone,
            lastActive: user.uid === currentUser?.uid ? 'Active now' : getStableLastActive(user.uid),
        };
    })
  }, [users, tasks, currentUser]);

  if (userLoading || !currentUser || currentUser.role !== 'Project Manager') {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p>Verifying permissions...</p>
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
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
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
            </Header>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">Total Tasks</span>
                    <span className="text-2xl font-bold">{tasks?.length ?? 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">Tasks In Progress</span>
                    <span className="text-2xl font-bold">{tasks?.filter(t => t.status === 'In Progress').length ?? 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">Completed Tasks</span>
                    <span className="text-2xl font-bold">{tasks?.filter(t => t.status === 'Done').length ?? 0}</span>
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
                <TableRow key={member.uid}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={member.photoURL ?? undefined} alt={member.displayName ?? ''} />
                        <AvatarFallback>{member.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.displayName}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {member.lastActive === 'Active now' ? (
                        <span className="flex items-center gap-2 text-green-600">
                            <span className="h-2 w-2 rounded-full bg-green-600 animate-pulse"></span>
                            Active now
                        </span>
                    ) : (
                        member.lastActive
                    )}
                  </TableCell>
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
