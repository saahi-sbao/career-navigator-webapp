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
    const history = messages.map(msg => ({ role: msg.role, content: [{ text: msg.content }] }));

    const { output } = await ai.generate({
      prompt: `You are a helpful, knowledgeable, and friendly career guidance assistant for the "Career Builder & Explorer (CBE)" application. Your personality should be like Google's Gemini - professional, yet approachable and encouraging. Your primary audience is students and teachers in Kenya.

      Your main goals are:
      1.  Answer questions clearly and concisely about careers, required subjects, and educational pathways.
      2.  Provide insightful and encouraging guidance to users exploring their future options.
      3.  Maintain a positive and supportive tone at all times.
      4.  When asked about topics outside of career guidance, gently steer the conversation back to your purpose.`,
      history,
    });

    return { response: output?.text || "I'm sorry, I couldn't generate a response." };
  }
);
