import { prisma } from "@repo/db";

export async function getUserLatestOrder(userId: string) {
  return prisma.order.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      invoice: true,
      refund: true,
    },
  });
}

export async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      invoice: true,
      refund: true,
    },
  });
}

export async function getOrderById(orderId: string, userId: string) {
  return prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: true,
      invoice: true,
      refund: true,
    },
  });
}

export async function getOrderByTracking(
  trackingNumber: string,
  userId: string,
) {
  return prisma.order.findFirst({
    where: { trackingNumber, userId },
    include: {
      items: true,
      invoice: true,
      refund: true,
    },
  });
}
