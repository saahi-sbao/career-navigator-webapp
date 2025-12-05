
'use server';

/**
 * @fileOverview AI flow to generate personalized study recommendations.
 *
 * This flow analyzes a student's career pathway and recent study logs
 * to provide actionable advice on which subjects to prioritize.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const StudyLogSchema = z.object({
  subject: z.string(),
  duration: z.number().describe('Duration in minutes'),
  date: z.string().describe('ISO 8601 date string'),
});

const StudyRecommendationsInputSchema = z.object({
  pathway: z.string().describe('The student\'s recommended career pathway (e.g., STEM, Social Sciences).'),
  studyLogs: z.array(StudyLogSchema).describe('A list of recent study sessions.'),
});
type StudyRecommendationsInput = z.infer<typeof StudyRecommendationsInputSchema>;

const StudyRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('A list of 2-3 concise, actionable study recommendations.'),
});
type StudyRecommendationsOutput = z.infer<typeof StudyRecommendationsOutputSchema>;

export async function getStudyRecommendations(
  input: StudyRecommendationsInput
): Promise<StudyRecommendationsOutput> {
  return studyRecommendationsFlow(input);
}

const studyRecommendationsPrompt = ai.definePrompt({
  name: 'studyRecommendationsPrompt',
  input: { schema: StudyRecommendationsInputSchema },
  output: { schema: StudyRecommendationsOutputSchema },
  prompt: `You are an academic advisor for a Kenyan student. Your goal is to provide personalized study recommendations.

Analyze the student's recommended career pathway and their recent study logs.

- Student's Pathway: {{{pathway}}}
- Recent Study Logs:
{{#each studyLogs}}
  - Studied {{subject}} for {{duration}} minutes on {{date}}.
{{/each}}
{{#if (eq studyLogs.length 0)}}
  - No study sessions logged yet.
{{/if}}

Based on this information, provide 2-3 concise, actionable recommendations. Focus on subjects that are crucial for their pathway but may be getting less attention. If no logs exist, provide general advice for their pathway. Frame your recommendations in an encouraging and supportive tone.
`,
});

const studyRecommendationsFlow = ai.defineFlow(
  {
    name: 'studyRecommendationsFlow',
    inputSchema: StudyRecommendationsInputSchema,
    outputSchema: StudyRecommendationsOutputSchema,
  },
  async (input) => {
    const { output } = await studyRecommendationsPrompt(input);
    return output!;
  }
);
