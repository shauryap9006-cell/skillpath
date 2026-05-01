import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export type GroqModel =
  | "llama-3.3-70b-versatile"
  | "llama-3.1-8b-instant"
  | "mixtral-8x7b-32768";

/** Simple sleep helper */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Send a prompt to Groq and return the parsed response.
 * - Falls back to smaller models on 429 rate limit.
 * - Retries with exponential backoff on 400 "max completion tokens" (token budget depleted).
 * - Waits between calls to respect the 6000 TPM free-tier limit.
 */
export async function callGroq(
  systemPrompt: string,
  userMessage: string,
  options?: {
    model?: GroqModel;
    temperature?: number;
    maxTokens?: number;
    jsonMode?: boolean;
  }
): Promise<string> {
  const model = options?.model ?? "llama-3.3-70b-versatile";
  const temperature = options?.temperature ?? 0;
  const maxTokens = options?.maxTokens ?? 1024;

  const fallbackModels: GroqModel[] = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768",
  ];

  const startIndex = fallbackModels.indexOf(model);
  const modelsToTry = fallbackModels.slice(startIndex >= 0 ? startIndex : 0);

  const MAX_RETRIES = 5;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    for (const currentModel of modelsToTry) {
      try {
        const completion = await groq.chat.completions.create({
          model: currentModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          temperature,
          max_tokens: maxTokens,
          response_format: options?.jsonMode ? { type: "json_object" } : undefined,
        });

        return completion.choices[0]?.message?.content ?? "";
      } catch (error: unknown) {
        const err = error as { status?: number; error?: { error?: { code?: string } } };
        const errorCode = err?.error?.error?.code;

        // 429 = rate limited → try next model
        if (err.status === 429 && currentModel !== modelsToTry[modelsToTry.length - 1]) {
          console.warn(`Rate limited on ${currentModel}, falling back...`);
          continue;
        }

        // 400 with "json_validate_failed" / "max completion tokens" or 429 on last model → wait and retry
        if ((err.status === 400 && errorCode === "json_validate_failed") || err.status === 429) {
          console.warn(`Rate limit or token budget hit on ${currentModel} (attempt ${attempt + 1}/${MAX_RETRIES}). Waiting...`);
          // Longer waits: 20s, 30s, 40s, 50s, 60s
          await sleep(20_000 + attempt * 10_000);
          break; // break inner loop to retry from the top model
        }

        throw error;
      }
    }
  }

  throw new Error("All Groq models rate limited after retries. Please try again in a minute.");
}

/**
 * Call Groq and parse the response as JSON.
 * Strips any markdown code fences before parsing.
 */
export async function callGroqJSON<T = unknown>(
  systemPrompt: string,
  userMessage: string,
  options?: {
    model?: GroqModel;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<T> {
  const raw = await callGroq(systemPrompt, userMessage, {
    ...options,
    jsonMode: true,
  });

  // Strip markdown code fences if present
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.error("JSON Parse Error. Raw response:", raw);
    throw err;
  }
}

export default groq;
