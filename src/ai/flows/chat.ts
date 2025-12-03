'use server';

/**
 * @fileOverview A simple chat flow for a career guidance assistant.
 *
 * This file defines a Genkit flow that takes a history of chat messages
 * and generates a response from the AI.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatInputSchema = z.object({
  messages: z.array(ChatMessageSchema),
});

const ChatOutputSchema = z.object({
  response: z.string(),
});

export type ChatInput = z.infer<typeof ChatInputSchema>;
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function generateChatResponse(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
  {
    name: 'careerAssistantChatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { messages } = input;
    
    // Construct the prompt with history
    const prompt = [
        {text: `You are a friendly and helpful career guidance assistant for the "Career Builder & Explorer (CBE)" application. Your audience is students and teachers in Kenya. Answer their questions about careers, subjects, and provide guidance. Be concise and encouraging.`},
        ...messages.map(msg => ({ role: msg.role, text: msg.content })),
    ];

    const { output } = await ai.generate({
      prompt,
    });

    return { response: output?.text || "I'm sorry, I couldn't generate a response." };
  }
);
