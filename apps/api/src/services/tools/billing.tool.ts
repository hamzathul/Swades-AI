import { prisma } from "@repo/db";

export async function getUserInvoices(userId: string) {
  return prisma.invoice.findMany({
    where: { order: { userId } },
    include: {
      order: {
        select: { id: true, status: true, total: true, createdAt: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUnpaidInvoices(userId: string) {
  return prisma.invoice.findMany({
    where: { order: { userId }, paid: false },
    include: { order: true },
  });
}

export async function getInvoiceById(invoiceId: string, userId: string) {
  return prisma.invoice.findFirst({
    where: { id: invoiceId, order: { userId } },
    include: { order: true },
  });
}

export async function getRefundStatus(orderId: string, userId: string) {
  return prisma.refund.findFirst({
    where: { orderId, order: { userId } },
  });
}

export async function requestRefund(
  orderId: string,
  userId: string,
  reason: string,
) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { refund: true, invoice: true },
  });

  if (!order) return { success: false, error: "Order not found" };
  if (order.refund)
    return { success: false, error: "Refund already exists for this order" };
  if (!order.invoice?.paid)
    return { success: false, error: "Order has not been paid yet" };

  const refund = await prisma.refund.create({
    data: {
      orderId,
      amount: order.total,
      status: "requested",
      reason,
    },
  });

  return { success: true, refund };
}
