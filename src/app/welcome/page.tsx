'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useAuth } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Loading } from '@/components/layout/loading';

const roles = ['Project Manager', 'Team Member', 'Mentor', 'Viewer'];

export default function WelcomePage() {
  const { data: user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSelection = async () => {
    if (!user || !firestore || !selectedRole) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a role.',
      });
      return;
    }

    setIsSubmitting(true);

    const userRef = doc(firestore, 'users', user.uid);
    const userProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: selectedRole,
    };

    try {
      await setDoc(userRef, userProfile, { merge: true });
      toast({
        title: 'Welcome!',
        description: 'Your profile has been created.',
      });
      router.push('/dashboard');
    } catch (serverError) {
      const permissionError = new FirestorePermissionError({
        path: userRef.path,
        operation: 'create',
        requestResourceData: userProfile,
      });
      errorEmitter.emit('permission-error', permissionError);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (userLoading) {
    return <Loading />;
  }

  if (!user) {
    router.replace('/login');
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to CollabVerse!</CardTitle>
          <CardDescription>
            To get started, please select your role in the project.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={setSelectedRole} value={selectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select your role..." />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleRoleSelection}
            disabled={!selectedRole || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Continue to Dashboard'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
