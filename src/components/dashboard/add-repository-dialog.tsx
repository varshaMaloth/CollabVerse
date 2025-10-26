'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function AddRepositoryDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firestore = useFirestore();
  const { data: user } = useUser();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!firestore || !user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to add a repository.',
      });
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const url = formData.get('url') as string;

    // Basic URL parsing to get name
    let name = 'New Repository';
    try {
      const path = new URL(url).pathname;
      const parts = path.split('/').filter(p => p);
      if (parts.length >= 1) {
        name = parts[parts.length - 1];
      }
    } catch (e) {
      // Ignore invalid URL, will use default name
    }

    const newRepo = {
      name,
      url,
      ownerUid: user.uid,
      description: 'Added from CollabVerse',
      language: 'Unknown',
      stars: 0,
      forks: 0,
      lastCommit: 'just now',
    };

    const reposCollectionRef = collection(firestore, 'repositories');

    addDoc(reposCollectionRef, newRepo)
      .then((docRef) => {
        toast({
          title: 'Repository Added',
          description: `Repository "${name}" has been successfully added.`,
        });
        setOpen(false);
        (event.target as HTMLFormElement).reset();
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: reposCollectionRef.path,
          operation: 'create',
          requestResourceData: newRepo,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Repository
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Repository</DialogTitle>
          <DialogDescription>
            Enter the URL of the GitHub repository you want to link.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input id="url" name="url" placeholder="https://github.com/user/repo" className="col-span-3" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Repository'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
