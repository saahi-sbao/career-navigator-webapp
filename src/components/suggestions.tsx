'use client';

import { useEffect, useState, useTransition } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchSuggestionsAction } from '@/app/actions';
import { Lightbulb } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { collection, onSnapshot } from 'firebase/firestore';

export default function Suggestions() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const interestsCol = useMemoFirebase(
    () => (user ? collection(firestore, `users/${user.uid}/careerInterests`) : null),
    [user, firestore]
  );

  useEffect(() => {
    if (!interestsCol) {
      setInterests([]);
      return;
    }
    const unsubscribe = onSnapshot(interestsCol, (snapshot) => {
      const newInterests = snapshot.docs.map(doc => doc.data().careerField);
      setInterests(newInterests);
    });
    return () => unsubscribe();
  }, [interestsCol]);

  useEffect(() => {
    if (user && interests.length > 0) {
      startTransition(async () => {
        const result = await fetchSuggestionsAction({ interests: interests });
        if (result.success) {
          setSuggestions(result.suggestions ?? []);
        } else {
          toast({
            variant: "destructive",
            title: "Suggestion Error",
            description: result.error,
          });
        }
      });
    } else {
        setSuggestions([]);
    }
  }, [interests, user?.uid, toast, user]);

  if (!user || interests.length === 0) {
    return null;
  }

  return (
    <Card className="mt-8 animate-in fade-in-50 duration-500">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-yellow-400/20 p-2">
            <Lightbulb className="h-6 w-6 text-yellow-500" />
          </div>
          <CardTitle>Personalized Career Suggestions</CardTitle>
        </div>
        <CardDescription>Based on your interest in: {interests.join(', ')}</CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-[80%]" />
            <Skeleton className="h-5 w-[70%]" />
            <Skeleton className="h-5 w-[75%]" />
          </div>
        ) : suggestions.length > 0 ? (
          <ul className="space-y-2 list-disc list-inside text-foreground/80">
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No suggestions available at the moment.</p>
        )}
      </CardContent>
    </Card>
  );
}
