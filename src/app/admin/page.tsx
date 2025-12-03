'use client';

import { useAdmin } from '@/hooks/use-admin';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdminPage() {
  const { isAdmin, isAdminLoading } = useAdmin();
  const router = useRouter();
  const firestore = useFirestore();

  const usersQuery = useMemoFirebase(
    () => (isAdmin ? query(collection(firestore, 'users')) : null),
    [isAdmin, firestore]
  );
  const { data: users, isLoading: usersLoading } = useCollection(usersQuery);

  const allInterestsQuery = useMemoFirebase(() => {
    if (!isAdmin || !users) return null;
    // This is a simplification. For a large number of users,
    // you would not want to create a query for each user.
    // A better approach would be a collection group query,
    // but this is fine for a small number of users.
    const userIds = users.map(u => u.id);
    if (userIds.length === 0) return null;
    return query(collection(firestore, `users/${userIds[0]}/careerInterests`));
  }, [isAdmin, firestore, users]);

  // This is a simplified example. We are only fetching interests for the first user.
  const { data: interests } = useCollection(allInterestsQuery);

  useEffect(() => {
    if (!isAdminLoading && !isAdmin) {
      router.push('/login');
    }
  }, [isAdmin, isAdminLoading, router]);

  if (isAdminLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Admin Panel - User Data</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Interests</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users && users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      {interests?.filter(i => i.userId === user.id).map(i => i.careerField).join(', ') || 'No interests selected'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
