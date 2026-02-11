import { prisma } from "@repo/db";
import { AppError } from "../../middleware/error-handler";

export async function resolveConversation(
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

  if (existing) {
    if (existing.userId !== userId) {
      throw new AppError(403, "Not authorized to access this conversation");
    }
    return existing;
  }

  return prisma.conversation.create({ data: { userId } });
}

export async function getConversationById(id: string, userId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!conversation) throw new AppError(404, "Conversation not found");
  if (conversation.userId !== userId) throw new AppError(403, "Not authorized");

  return conversation;
}

export async function getUserConversations(userId: string) {
  const conversations = await prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { content: true, role: true, createdAt: true },
      },
      _count: { select: { messages: true } },
    },
  });

  return conversations.map((c) => ({
    id: c.id,
    title: c.title,
    lastMessage: c.messages[0]?.content || null,
    messageCount: c._count.messages,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));
}

export async function deleteConversation(id: string, userId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id },
  });

  if (!conversation) throw new AppError(404, "Conversation not found");
  if (conversation.userId !== userId) throw new AppError(403, "Not authorized");

  await prisma.conversation.delete({ where: { id } });
  return { success: true };
}
