'use server';

import { getPersonalizedCareerSuggestions } from '@/ai/flows/personalized-career-suggestions';
import { z } from 'zod';

const SuggestionsSchema = z.object({
  interests: z.array(z.string()),
});

export async function fetchSuggestionsAction(data: { interests: string[] }) {
  try {
    const validatedData = SuggestionsSchema.parse(data);
    const result = await getPersonalizedCareerSuggestions({ interests: validatedData.interests });
    return { success: true, suggestions: result.suggestions };
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid input provided for suggestions.' };
    }
    return { success: false, error: 'An unexpected error occurred while fetching suggestions.' };
  }
}
