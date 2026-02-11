import { routeIntent } from "../agents/router.agent";
import { supportAgent } from "../agents/support.agent";
import { orderAgent } from "../agents/order.agent";
import { billingAgent } from "../agents/billing.agent";
import { prisma } from "@repo/db";
export async function handleMessage(
  userId: string,
  conversationId: string | null,
  message: string,
) {
  // 1️⃣ GUARANTEED conversation
  const conversation = await resolveConversation(userId, conversationId);

  // 2️⃣ store user message
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "user",
      content: message,
    },
  });

  // 3️⃣ route
  const intent = await routeIntent(message);

  let reply = "I couldn't understand your request.";

  if (intent === "support")
    reply = await supportAgent({
      userId,
      conversationId: conversation.id,
      message,
    });

  if (intent === "order")
    reply = await orderAgent({
      userId,
      conversationId: conversation.id,
      message,
    });

  if (intent === "billing")
    reply = await billingAgent({
      userId,
      conversationId: conversation.id,
      message,
    });

  // 4️⃣ save assistant
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "assistant",
      content: reply,
    },
  });

  return { reply, intent, conversationId: conversation.id };
}

async function resolveConversation(
  userId: string,
  conversationId?: string | null,
) {
  if (!conversationId) {
    return prisma.conversation.create({
      data: { userId },
    });
  }

  const existing = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (existing) return existing;

  // client sent invalid id -> create new
  return prisma.conversation.create({
    data: { userId },
  });
}
