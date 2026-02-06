'use client';

import { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { getPersonalizedCareerSuggestions } from '@/ai/flows/personalized-career-suggestions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Suggestions() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const interestsCol = useMemoFirebase(
    () => (user ? collection(firestore, `users/${user.uid}/careerInterests`) : null),
    [user, firestore]
  );
  const { data: interests, isLoading: interestsLoading } = useCollection(interestsCol);

  const handleGetSuggestions = async () => {
    if (!interests || interests.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Interests Selected',
        description: 'Please select some career interests first.',
      });
      return;
    }

    setIsLoading(true);
    setSuggestions([]);
    try {
      const interestNames = interests.map(i => i.id as string);
      const result = await getPersonalizedCareerSuggestions({ interests: interestNames });
      setSuggestions(result.suggestions);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to get suggestions',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (interestsLoading || !user) {
    return null; 
  }

  if (interests && interests.length > 0) {
    return (
      <Card className="mt-8 bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Personalized Suggestions</CardTitle>
          <CardDescription>
            Get AI-powered career suggestions based on your selected interests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGetSuggestions} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Wand2 className="mr-2" />}
            Generate Suggestions
          </Button>

          {suggestions.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Here are some careers you might like:</h4>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}
