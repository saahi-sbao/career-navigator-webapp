'use server';

/**
 * @fileOverview Personalized career suggestions flow.
 *
 * This file defines a Genkit flow that takes a user ID, retrieves the user's saved career interests,
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
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, App } from 'firebase-admin/app';

// Define the input schema for the flow
const PersonalizedCareerSuggestionsInputSchema = z.object({
  userId: z.string().describe('The ID of the user.'),
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

let app: App;
if (!getApps().length) {
  app = initializeApp();
} else {
  app = getApps()[0];
}
const firestore = getFirestore(app);


// Exported function to call the flow
export async function getPersonalizedCareerSuggestions(
  input: PersonalizedCareerSuggestionsInput
): Promise<PersonalizedCareerSuggestionsOutput> {
  return personalizedCareerSuggestionsFlow(input);
}

// Define a tool to retrieve user's career interests
const getUserCareerInterests = ai.defineTool({
  name: 'getUserCareerInterests',
  description: "Retrieves a user's saved career interests from their profile.",
  inputSchema: z.object({
    userId: z.string().describe('The ID of the user.'),
  }),
  outputSchema: z.array(z.string()).describe('List of career interests.'),
},
async ({ userId }) => {
    const interestsSnapshot = await firestore.collection(`users/${userId}/careerInterests`).get();
    if (interestsSnapshot.empty) {
        return [];
    }
    return interestsSnapshot.docs.map(doc => doc.data().careerField);
});


// Define the prompt
const personalizedCareerSuggestionsPrompt = ai.definePrompt({
  name: 'personalizedCareerSuggestionsPrompt',
  input: {schema: PersonalizedCareerSuggestionsInputSchema},
  output: {schema: PersonalizedCareerSuggestionsOutputSchema},
  tools: [getUserCareerInterests],
  prompt: `You are a career counselor providing personalized career suggestions.

  Based on the user's career interests, suggest relevant career paths.

  User ID: {{{userId}}}
  
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
