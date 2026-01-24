
'use server';

import { getPersonalizedCareerSuggestions } from '@/ai/flows/personalized-career-suggestions';
import { getStudyRecommendations } from '@/ai/flows/study-recommendations';
import { generateChatResponse } from '@/ai/flows/chat';
import { generateAudio } from '@/ai/flows/tts';
import { generateAvatar } from '@/ai/flows/generate-avatar';
import { generateStory } from '@/ai/flows/story-generator';
import { z } from 'zod';

// Define schemas locally in the actions file
const SuggestionsSchema = z.object({
  interests: z.array(z.string()),
});

const StudyRecsSchema = z.object({
    pathway: z.string(),
    studyLogs: z.array(z.object({
        subject: z.string(),
        duration: z.number(),
        date: z.string(),
    })),
});

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatSchema = z.object({
  messages: z.array(ChatMessageSchema),
});

const TtsSchema = z.object({
  text: z.string(),
  voiceName: z.string().optional(),
});

const AvatarSchema = z.object({
    prompt: z.string(),
});

const StorySchema = z.object({
    prompt: z.string(),
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

export async function fetchStudyRecommendationsAction(data: z.infer<typeof StudyRecsSchema>) {
    try {
        const validatedData = StudyRecsSchema.parse(data);
        const result = await getStudyRecommendations(validatedData);
        return { success: true, recommendations: result.recommendations };
    } catch (error) {
        console.error('Error fetching study recommendations:', error);
        if (error instanceof z.ZodError) {
            return { success: false, error: 'Invalid input for study recommendations.' };
        }
        return { success: false, error: 'An unexpected error occurred while fetching study recommendations.' };
    }
}

export async function generateChatResponseAction(data: { messages: z.infer<typeof ChatMessageSchema>[] }) {
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

export async function generateAvatarAction(data: { prompt: string }) {
    try {
        const validatedData = AvatarSchema.parse(data);
        const result = await generateAvatar(validatedData);
        return { success: true, imageUrl: result.imageUrl };
    } catch (error) {
        console.error('Error generating avatar:', error);
        if (error instanceof z.ZodError) {
            return { success: false, error: 'Invalid prompt format for avatar generation.' };
        }
        return { success: false, error: 'An unexpected error occurred while generating the avatar.' };
    }
}

export async function generateStoryAction(data: { prompt: string }) {
    try {
        const validatedData = StorySchema.parse(data);
        const result = await generateStory(validatedData);
        return { success: true, story: result.story };
    } catch (error) {
        console.error('Error generating story:', error);
        if (error instanceof z.ZodError) {
            return { success: false, error: 'Invalid prompt for story generation.' };
        }
        return { success: false, error: 'An unexpected error occurred while generating the story.' };
    }
}
