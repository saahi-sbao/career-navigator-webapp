'use client';

import { useState, useTransition } from 'react';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, Wand2 } from 'lucide-react';
import { getSubjectCombinationSuggestionsAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

const SUBJECTS = [
  'Mathematics', 'English', 'Kiswahili', 'Physics', 'Chemistry', 'Biology',
  'History', 'Geography', 'CRE', 'Business Studies', 'Agriculture', 'Computer Studies',
  'Art & Design', 'Music', 'Home Science', 'Physical Education'
];

interface Suggestions {
    recommendedCareers: string[];
    furtherStudies: string[];
    reasoning: string;
}

export default function SubjectCombinationPage() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  };

  const handleGetSuggestions = () => {
    if (selectedSubjects.length < 3) {
      toast({
        variant: 'destructive',
        title: 'Select More Subjects',
        description: 'Please select at least 3 subjects to get relevant suggestions.',
      });
      return;
    }

    startTransition(async () => {
      setSuggestions(null);
      const result = await getSubjectCombinationSuggestionsAction({ subjects: selectedSubjects });
      if (result.success && result.suggestions) {
        setSuggestions(result.suggestions);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to get suggestions. Please try again.',
        });
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-primary">Subject Combination Explorer</CardTitle>
            <CardDescription className="text-lg">
              Select the subjects you excel at and enjoy, and our AI will suggest potential career paths for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-center">Choose Your Subjects</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {SUBJECTS.map(subject => (
                  <div
                    key={subject}
                    className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedSubjects.includes(subject)
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => handleSubjectToggle(subject)}
                  >
                    <Checkbox
                      id={subject}
                      checked={selectedSubjects.includes(subject)}
                      onCheckedChange={() => handleSubjectToggle(subject)}
                    />
                    <Label htmlFor={subject} className="cursor-pointer flex-1">{subject}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mb-8">
              <Button size="lg" onClick={handleGetSuggestions} disabled={isPending}>
                {isPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-5 w-5" />
                )}
                Get Career Suggestions
              </Button>
            </div>

            {isPending && (
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground mt-2">Our AI is thinking...</p>
                </div>
            )}

            {suggestions && (
              <div className="animate-in fade-in-50 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>AI-Powered Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{suggestions.reasoning}</p>
                    </CardContent>
                </Card>
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recommended Careers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside space-y-2">
                                {suggestions.recommendedCareers.map(career => <li key={career}>{career}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Areas for Further Studies</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ul className="list-disc list-inside space-y-2">
                                {suggestions.furtherStudies.map(study => <li key={study}>{study}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
