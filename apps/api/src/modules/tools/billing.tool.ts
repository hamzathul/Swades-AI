import { prisma } from "@repo/db";

export async function getInvoice(orderId: string) {
  return prisma.invoice.findFirst({ where: { orderId } });
}

export async function getRefund(orderId: string) {
  return prisma.refund.findFirst({ where: { orderId } });
}
