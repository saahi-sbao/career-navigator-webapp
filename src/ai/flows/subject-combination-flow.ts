'use server';
/**
 * @fileOverview An AI flow to suggest career paths based on subject combinations.
 *
 * - getSubjectCombinationSuggestions - A function that handles the suggestion process.
 * - SubjectCombinationInput - The input type for the flow.
 * - SubjectCombinationOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SubjectCombinationInputSchema = z.object({
  subjects: z
    .array(z.string())
    .min(3)
    .describe('A list of subjects the student excels in.'),
});
export type SubjectCombinationInput = z.infer<typeof SubjectCombinationInputSchema>;

const SubjectCombinationOutputSchema = z.object({
  reasoning: z.string().describe("A brief explanation of why the suggestions are a good fit for the subject combination."),
  recommendedCareers: z
    .array(z.string())
    .describe('A list of 5-7 specific career titles.'),
  furtherStudies: z
    .array(z.string())
    .describe('A list of 3-5 relevant fields or degree programs for higher education.'),
});
export type SubjectCombinationOutput = z.infer<typeof SubjectCombinationOutputSchema>;

export async function getSubjectCombinationSuggestions(
  input: SubjectCombinationInput
): Promise<SubjectCombinationOutput> {
  return subjectCombinationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'subjectCombinationPrompt',
  input: { schema: SubjectCombinationInputSchema },
  output: { schema: SubjectCombinationOutputSchema },
  prompt: `You are an expert career counselor for Kenyan high school students. Based on the following combination of subjects a student excels in, provide career and study recommendations relevant to the Kenyan context.

Student's Strong Subjects:
{{#each subjects}}
- {{{this}}}
{{/each}}

Please provide a brief reasoning, a list of recommended careers, and suggestions for further studies.
`,
});

const subjectCombinationFlow = ai.defineFlow(
  {
    name: 'subjectCombinationFlow',
    inputSchema: SubjectCombinationInputSchema,
    outputSchema: SubjectCombinationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        throw new Error("Failed to get suggestions from the AI model.");
    }
    return output;
  }
);
