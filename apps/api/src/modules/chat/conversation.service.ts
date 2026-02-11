import { prisma } from "@repo/db";

export async function listUserConversations(userId: string) {
  return prisma.conversation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1, // last message preview
      },
    },
  });
}

export async function getConversationHistory(conversationId: string) {
  return  prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function deleteConversation(conversationId: string) {
  await prisma.message.deleteMany({
    where: { conversationId },
  });

  return prisma.conversation.delete({
    where: { id: conversationId },
  });
}
