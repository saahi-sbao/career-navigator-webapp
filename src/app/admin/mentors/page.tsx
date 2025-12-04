
'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/hooks/use-admin';
import { useRouter } from 'next/navigation';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, PlusCircle, Edit, Trash2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

// --- Zod Schema for Mentor Form ---
const mentorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  expertise: z.string().min(3, 'Expertise must be at least 3 characters.'),
  photoUrl: z.string().url('Invalid URL.').optional().nullable(),
});

type MentorFormValues = z.infer<typeof mentorSchema>;
interface Mentor extends MentorFormValues {
    id: string;
}

export default function ManageMentorsPage() {
  const { isAdmin, isAdminLoading } = useAdmin();
  const router = useRouter();
  const firestore = useFirestore();
  const storage = getStorage();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const mentorsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'mentors')) : null),
    [firestore]
  );
  const { data: mentors, isLoading: mentorsLoading } = useCollection<Mentor>(mentorsQuery);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<MentorFormValues>({
    resolver: zodResolver(mentorSchema),
  });

  useEffect(() => {
    if (!isAdminLoading && !isAdmin) {
      router.push('/login');
    }
  }, [isAdmin, isAdminLoading, router]);

  const openDialog = (mentor: Mentor | null = null) => {
    setEditingMentor(mentor);
    setPhotoPreview(mentor?.photoUrl || null);
    setPhotoFile(null);
    reset(mentor || { name: '', email: '', expertise: '', photoUrl: '' });
    setIsDialogOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<MentorFormValues> = async (data) => {
    if (!firestore) return;
    setIsSubmitting(true);

    try {
        let photoUrl = editingMentor?.photoUrl || null;
        const mentorId = editingMentor?.id || doc(collection(firestore, 'mentors')).id;

        // Upload photo if a new one is selected
        if (photoFile && photoPreview) {
            const photoRef = ref(storage, `mentors/${mentorId}/profile.jpg`);
            await uploadString(photoRef, photoPreview, 'data_url');
            photoUrl = await getDownloadURL(photoRef);
        }

        const mentorData = {
            ...data,
            id: mentorId,
            photoUrl: photoUrl,
        };
        
        const mentorRef = doc(firestore, 'mentors', mentorId);
        // Using a non-blocking write for better UI responsiveness
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

        // Delete photo from storage if it exists
        if (mentor.photoUrl) {
            const photoRef = ref(storage, `mentors/${mentor.id}/profile.jpg`);
            // Use a try-catch for the deleteObject call to prevent crashes if the file is already gone.
            try {
              await deleteObject(photoRef);
            } catch (storageError: any) {
              if (storageError.code !== 'storage/object-not-found') {
                console.warn("Could not delete mentor photo, it may have already been removed:", storageError.message);
              }
            }
        }
        
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
                  <TableHead>Mentor</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Expertise</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mentors?.map((mentor) => (
                  <TableRow key={mentor.id}>
                    <TableCell className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={mentor.photoUrl} />
                            <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{mentor.name}</span>
                    </TableCell>
                    <TableCell>{mentor.email}</TableCell>
                    <TableCell>{mentor.expertise}</TableCell>
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
              <div className="space-y-2 text-center">
                <Avatar className="h-24 w-24 mx-auto ring-2 ring-primary/50 ring-offset-2">
                    <AvatarImage src={photoPreview || undefined} />
                    <AvatarFallback><User className="h-10 w-10" /></AvatarFallback>
                </Avatar>
                <Input id="photo" type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
              </div>
             <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
             <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
             <div className="space-y-1">
                <Label htmlFor="expertise">Area of Expertise</Label>
                <Input id="expertise" {...register('expertise')} />
                {errors.expertise && <p className="text-xs text-destructive">{errors.expertise.message}</p>}
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
