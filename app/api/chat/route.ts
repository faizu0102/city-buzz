import { NextRequest, NextResponse } from "next/server";
import { buildCityBuzzContext, resolveEventIds } from "@/lib/services/aiContextService";
import { sendChatMessageToGemini } from "@/lib/services/geminiService";
import type { ChatApiRequest, ChatApiResponse } from "@/lib/types/chat";

// ─── Rate Limiting (In-memory token bucket per client) ─────────────────────────
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15;      // 15 requests per minute

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier) || { timestamps: [] };

  // Remove timestamps outside window
  record.timestamps = record.timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);

  if (record.timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  record.timestamps.push(now);
  rateLimitMap.set(identifier, record);

  // Periodic cleanup if map grows large
  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.timestamps.length === 0 || now - value.timestamps[value.timestamps.length - 1] > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.delete(key);
      }
    }
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Client identification for rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "anonymous-client";

    if (isRateLimited(ip)) {
      return NextResponse.json<ChatApiResponse>(
        {
          reply: "CityBuzz AI is currently busy. Please try again in a moment.",
          events: [],
          suggestedQuestions: ["What's happening today?", "Events this weekend"],
          status: "error",
          error: "RATE_LIMIT",
        },
        { status: 429 }
      );
    }

    // 2. Parse and validate payload
    let body: ChatApiRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json<ChatApiResponse>(
        {
          reply: "Invalid request payload format.",
          events: [],
          suggestedQuestions: [],
          status: "error",
          error: "INVALID_BODY",
        },
        { status: 400 }
      );
    }

    const message = body.message?.trim();
    if (!message) {
      return NextResponse.json<ChatApiResponse>(
        {
          reply: "Please enter a message to ask CityBuzz AI.",
          events: [],
          suggestedQuestions: ["What's happening today?", "Explore Nizamabad"],
          status: "error",
          error: "EMPTY_MESSAGE",
        },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json<ChatApiResponse>(
        {
          reply: "Your question is a bit too long. Please keep it under 1000 characters so I can assist you better.",
          events: [],
          suggestedQuestions: [],
          status: "error",
          error: "MESSAGE_TOO_LONG",
        },
        { status: 400 }
      );
    }

    // 3. Build grounded CityBuzz data context
    const { contextPrompt } = buildCityBuzzContext(message, body.userContext);

    // 4. Send request to Gemini
    const geminiResult = await sendChatMessageToGemini(
      message,
      body.history || [],
      contextPrompt
    );

    // 5. Resolve real CityBuzz events from IDs
    const matchedEvents = resolveEventIds(geminiResult.eventIds);

    // 6. Return clean structured response
    return NextResponse.json<ChatApiResponse>(
      {
        reply: geminiResult.reply,
        events: matchedEvents,
        suggestedQuestions: geminiResult.suggestedQuestions,
        status: "success",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[CityBuzz AI Chat Route Error]:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    // Friendly messages based on error category
    if (errorMessage === "MISSING_API_KEY") {
      return NextResponse.json<ChatApiResponse>(
        {
          reply:
            "CityBuzz AI needs a valid **Gemini API key** to work.\n\n**How to fix:**\n1. Go to [aistudio.google.com](https://aistudio.google.com/) and sign in\n2. Click **Get API key** → Create API key\n3. Copy the key (it starts with `AIzaSy...`)\n4. Open `.env.local` and replace `GEMINI_API_KEY=` with your new key\n5. Restart the dev server (`npm run dev`)",
          events: [],
          suggestedQuestions: ["What's happening today?", "Events this weekend"],
          status: "error",
          error: "MISSING_API_KEY",
        },
        { status: 200 }
      );
    }

    if (errorMessage === "RATE_LIMIT_EXCEEDED") {
      return NextResponse.json<ChatApiResponse>(
        {
          reply: "CityBuzz AI is currently busy. Please try again in a moment.",
          events: [],
          suggestedQuestions: ["What's happening today?", "Events this weekend"],
          status: "error",
          error: "RATE_LIMIT_EXCEEDED",
        },
        { status: 429 }
      );
    }

    if (errorMessage.includes("API key not valid") || errorMessage.includes("API_KEY_INVALID")) {
      return NextResponse.json<ChatApiResponse>(
        {
          reply: "The configured Gemini API key is invalid. Please verify your `GEMINI_API_KEY` in `.env.local`.",
          events: [],
          suggestedQuestions: ["What's happening today?", "Events this weekend"],
          status: "error",
          error: "INVALID_API_KEY",
        },
        { status: 200 }
      );
    }

    // Default friendly error
    return NextResponse.json<ChatApiResponse>(
      {
        reply: "Sorry, CityBuzz AI is temporarily unavailable. Please try again.",
        events: [],
        suggestedQuestions: ["What's happening today?", "Events this weekend"],
        status: "error",
        error: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
