'use client';

import type { ProjectDocument, UserProfile } from '@/lib/types';
import { useCollection, useFirestore } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
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
import { FileText } from 'lucide-react';
import { AddDocumentDialog } from '@/components/dashboard/add-document-dialog';
import { Skeleton } from '@/components/ui/skeleton';

function DocumentRow({ document }: { document: ProjectDocument }) {
    const firestore = useFirestore();
    const ownerDocRef = doc(firestore, 'users', document.ownerUid);
    const { data: owner, loading } = useDoc<UserProfile>(ownerDocRef);

    return (
        <TableRow key={document.uid}>
            <TableCell className="font-medium">
                <Link href={document.url} className="flex items-center gap-2 hover:underline text-primary" target="_blank">
                <FileText className="h-4 w-4" />
                {document.title}
                </Link>
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
                {document.lastModified ? formatDistanceToNow(document.lastModified.toDate(), { addSuffix: true }) : 'N/A'}
            </TableCell>
        </TableRow>
    );
}

export default function DocumentsPage() {
  const firestore = useFirestore();
  const documentsCollectionRef = collection(firestore, 'documents');
  const { data: documents, loading } = useCollection<ProjectDocument>(documentsCollectionRef);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Project Documents</CardTitle>
            <CardDescription>A list of all documents related to this project.</CardDescription>
        </div>
        <AddDocumentDialog />
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
            {loading && (
                <>
                    <TableRow><TableCell colSpan={3}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
                    <TableRow><TableCell colSpan={3}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
                </>
            )}
            {!loading && documents?.map((doc) => (
                <DocumentRow key={doc.uid} document={doc} />
            ))}
             {!loading && documents?.length === 0 && (
                <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-10">
                        No documents found.
                    </TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
