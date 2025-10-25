'use client';

import { useState, useMemo } from 'react';
import type { Repository, UserProfile } from '@/lib/types';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { GitFork, Star, Search, PlusCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AddRepositoryDialog } from '@/components/dashboard/add-repository-dialog';
import { Skeleton } from '@/components/ui/skeleton';


function LanguageBadge({ language }: { language?: string }) {
    if (!language) return null;
    let colorClass = 'bg-gray-200 text-gray-800';
    if (language === 'TypeScript') {
        colorClass = 'bg-blue-100 text-blue-800';
    } else if (language === 'Go') {
        colorClass = 'bg-teal-100 text-teal-800';
    }
    return <Badge variant="secondary" className={colorClass}>{language}</Badge>;
}

function RepositoryRow({ repository }: { repository: Repository }) {
    const firestore = useFirestore();
    const ownerDocRef = doc(firestore, 'users', repository.ownerUid);
    const { data: owner, loading } = useDoc<UserProfile>(ownerDocRef);

    return (
        <TableRow>
            <TableCell>
                <div className="flex flex-col">
                <Link href={repository.url} className="font-medium hover:underline text-primary" target="_blank">
                    {repository.name}
                </Link>
                <p className="text-sm text-muted-foreground">{repository.description}</p>
                </div>
            </TableCell>
            <TableCell>
                {loading ? <Skeleton className="h-8 w-24" /> : (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                    <AvatarImage src={owner?.photoURL ?? undefined} alt={owner?.displayName ?? ''} />
                    <AvatarFallback>{owner?.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                    </Avatar>
                    <span>{owner?.displayName}</span>
                </div>
                )}
            </TableCell>
            <TableCell>
                <LanguageBadge language={repository.language} />
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{repository.stars ?? 0}</span>
                </div>
                <div className="flex items-center gap-1">
                    <GitFork className="h-4 w-4 text-muted-foreground" />
                    <span>{repository.forks ?? 0}</span>
                </div>
                </div>
            </TableCell>
            <TableCell>{repository.lastCommit ?? 'N/A'}</TableCell>
        </TableRow>
    );
}

export default function RepositoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const firestore = useFirestore();

  const reposCollectionRef = collection(firestore, 'repositories');
  const { data: repositories, loading } = useCollection<Repository>(reposCollectionRef);

  const filteredRepositories = useMemo(() => {
    return (repositories || []).filter(
      (repo) =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [repositories, searchTerm]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Repositories</CardTitle>
                <CardDescription>
                  A list of all GitHub repositories for this project.
                </CardDescription>
            </div>
            <AddRepositoryDialog />
        </div>
        <div className="relative pt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search repositories..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Stats</TableHead>
              <TableHead>Last Commit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
                <>
                    <TableRow><TableCell colSpan={5}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
                    <TableRow><TableCell colSpan={5}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
                </>
            )}
            {!loading && filteredRepositories.map((repo) => (
                <RepositoryRow key={repo.uid} repository={repo} />
            ))}
             {!loading && filteredRepositories.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                        No repositories found.
                    </TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
