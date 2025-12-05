'use client';

import { useAdmin } from '@/hooks/use-admin';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Loader2, Users, GraduationCap, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, doc, addDoc, deleteDoc, setDoc } from 'firebase/firestore';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// --- Zod Schema for Mentor Form ---
const mentorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().optional(),
  county: z.string().min(3, 'County must be at least 3 characters.'),
});

type MentorFormValues = z.infer<typeof mentorSchema>;
interface Mentor extends MentorFormValues {
    id: string;
}

// Helper to format intelligence names
const formatIntelligenceName = (name: string) => {
  if (!name) return 'N/A';
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

export default function AdminDashboardPage() {
  const { isAdmin, isAdminLoading } = useAdmin();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data fetching for users
  const usersQuery = useMemoFirebase(
    () => (isAdmin && firestore ? query(collection(firestore, 'users')) : null),
    [isAdmin, firestore]
  );
  const { data: users, isLoading: usersLoading } = useCollection(usersQuery);

  // Data fetching for mentors
  const mentorsQuery = useMemoFirebase(
    () => (isAdmin && firestore ? query(collection(firestore, 'mentors')) : null),
    [isAdmin, firestore]
  );
  const { data: mentors, isLoading: mentorsLoading } = useCollection<Mentor>(mentorsQuery);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MentorFormValues>({
    resolver: zodResolver(mentorSchema),
  });

  useEffect(() => {
    if (!isAdminLoading && !isAdmin) {
      router.push('/login');
    }
  }, [isAdmin, isAdminLoading, router]);

  // Mentor management functions
  const openDialog = (mentor: Mentor | null = null) => {
    setEditingMentor(mentor);
    reset(mentor || { name: '', email: '', phone: '', county: '' });
    setIsDialogOpen(true);
  };

  const onMentorSubmit: SubmitHandler<MentorFormValues> = async (data) => {
    if (!firestore || !isAdmin) return;
    setIsSubmitting(true);
    
    try {
      if (editingMentor) {
        const mentorRef = doc(firestore, 'mentors', editingMentor.id);
        await setDoc(mentorRef, data, { merge: true });
        toast({
            title: 'Mentor Updated',
            description: `${data.name} has been successfully updated.`,
        });
      } else {
        const mentorCollection = collection(firestore, 'mentors');
        const newDocRef = doc(mentorCollection);
        await setDoc(newDocRef, { ...data, id: newDocRef.id });
        toast({
            title: 'Mentor Added',
            description: `${data.name} has been successfully added.`,
        });
      }
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'An error occurred',
            description: error.message,
        });
    } finally {
        setIsDialogOpen(false);
        setIsSubmitting(false);
    }
  };

  const handleDelete = async (mentor: Mentor) => {
    if (!firestore || !isAdmin) return;
    if (!confirm(`Are you sure you want to delete ${mentor.name}? This action cannot be undone.`)) {
      return;
    }
    try {
        const mentorRef = doc(firestore, 'mentors', mentor.id);
        await deleteDoc(mentorRef);
        toast({
            title: 'Mentor Deleted',
            description: `${mentor.name} has been removed.`,
        });
    } catch (error: any) {
         toast({
            variant: 'destructive',
            title: 'An error occurred',
            description: error.message,
        });
    }
  };

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

  if (isAdminLoading || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }
  
  const totalAssessments = assessmentData.length;
  const totalUsers = users?.length || 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dominant Intelligence Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
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
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Assessment Results</CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
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
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Mentors</CardTitle>
              <CardDescription>Add, edit, or remove mentor profiles.</CardDescription>
            </div>
            <Button onClick={() => openDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Mentor
            </Button>
          </CardHeader>
          <CardContent>
            {mentorsLoading ? <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>County</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mentors?.map((mentor) => (
                    <TableRow key={mentor.id}>
                      <TableCell className="font-medium">{mentor.name}</TableCell>
                      <TableCell>{mentor.email}</TableCell>
                      <TableCell>{mentor.phone || 'N/A'}</TableCell>
                      <TableCell>{mentor.county}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openDialog(mentor)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(mentor)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMentor ? 'Edit Mentor' : 'Add New Mentor'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onMentorSubmit)} className="space-y-4">
             <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
             <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
             <div className="space-y-1">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input id="phone" type="tel" {...register('phone')} />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
             <div className="space-y-1">
                <Label htmlFor="county">County of Residence</Label>
                <Input id="county" {...register('county')} />
                {errors.county && <p className="text-xs text-destructive">{errors.county.message}</p>}
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingMentor ? 'Save Changes' : 'Save Mentor'}
                </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
