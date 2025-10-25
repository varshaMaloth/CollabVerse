import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { useDoc } from "@/firebase/firestore/use-doc";
import { doc, collection } from "firebase/firestore";
import type { UserProfile, Task } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";


/**
 * AdminDashboard
 *
 * This component displays an admin dashboard with charts for task status and user roles.
 * It ensures that only users with the 'Project Manager' role can view it.
 */
const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const firestore = useFirestore();
  const { data: user, loading: userAuthLoading } = useUser();

  const userDocRef = user ? doc(firestore, "users", user.uid) : null;
  const { data: currentUser, loading: userProfileLoading } =
    useDoc<UserProfile>(userDocRef);

  const tasksCollectionRef = collection(firestore, 'tasks');
  const { data: tasks, loading: tasksLoading } = useCollection<Task>(tasksCollectionRef);

  const usersCollectionRef = collection(firestore, 'users');
  const { data: users, loading: usersLoading } = useCollection<UserProfile>(usersCollectionRef);

  useEffect(() => {
    if (!userAuthLoading && !userProfileLoading && currentUser?.role !== "Project Manager") {
      router.replace("/dashboard");
    }
  }, [currentUser, userAuthLoading, userProfileLoading, router]);

  const taskStatusData = useMemo(() => {
    if (!tasks) return [];
    const statusCounts = tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return [
        { name: 'To Do', count: statusCounts['To Do'] || 0 },
        { name: 'In Progress', count: statusCounts['In Progress'] || 0 },
        { name: 'Done', count: statusCounts['Done'] || 0 },
    ];
  }, [tasks]);

  const userRoleData = useMemo(() => {
    if (!users) return [];
    const roleCounts = users.reduce((acc, user) => {
        if(user.role) {
            acc[user.role] = (acc[user.role] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(roleCounts).map(([name, value]) => ({ name, value }));
  }, [users]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const loading = userAuthLoading || userProfileLoading || tasksLoading || usersLoading;

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
           <CardHeader>
            <Skeleton className="h-8 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (currentUser?.role !== "Project Manager") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p>Verifying permissions...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Task Status Overview</CardTitle>
          <CardDescription>
            A snapshot of current task distribution by status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskStatusData}>
              <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Role Distribution</CardTitle>
           <CardDescription>A breakdown of user roles across the project.</CardDescription>
        </CardHeader>
        <CardContent>
           <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userRoleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {userRoleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
               <Tooltip
                contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
