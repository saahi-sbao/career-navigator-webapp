'use server';

/**
 * @fileOverview Personalized career suggestions flow.
 *
 * This file defines a Genkit flow that takes a user's career interests
 * and generates personalized career suggestions based on those interests.
 *
 * @exports {
 *   getPersonalizedCareerSuggestions,
 *   PersonalizedCareerSuggestionsInput,
 *   PersonalizedCareerSuggestionsOutput,
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the flow
const PersonalizedCareerSuggestionsInputSchema = z.object({
  interests: z
    .array(z.string())
    .describe("The user's saved career interests."),
});
export type PersonalizedCareerSuggestionsInput = z.infer<
  typeof PersonalizedCareerSuggestionsInputSchema
>;

// Define the output schema for the flow
const PersonalizedCareerSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of personalized career suggestions.'),
});
export type PersonalizedCareerSuggestionsOutput = z.infer<
  typeof PersonalizedCareerSuggestionsOutputSchema
>;

// Exported function to call the flow
export async function getPersonalizedCareerSuggestions(
  input: PersonalizedCareerSuggestionsInput
): Promise<PersonalizedCareerSuggestionsOutput> {
  return personalizedCareerSuggestionsFlow(input);
}

// Define the prompt
const personalizedCareerSuggestionsPrompt = ai.definePrompt({
  name: 'personalizedCareerSuggestionsPrompt',
  input: {schema: PersonalizedCareerSuggestionsInputSchema},
  output: {schema: PersonalizedCareerSuggestionsOutputSchema},
  prompt: `You are a career counselor providing personalized career suggestions.

  Based on the user's career interests, suggest relevant career paths.

  User's Interests: {{{interests}}}
  
  Please provide suggestions for a user with these interests.
  `,
});

// Define the flow
const personalizedCareerSuggestionsFlow = ai.defineFlow(
  {
    name: 'personalizedCareerSuggestionsFlow',
    inputSchema: PersonalizedCareerSuggestionsInputSchema,
    outputSchema: PersonalizedCareerSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await personalizedCareerSuggestionsPrompt(input);
    return output!;
  }
);
