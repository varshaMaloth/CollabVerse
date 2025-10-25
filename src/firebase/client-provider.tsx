
'use client';

import { useMemo, type PropsWithChildren } from 'react';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';

export function FirebaseClientProvider({ children }: PropsWithChildren) {
  const firebase = useMemo(initializeFirebase, []);

  return <FirebaseProvider value={firebase}>{children}</FirebaseProvider>;
}
