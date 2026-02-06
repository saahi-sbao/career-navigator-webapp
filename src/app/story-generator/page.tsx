'use client';

import { useState } from 'react';
import Header from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateStory, type StoryInput } from '@/ai/flows/story-generator';

export default function StoryGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateStory = async () => {
    if (!prompt) {
      toast({
        variant: 'destructive',
        title: 'Prompt is empty',
        description: 'Please enter a prompt for the story.',
      });
      return;
    }

    setIsLoading(true);
    setStory('');

    try {
      const input: StoryInput = { prompt };
      const result = await generateStory(input);
      setStory(result.story);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Story generation failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 flex justify-center">
        <Card className="w-full max-w-3xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-primary">AI Story Generator</CardTitle>
            <CardDescription className="text-lg">
              Bring your ideas to life! Enter a prompt and let our AI write a story for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="story-prompt" className="text-lg font-semibold">Your Story Idea</Label>
              <Textarea
                id="story-prompt"
                placeholder="e.g., A brave knight who is afraid of spiders..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="mt-2 min-h-[100px] text-base"
                disabled={isLoading}
              />
            </div>
            <div className="text-center">
              <Button size="lg" onClick={handleGenerateStory} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-5 w-5" />
                )}
                Generate Story
              </Button>
            </div>

            {isLoading && (
              <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {story && (
              <Card className="mt-8 bg-secondary/50 p-6 animate-in fade-in-50">
                <CardTitle className="mb-4">Your Generated Story</CardTitle>
                <div className="prose dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                  {story}
                </div>
              </Card>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
