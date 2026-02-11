import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function routeIntent(message: string) {
  const res = await generateText({
    model: openai("gpt-4o-mini"),
    system: "Classify into support, order, billing. Return only one word.",
    prompt: message,
  });

  return res.text.trim();
}
