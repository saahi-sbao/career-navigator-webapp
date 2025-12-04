
'use client';

import { useAdmin } from '@/hooks/use-admin';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Header from '@/components/header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase } from 'lucide-react';

export default function AdminPage() {
  const { isAdmin, isAdminLoading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isAdminLoading && !isAdmin) {
      router.push('/login');
    }
  }, [isAdmin, isAdminLoading, router]);

  if (isAdminLoading) {
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
        <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Admin Panel</h1>
            <p className="mt-4 text-xl text-muted-foreground">
                Manage application data and view analytics.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/admin/dashboard" passHref>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Assessment Dashboard</CardTitle>
                        <Users className="h-6 w-6 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <CardDescription>View analytics on student assessments, including dominant intelligences and pathway recommendations.</CardDescription>
                    </CardContent>
                </Card>
            </Link>
            <Link href="/admin/mentors" passHref>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Manage Mentors</CardTitle>
                        <Briefcase className="h-6 w-6 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Add, edit, or remove mentor profiles that are displayed to students and teachers.</CardDescription>
                    </CardContent>
                </Card>
            </Link>
        </div>
      </main>
    </div>
  );
}
