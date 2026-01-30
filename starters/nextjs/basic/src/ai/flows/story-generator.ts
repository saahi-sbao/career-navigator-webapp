
'use server';

/**
 * @fileOverview A simple story generation flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const StoryInputSchema = z.object({
  prompt: z.string().describe('The prompt for the story.'),
});
export type StoryInput = z.infer<typeof StoryInputSchema>;

const StoryOutputSchema = z.object({
  story: z.string().describe('The generated story.'),
});
export type StoryOutput = z.infer<typeof StoryOutputSchema>;

export async function generateStory(input: StoryInput): Promise<StoryOutput> {
  return storyGeneratorFlow(input);
}

const storyPrompt = ai.definePrompt({
  name: 'storyPrompt',
  input: { schema: StoryInputSchema },
  output: { schema: StoryOutputSchema },
  prompt: `You are a creative and imaginative storyteller. Write a fun and engaging story based on the following prompt:

Prompt: {{{prompt}}}

Please ensure the story is suitable for all ages.`,
});

const storyGeneratorFlow = ai.defineFlow(
  {
    name: 'storyGeneratorFlow',
    inputSchema: StoryInputSchema,
    outputSchema: StoryOutputSchema,
  },
  async (input) => {
    const { output } = await storyPrompt(input);
    
    // The prompt asks for a story in the 'story' field of the output schema.
    // If the model output is null, we'll have a fallback.
    return {
      story: output?.story || "I'm sorry, I couldn't come up with a story for that prompt.",
    };
  }
);
