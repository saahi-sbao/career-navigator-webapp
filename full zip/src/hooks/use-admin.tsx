
'use client';

import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export function useAdmin() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const adminDocRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, `roles_admin/${user.uid}`) : null),
    [user, firestore]
  );

  const { data: adminDoc, isLoading: isAdminDocLoading } = useDoc(adminDocRef);

  const isAdminLoading = isUserLoading || (user && isAdminDocLoading);

  return {
    isAdmin: !!adminDoc,
    isAdminLoading,
  };
}
