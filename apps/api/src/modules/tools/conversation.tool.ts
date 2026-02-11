import { prisma } from "@repo/db";

export async function getConversationHistory(conversationId: string) {
  const msgs = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    take: 10,
  });

  return msgs.map((m) => `${m.role}: ${m.content}`).join("\n");
}
