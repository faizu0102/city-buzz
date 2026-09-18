/**
 * CityBuzz Gemini Service
 *
 * Interacts with Google's official Gemini API using @google/genai.
 * Keeps API key strictly server-side and enforces grounded responses.
 */

import { GoogleGenAI } from "@google/genai";
import type { ChatHistoryMessage } from "@/lib/types/chat";

export interface GeminiChatResult {
  reply: string;
  eventIds: string[];
  suggestedQuestions: string[];
}

export const CITYBUZZ_SYSTEM_INSTRUCTION = `You are CityBuzz AI, the official AI assistant for CityBuzz.

CityBuzz is a local discovery platform initially focused on Nizamabad, Telangana, India.
Your main purpose is to help users discover events, activities, and local experiences.

You can help users with:
- Events
- Cultural programs
- Sports
- Workshops
- Technology events
- Education
- Competitions
- Community activities
- Local places
- Local businesses

GUIDELINES:
1. Always prioritize information available from the provided CityBuzz platform data.
2. Be honest about what you know. Do NOT invent event names, dates, venues, organizers, registration links, prices, or availability.
3. If the requested information is not available in the provided CityBuzz data, clearly say that it is not currently available.
4. Keep responses concise, friendly, practical, and natural. Do not sound robotic.
5. When discussing an event, mention its name, date, time, venue in Nizamabad, and whether it is free or paid when available.
6. If the user asks for events, highlight the matching events rather than giving generic advice.
7. If the user asks something unrelated to CityBuzz, answer briefly when appropriate, but steer the conversation back to discovering Nizamabad.
8. Never claim that an event is real or registered unless the provided CityBuzz data confirms it.

OUTPUT FORMAT:
Respond with a JSON object adhering to this structure:
{
  "message": "Friendly, conversational markdown response to the user. Use bolding and bullet points for readability. Keep it concise.",
  "eventIds": ["evt-001", "evt-002"], // Array of actual Event IDs referenced or recommended from the provided CityBuzz data. Leave empty [] if none are referenced.
  "suggestedQuestions": ["Question 1", "Question 2"] // 2-3 short, relevant follow-up questions for the user
}
`;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === "your_gemini_api_key_here" || apiKey === "PASTE_YOUR_AISTUDIO_KEY_HERE") {
    throw new Error("MISSING_API_KEY");
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Send a chat message to Gemini with conversation history and grounded context.
 */
export async function sendChatMessageToGemini(
  userMessage: string,
  history: ChatHistoryMessage[],
  groundedContextPrompt: string
): Promise<GeminiChatResult> {
  const client = getClient();
  const modelName = process.env.GEMINI_MODEL?.trim() || "gemini-3.6-flash";

  // Build the message sequence for multi-turn chat
  // We bound history to the last 6 turns to maintain conversation continuity while preserving free-tier tokens.
  const boundedHistory = (history || []).slice(-6);

  type GenAiContent = {
    role: "user" | "model";
    parts: Array<{ text: string }>;
  };

  const contents: GenAiContent[] = [];

  // Add conversation history
  for (const item of boundedHistory) {
    const role: "user" | "model" = item.role === "assistant" || item.role === "model" ? "model" : "user";
    if (item.text && item.text.trim()) {
      contents.push({
        role,
        parts: [{ text: item.text.trim() }],
      });
    }
  }

  // Append current user message augmented with fresh grounded context
  const currentPrompt = `${groundedContextPrompt}

User Question:
${userMessage.trim()}`;

  contents.push({
    role: "user",
    parts: [{ text: currentPrompt }],
  });

  let responseText = "";
  try {
    const response = await client.models.generateContent({
      model: modelName,
      contents,
      config: {
        systemInstruction: CITYBUZZ_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    if (response && response.text) {
      responseText = response.text;
    }
  } catch (err: unknown) {
    const errMsg = String(err);
    if (errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED")) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    console.error(`[Gemini Service Error] Generation failed with model ${modelName}:`, err);
    throw err;
  }

  if (!responseText) {
    throw new Error("EMPTY_GEMINI_RESPONSE");
  }

  // Parse structured response with regex fallback
  return parseGeminiOutput(responseText);
}

function parseGeminiOutput(raw: string): GeminiChatResult {
  let text = (raw || "").trim();

  // Strip markdown formatting if returned
  if (text.startsWith("```json")) {
    text = text.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
  } else if (text.startsWith("```")) {
    text = text.replace(/^```\s*/i, "").replace(/\s*```$/, "");
  }

  try {
    const parsed = JSON.parse(text);
    const message = typeof parsed.message === "string" ? parsed.message.trim() : "";
    const eventIds = Array.isArray(parsed.eventIds)
      ? parsed.eventIds.filter((id: unknown) => typeof id === "string" && id.trim().length > 0)
      : [];
    const suggestedQuestions = Array.isArray(parsed.suggestedQuestions)
      ? parsed.suggestedQuestions.filter((q: unknown) => typeof q === "string" && q.trim().length > 0)
      : [];

    if (message) {
      return {
        reply: message,
        eventIds,
        suggestedQuestions,
      };
    }
  } catch {
    // If JSON parsing fails, gracefully extract text and event IDs
  }

  // Fallback extraction
  const eventIdMatches = Array.from(raw.matchAll(/evt-\d+/gi), (m) => m[0].toLowerCase());
  return {
    reply: raw.replace(/```json/gi, "").replace(/```/gi, "").trim(),
    eventIds: Array.from(new Set(eventIdMatches)),
    suggestedQuestions: [
      "What else is happening in Nizamabad?",
      "Are there any free events?",
    ],
  };
}
