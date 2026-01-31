import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

// Standard Genkit-Firebase integration
import { onCallGenkit } from "firebase-functions/https";

// Cloud Secret Manager for the API Key
import { defineSecret } from "firebase-functions/params";
const apiKey = defineSecret("GOOGLE_GENAI_API_KEY");

// Telemetry for Google Cloud Observability
import { enableFirebaseTelemetry } from "@genkit-ai/firebase";
enableFirebaseTelemetry();

const ai = genkit({
  plugins: [
    googleAI()
  ],
});

// Define the Genkit Flow
const menuSuggestionFlow = ai.defineFlow(
  {
    name: "menuSuggestionFlow",
    inputSchema: z.string().describe("A restaurant theme").default("seafood"),
    outputSchema: z.string(),
    streamSchema: z.string(),
  },
  // Explicitly typing 'subject' and 'sendChunk' to satisfy TypeScript strict mode
  async (subject: string, { sendChunk }: { sendChunk: (chunk: string) => void }) => {
    const prompt = `Suggest an item for the menu of a ${subject} themed restaurant`;

    const { response, stream } = ai.generateStream({
      model: "googleai/gemini-1.5-flash",
      prompt: prompt,
      config: {
        temperature: 1,
      },
    });

    // Handle streaming chunks
    for await (const chunk of stream) {
      sendChunk(chunk.text);
    }

    // Return final full response
    return (await response).text;
  }
);

// Export the Cloud Function
export const menuSuggestion = onCallGenkit(
  {
    // Grant access to the API key secret
    secrets: [apiKey],
    // If you need to enable AppCheck or Auth, you would add them here
  },
  menuSuggestionFlow
);