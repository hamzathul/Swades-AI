import { prisma } from "@repo/db";
import { routeIntent } from "../agents/router.agent";
import { supportAgent, supportAgentStream } from "../agents/support.agent";
import { orderAgent, orderAgentStream } from "../agents/order.agent";
import { billingAgent, billingAgentStream } from "../agents/billing.agent";
import { resolveConversation } from "./conversation.service";
import { getConversationHistory } from "../tools/conversation.tool";
import type { Intent, AgentContext } from "../../types";

interface HandleMessageInput {
  userId: string;
  conversationId: string | null;
  message: string;
}

const THINKING_PHRASES = [
  "Analyzing your request...",
  "Looking into this...",
  "Searching for information...",
  "Processing your query...",
  "Checking the details...",
];

function getRandomThinking() {
  return THINKING_PHRASES[Math.floor(Math.random() * THINKING_PHRASES.length)];
}

 export async function handleMessage(input: HandleMessageInput) {
  const conversation = await resolveConversation(
    input.userId,
    input.conversationId,
  );

   await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "user",
      content: input.message,
    },
  });

   const intent = await routeIntent(input.message);

  const ctx: AgentContext = {
    userId: input.userId,
    conversationId: conversation.id,
    message: input.message,
  };

   const reply = await dispatchToAgent(intent, ctx);

   await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "assistant",
      content: reply,
      intent,
      agentType: intent,
    },
  });

   if (!conversation.title) {
    const title = input.message.slice(0, 80);
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { title },
    });
  }

  return {
    reply,
    intent,
    agentType: intent,
    conversationId: conversation.id,
  };
}

async function dispatchToAgent(
  intent: Intent,
  ctx: AgentContext,
): Promise<string> {
  switch (intent) {
    case "order":
      return orderAgent(ctx);
    case "billing":
      return billingAgent(ctx);
    case "support":
    default:
      return supportAgent(ctx);
  }
}

// --- Streaming version ---
export async function handleMessageStream(input: HandleMessageInput) {
  const conversation = await resolveConversation(
    input.userId,
    input.conversationId,
  );

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "user",
      content: input.message,
    },
  });

  const intent = await routeIntent(input.message);
  const history = await getConversationHistory(conversation.id);

  const ctx: AgentContext = {
    userId: input.userId,
    conversationId: conversation.id,
    message: input.message,
  };

  const streamResult = dispatchToAgentStream(intent, ctx, history);

  return {
    stream: streamResult,
    intent,
    conversationId: conversation.id,
    thinking: getRandomThinking(),
  };
}

function dispatchToAgentStream(
  intent: Intent,
  ctx: AgentContext,
  history: string,
) {
  switch (intent) {
    case "order":
      return orderAgentStream(ctx, history);
    case "billing":
      return billingAgentStream(ctx, history);
    case "support":
    default:
      return supportAgentStream(ctx, history);
  }
}

// Save streamed response after completion
export async function saveStreamedResponse(
  conversationId: string,
  content: string,
  intent: string,
) {
  await prisma.message.create({
    data: {
      conversationId,
      role: "assistant",
      content,
      intent,
      agentType: intent,
    },
  });
}
