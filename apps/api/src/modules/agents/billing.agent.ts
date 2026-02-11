import { getInvoice, getRefund } from "../tools/billing.tool";
import { getUserOrder } from "../tools/order.tool";

interface AgentContext {
  userId: string;
  conversationId: string;
  message: string;
}

export async function billingAgent(ctx: AgentContext) {
  const order = await getUserOrder(ctx.userId);
  if (!order) return "No billing records.";

  const invoice = await getInvoice(order.id);
  const refund = await getRefund(order.id);

  return `Invoice paid: ${invoice?.paid}. Refund status: ${refund?.status ?? "none"}`;
}
