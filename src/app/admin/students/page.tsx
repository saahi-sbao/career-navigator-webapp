
'use client';

import { useAdmin } from '@/hooks/use-admin';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, User } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface AppUser {
    id: string;
    username: string;
    email?: string;
    role: 'Student' | 'Teacher' | 'Admin';
    photoURL?: string;
}

export default function ManageStudentsPage() {
  const { isAdmin, isAdminLoading } = useAdmin();
  const router = useRouter();
  const firestore = useFirestore();

  const usersQuery = useMemoFirebase(
    () => (isAdmin ? query(collection(firestore, 'users')) : null),
    [isAdmin, firestore]
  );
  const { data: users, isLoading: usersLoading } = useCollection<AppUser>(usersQuery);

  useEffect(() => {
    if (!isAdminLoading && !isAdmin) {
      router.push('/login');
    }
  }, [isAdmin, isAdminLoading, router]);

  if (isAdminLoading || !isAdmin) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-16 w-16 animate-spin" /></div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Manage Students & Users</CardTitle>
            <CardDescription>View all registered users in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">User ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={user.photoURL} alt={user.username} />
                                <AvatarFallback>{user.username?.charAt(0).toUpperCase() || <User />}</AvatarFallback>
                            </Avatar>
                            <span>{user.username}</span>
                        </div>
                    </TableCell>
                    <TableCell>{user.email || 'N/A'}</TableCell>
                    <TableCell>
                        <Badge variant={user.role === 'Admin' ? 'destructive' : 'secondary'}>{user.role}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">{user.id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
