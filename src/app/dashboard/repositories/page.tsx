import { repositories } from '@/lib/data';
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
import { GitFork, Star } from 'lucide-react';

function LanguageBadge({ language }: { language: string }) {
    let colorClass = 'bg-gray-200 text-gray-800';
    if (language === 'TypeScript') {
        colorClass = 'bg-blue-100 text-blue-800';
    } else if (language === 'Go') {
        colorClass = 'bg-teal-100 text-teal-800';
    }
    return <Badge variant="secondary" className={colorClass}>{language}</Badge>;
}

export default function RepositoriesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Repositories</CardTitle>
        <CardDescription>
          A list of all GitHub repositories for this project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Stats</TableHead>
              <TableHead>Last Commit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {repositories.map((repo) => (
              <TableRow key={repo.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <Link href={repo.url} className="font-medium hover:underline text-primary" target="_blank">
                      {repo.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{repo.description}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <LanguageBadge language={repo.language} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{repo.stars}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-4 w-4 text-muted-foreground" />
                      <span>{repo.forks}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{repo.lastCommit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
