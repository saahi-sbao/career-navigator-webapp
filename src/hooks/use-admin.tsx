'use client';

import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export function useAdmin() {
  const { user } = useUser();
  const firestore = useFirestore();

  const adminDocRef = useMemoFirebase(
    () => (user ? doc(firestore, `roles_admin/${user.uid}`) : null),
    [user, firestore]
  );

  const { data: adminDoc, isLoading: isAdminLoading } = useDoc(adminDocRef);

  return {
    isAdmin: !!adminDoc,
    isAdminLoading,
  };
}
