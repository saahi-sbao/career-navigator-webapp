
'use client';

import { useState, useTransition, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, formatDistanceToNow } from 'date-fns';

import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc, Timestamp, serverTimestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, PlusCircle, Lightbulb, BookCopy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchStudyRecommendationsAction } from '@/app/actions';
import { Skeleton } from './ui/skeleton';

interface TimeTableProps {
  user: User;
  pathway: { name: string; subjects: string[] };
}

const studyLogSchema = z.object({
  subject: z.string().min(1, 'Subject is required.'),
  duration: z.coerce.number().min(5, 'Duration must be at least 5 minutes.'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
});

type StudyLogFormValues = z.infer<typeof studyLogSchema>;

interface StudyLogData extends StudyLogFormValues {
    id: string;
    userId: string;
    date: any; // Firestore timestamp
}

export default function TimeTable({ user, pathway }: TimeTableProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isFetchingRecs, startRecsTransition] = useTransition();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<StudyLogFormValues>({
    resolver: zodResolver(studyLogSchema),
    defaultValues: {
        date: new Date().toISOString().split('T')[0] // today
    }
  });

  const studyLogsQuery = useMemoFirebase(
    () => user ? query(collection(firestore, `users/${user.uid}/studyLogs`), orderBy('date', 'desc')) : null,
    [user, firestore]
  );
  const { data: studyLogs, isLoading: logsLoading } = useCollection<StudyLogData>(studyLogsQuery);

  const onSubmit: SubmitHandler<StudyLogFormValues> = async (data) => {
    if (!user || !firestore) return;
    setIsSubmitting(true);

    try {
        const studyLogCollection = collection(firestore, `users/${user.uid}/studyLogs`);
        const newLogRef = doc(studyLogCollection);
        
        const newLogData = {
            ...data,
            id: newLogRef.id,
            userId: user.uid,
            date: Timestamp.fromDate(new Date(data.date)),
        };

        await addDocumentNonBlocking(studyLogCollection, newLogData);

        toast({ title: 'Study Session Logged!', description: `Added ${data.duration} minutes for ${data.subject}.` });
        reset({ subject: '', duration: undefined, date: new Date().toISOString().split('T')[0] });
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (studyLogs) {
        startRecsTransition(async () => {
            const preparedLogs = studyLogs.map(log => ({
                subject: log.subject,
                duration: log.duration,
                date: (log.date as Timestamp).toDate().toISOString(),
            }));
            const result = await fetchStudyRecommendationsAction({ pathway: pathway.name, studyLogs: preparedLogs });
            if (result.success && result.recommendations) {
                setRecommendations(result.recommendations);
            }
        });
    }
  }, [studyLogs, pathway.name]);


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookCopy /> Study Time Table</CardTitle>
                <CardDescription>Log your study sessions to track your progress.</CardDescription>
            </CardHeader>
            <CardContent>
                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1 sm:col-span-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" {...register('subject')} list="pathway-subjects" />
                            <datalist id="pathway-subjects">
                                {pathway.subjects.map(s => <option key={s} value={s} />)}
                            </datalist>
                            {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="duration">Duration (min)</Label>
                            <Input id="duration" type="number" {...register('duration')} />
                            {errors.duration && <p className="text-xs text-destructive">{errors.duration.message}</p>}
                        </div>
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" {...register('date')} />
                        {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
                    </div>

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                        Log Session
                    </Button>
                </form>
                
                <h3 className="font-semibold mb-2">Recent Sessions</h3>
                 {logsLoading ? <p>Loading logs...</p> : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Subject</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {studyLogs?.slice(0, 5).map(log => (
                                <TableRow key={log.id}>
                                    <TableCell className="font-medium">{log.subject}</TableCell>
                                    <TableCell>{log.duration} min</TableCell>
                                    <TableCell>{formatDistanceToNow((log.date as Timestamp).toDate(), { addSuffix: true })}</TableCell>
                                </TableRow>
                            ))}
                             {studyLogs?.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">No study sessions logged yet.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                 )}
            </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary"><Lightbulb /> AI Study Recommendations</CardTitle>
                <CardDescription>Personalized advice based on your study habits and pathway.</CardDescription>
            </CardHeader>
            <CardContent>
                {isFetchingRecs ? (
                     <div className="space-y-3">
                        <Skeleton className="h-5 w-[80%]" />
                        <Skeleton className="h-5 w-[70%]" />
                        <Skeleton className="h-5 w-[75%]" />
                    </div>
                ) : (
                    <ul className="space-y-3 list-disc list-inside text-foreground/90">
                       {recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                       {recommendations.length === 0 && <p className="text-muted-foreground">Log a few study sessions to get your first recommendations!</p>}
                    </ul>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
