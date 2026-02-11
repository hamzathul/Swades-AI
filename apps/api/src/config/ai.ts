import { createOpenAI } from "@ai-sdk/openai";

export const ai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});
