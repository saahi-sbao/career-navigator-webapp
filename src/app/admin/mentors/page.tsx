
'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/hooks/use-admin';
import { useRouter } from 'next/navigation';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, doc, deleteDoc } from 'firebase/firestore';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

// --- Zod Schema for Mentor Form ---
const mentorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  contract: z.string().email('Invalid email address.'),
  county: z.string().min(3, 'County must be at least 3 characters.'),
});

type MentorFormValues = z.infer<typeof mentorSchema>;
interface Mentor extends MentorFormValues {
    id: string;
}

export default function ManageMentorsPage() {
  const { isAdmin, isAdminLoading } = useAdmin();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mentorsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'mentors')) : null),
    [firestore]
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

  const openDialog = (mentor: Mentor | null = null) => {
    setEditingMentor(mentor);
    reset(mentor || { name: '', contract: '', county: '' });
    setIsDialogOpen(true);
  };

  const onSubmit: SubmitHandler<MentorFormValues> = async (data) => {
    if (!firestore) return;
    setIsSubmitting(true);

    try {
        const mentorId = editingMentor?.id || doc(collection(firestore, 'mentors')).id;

        const mentorData = {
            ...data,
            id: mentorId,
        };
        
        const mentorRef = doc(firestore, 'mentors', mentorId);
        setDocumentNonBlocking(mentorRef, mentorData, { merge: true });

        toast({
            title: editingMentor ? 'Mentor Updated' : 'Mentor Added',
            description: `${data.name} has been successfully saved.`,
        });
        setIsDialogOpen(false);

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'An error occurred',
            description: error.message || 'Could not save mentor details.',
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async (mentor: Mentor) => {
    if (!firestore) return;
    if (!confirm(`Are you sure you want to delete ${mentor.name}? This action cannot be undone.`)) {
      return;
    }
    
    try {
        const mentorRef = doc(firestore, 'mentors', mentor.id);
        deleteDocumentNonBlocking(mentorRef);
        
        toast({
            title: 'Mentor Deleted',
            description: `${mentor.name} has been removed.`,
        });
    } catch(error: any) {
         toast({
            variant: 'destructive',
            title: 'Deletion Failed',
            description: error.message || 'Could not delete mentor.',
        });
    }
  };
  
  if (isAdminLoading || !isAdmin) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-16 w-16 animate-spin" /></div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
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
            {mentorsLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contract (Email)</TableHead>
                  <TableHead>County</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mentors?.map((mentor) => (
                  <TableRow key={mentor.id}>
                    <TableCell className="font-medium">{mentor.name}</TableCell>
                    <TableCell>{mentor.contract}</TableCell>
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
             <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
             <div className="space-y-1">
                <Label htmlFor="contract">Contract (Email)</Label>
                <Input id="contract" type="email" {...register('contract')} />
                {errors.contract && <p className="text-xs text-destructive">{errors.contract.message}</p>}
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
