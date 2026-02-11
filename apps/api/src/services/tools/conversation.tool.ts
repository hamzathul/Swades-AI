import { prisma } from "@repo/db";

export async function getConversationHistory(
  conversationId: string,
  limit: number = 20,
): Promise<string> {
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  if (messages.length === 0) return "No previous messages.";

  return messages
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");
}

export async function getUserConversationSummaries(userId: string) {
  const conversations = await prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 5,
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { content: true, role: true },
      },
    },
  });

  return conversations.map((c) => ({
    id: c.id,
    title: c.title,
    lastMessage: c.messages[0]?.content || null,
    createdAt: c.createdAt.toISOString(),
  }));
}
