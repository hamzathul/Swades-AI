import { generateText, tool, streamText } from "ai";
import { ai } from "../../config/ai";
import {
  getConversationHistory,
  getUserConversationSummaries,
} from "../tools/conversation.tool";
import { z } from "zod";
import type { AgentContext } from "../../types";

export async function supportAgent(ctx: AgentContext) {
  const history = await getConversationHistory(ctx.conversationId);

  const res = await generateText({
    model: ai(),
    system: `You are a friendly and helpful customer support assistant.
You help customers with general inquiries, FAQs, troubleshooting, and account issues.
Use conversation history tools to provide personalized responses.
Be concise but thorough. If you don't know something, say so honestly.
Do not make up information.`,
    prompt: `Conversation History:\n${history}\n\nUser: ${ctx.message}`,
    tools: {
      getPreviousConversations: tool({
        description:
          "Get summaries of the user's previous conversations for context",
        inputSchema: z.object({}),
        execute: async () => {
          const summaries = await getUserConversationSummaries(ctx.userId);
          return { conversations: summaries };
        },
      }),
      searchConversationHistory: tool({
        description:
          "Search the current conversation history for specific details",
        inputSchema: z.object({
          query: z.string().describe("What to search for in the conversation"),
        }),
        execute: async () => {
          const fullHistory = await getConversationHistory(
            ctx.conversationId,
            50,
          );
          return { history: fullHistory };
        },
      }),
    },
  });

  return res.text;
}

export function supportAgentStream(ctx: AgentContext, history: string) {
  return streamText({
    model: ai(),
    system: `You are a friendly and helpful customer support assistant.
You help customers with general inquiries, FAQs, troubleshooting, and account issues.
Be concise but thorough. If you don't know something, say so honestly.`,
    prompt: `Conversation History:\n${history}\n\nUser: ${ctx.message}`,
    tools: {
      getPreviousConversations: tool({
        description:
          "Get summaries of the user's previous conversations for context",
        inputSchema: z.object({}),
        execute: async () => {
          const summaries = await getUserConversationSummaries(ctx.userId);
          return { conversations: summaries };
        },
      }),
    },
  });
}
