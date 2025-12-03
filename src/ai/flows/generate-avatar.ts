'use server';

/**
 * @fileOverview A flow to generate a user avatar from a text prompt.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'genkit';

const AvatarInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the desired avatar.'),
});

const AvatarOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated avatar image.'),
});

export type AvatarInput = z.infer<typeof AvatarInputSchema>;
export type AvatarOutput = z.infer<typeof AvatarOutputSchema>;

export async function generateAvatar(input: AvatarInput): Promise<AvatarOutput> {
  return generateAvatarFlow(input);
}

const generateAvatarFlow = ai.defineFlow(
  {
    name: 'generateAvatarFlow',
    inputSchema: AvatarInputSchema,
    outputSchema: AvatarOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: googleAI.model('imagen-4.0-fast-generate-001'),
      prompt: `Generate a cute, cartoonish, circular avatar based on the following description. The background should be a simple, solid, vibrant color. Prompt: ${input.prompt}`,
      config: {
        responseMimeType: 'image/png',
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed.');
    }

    return {
      imageUrl: media.url,
    };
  }
);
