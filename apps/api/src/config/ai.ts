import { createOpenAI } from "@ai-sdk/openai";
import { env } from "./env";

const openai = createOpenAI({
  apiKey: env.AI_API_KEY,
  baseURL: env.AI_BASE_URL,
});

export const ai = (model?: string) => openai(model ?? env.AI_MODEL);
