import { prisma } from "@repo/db";

export async function getUserOrder(userId: string) {
  return prisma.order.findFirst({ where: { userId } });
}
