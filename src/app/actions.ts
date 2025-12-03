
'use server';

import { getPersonalizedCareerSuggestions } from '@/ai/flows/personalized-career-suggestions';
import { generateChatResponse } from '@/ai/flows/chat';
import { generateAudio } from '@/ai/flows/tts';
import { z } from 'zod';
import type { ChatMessage } from '@/components/chatbot';

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

const ChatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })),
});

export async function generateChatResponseAction(data: { messages: ChatMessage[] }) {
  try {
    const validatedData = ChatSchema.parse(data);
    const result = await generateChatResponse({ messages: validatedData.messages });
    return { success: true, response: result.response };
  } catch (error) {
    console.error('Error in chat response action:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid chat message format.' };
    }
    return { success: false, error: 'An unexpected error occurred while generating chat response.' };
  }
}

const TtsSchema = z.object({
  text: z.string(),
  voiceName: z.string().optional(),
});

export async function generateAudioAction(data: { text: string, voiceName?: string }) {
  try {
    const validatedData = TtsSchema.parse(data);
    const result = await generateAudio({ text: validatedData.text, voiceName: validatedData.voiceName });
    return { success: true, audio: result.audio };
  } catch (error) {
    console.error('Error in audio generation action:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid text format for audio generation.' };
    }
    return { success: false, error: 'An unexpected error occurred while generating audio.' };
  }
}
