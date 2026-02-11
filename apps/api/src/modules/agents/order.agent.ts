import { getUserOrder } from "../tools/order.tool";

 
interface AgentContext {
  userId: string;
  conversationId: string;
  message: string;
}

export async function orderAgent(ctx: AgentContext) {
  const order = await getUserOrder(ctx.userId);

  if (!order) return "No orders found.";

  return `Your order status is ${order.status}. Tracking: ${order.trackingNumber}`;
}
