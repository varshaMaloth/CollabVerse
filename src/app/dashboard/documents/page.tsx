import { documents, users } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { FileText, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DocumentsPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Project Documents</CardTitle>
            <CardDescription>A list of all documents related to this project.</CardDescription>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Document
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Last Modified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">
                  <Link href={doc.url} className="flex items-center gap-2 hover:underline text-primary" target="_blank">
                    <FileText className="h-4 w-4" />
                    {doc.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={doc.owner.avatarUrl} alt={doc.owner.name} />
                      <AvatarFallback>{doc.owner.initials}</AvatarFallback>
                    </Avatar>
                    <span>{doc.owner.name}</span>
                  </div>
                </TableCell>
                <TableCell>{formatDistanceToNow(new Date(doc.lastModified), { addSuffix: true })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
