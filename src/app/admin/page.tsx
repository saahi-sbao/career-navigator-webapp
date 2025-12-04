
'use client';

import { useAdmin } from '@/hooks/use-admin';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Loader2, Users, Briefcase, GraduationCap } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

// Helper to format intelligence names
const formatIntelligenceName = (name: string) => {
  if (!name) return 'N/A';
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

export default function AdminDashboardPage() {
  const { isAdmin, isAdminLoading } = useAdmin();
  const router = useRouter();
  const firestore = useFirestore();

  const usersQuery = useMemoFirebase(
    () => (isAdmin ? query(collection(firestore, 'users')) : null),
    [isAdmin, firestore]
  );
  const { data: users, isLoading: usersLoading } = useCollection(usersQuery);

  useEffect(() => {
    if (!isAdminLoading && !isAdmin) {
      router.push('/login');
    }
  }, [isAdmin, isAdminLoading, router]);

  const assessmentData = useMemo(() => {
    if (!users) return [];
    return users
      .filter(user => user.assessment)
      .map(user => ({
        id: user.id,
        name: user.assessment.info.name,
        pathway: user.assessment.recommendation.pathway.name,
        confidence: user.assessment.recommendation.confidence,
        dominantIntelligence: user.assessment.dominantIntelligence,
      }));
  }, [users]);
  
  const intelligenceCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    assessmentData.forEach(data => {
      const intelligence = data.dominantIntelligence;
      if (intelligence) {
        counts[intelligence] = (counts[intelligence] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: formatIntelligenceName(name),
      students: value,
    }));
  }, [assessmentData]);

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
  
  const totalAssessments = assessmentData.length;
  const totalUsers = users?.length || 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Assessments Completed</CardTitle>
                    <GraduationCap className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold">{totalAssessments}</div>
                    <p className="text-xs text-muted-foreground">Total students who have completed the assessment.</p>
                </CardContent>
            </Card>
            <Link href="/admin/students" passHref>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Manage Students</CardTitle>
                        <Users className="h-6 w-6 text-primary" />
                    </CardHeader>
                    <CardContent>
                         <div className="text-4xl font-bold">{totalUsers}</div>
                        <CardDescription>View and manage all registered user accounts.</CardDescription>
                    </CardContent>
                </Card>
            </Link>
            <Link href="/admin/mentors" passHref>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Manage Mentors</CardTitle>
                        <Briefcase className="h-6 w-6 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Add, edit, or remove mentor profiles available to users.</CardDescription>
                    </CardContent>
                </Card>
            </Link>
        </div>


        <Card>
          <CardHeader>
            <CardTitle>Dominant Intelligence Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={intelligenceCounts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="students" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Assessment Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Recommended Pathway</TableHead>
                  <TableHead>Dominant Intelligence</TableHead>
                  <TableHead className="text-right">Confidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessmentData.map(data => (
                  <TableRow key={data.id}>
                    <TableCell>{data.name}</TableCell>
                    <TableCell>{data.pathway}</TableCell>
                    <TableCell>{formatIntelligenceName(data.dominantIntelligence)}</TableCell>
                    <TableCell className="text-right">{data.confidence}%</TableCell>
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
