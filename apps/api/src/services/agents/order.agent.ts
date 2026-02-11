import { generateText, tool, streamText } from "ai";
import { ai } from "../../config/ai";
import { getConversationHistory } from "../tools/conversation.tool";
import {
  getUserLatestOrder,
  getUserOrders,
  getOrderById,
  getOrderByTracking,
} from "../tools/order.tool";
import { z } from "zod";
import type { AgentContext } from "../../types";

export async function orderAgent(ctx: AgentContext) {
  const history = await getConversationHistory(ctx.conversationId);

  const res = await generateText({
    model: ai(),
    system: `You are an order management assistant.
You help customers check order status, track shipments, and answer order-related questions.
Always use tools to look up real order data before responding.
Provide specific details: order ID, status, tracking number, items, and totals.
Never fabricate order information.
If the user asks about "my order" without specifying, fetch their latest order first.`,
    prompt: `Conversation History:\n${history}\n\nUser: ${ctx.message}`,
    tools: {
      getLatestOrder: tool({
        description: "Get the most recent order for the user",
        inputSchema: z.object({}),
        execute: async () => {
          const order = await getUserLatestOrder(ctx.userId);
          if (!order) return { found: false, message: "No orders found" };
          return { found: true, order };
        },
      }),
      getAllOrders: tool({
        description: "Get all orders for the user",
        inputSchema: z.object({}),
        execute: async () => {
          const orders = await getUserOrders(ctx.userId);
          return { found: orders.length > 0, count: orders.length, orders };
        },
      }),
      lookupOrder: tool({
        description: "Look up a specific order by its ID",
        inputSchema: z.object({
          orderId: z.string().describe("The order ID"),
        }),
        execute: async ({ orderId }) => {
          const order = await getOrderById(orderId, ctx.userId);
          if (!order) return { found: false };
          return { found: true, order };
        },
      }),
      trackOrder: tool({
        description: "Look up an order by tracking number",
        inputSchema: z.object({
          trackingNumber: z.string().describe("The tracking number"),
        }),
        execute: async ({ trackingNumber }) => {
          const order = await getOrderByTracking(trackingNumber, ctx.userId);
          if (!order) return { found: false };
          return { found: true, order };
        },
      }),
    },
  });

  return res.text;
}

export function orderAgentStream(ctx: AgentContext, history: string) {
  return streamText({
    model: ai(),
    system: `You are an order management assistant.
Always use tools to look up real order data before responding.
Provide specific details: order ID, status, tracking number, items, and totals.
Never fabricate order information.`,
    prompt: `Conversation History:\n${history}\n\nUser: ${ctx.message}`,
    tools: {
      getLatestOrder: tool({
        description: "Get the most recent order for the user",
        inputSchema: z.object({}),
        execute: async () => {
          const order = await getUserLatestOrder(ctx.userId);
          if (!order) return { found: false };
          return { found: true, order };
        },
      }),
      getAllOrders: tool({
        description: "Get all orders for the user",
        inputSchema: z.object({}),
        execute: async () => {
          const orders = await getUserOrders(ctx.userId);
          return { found: orders.length > 0, count: orders.length, orders };
        },
      }),
      lookupOrder: tool({
        description: "Look up a specific order by its ID",
        inputSchema: z.object({
          orderId: z.string().describe("The order ID"),
        }),
        execute: async ({ orderId }) => {
          const order = await getOrderById(orderId, ctx.userId);
          if (!order) return { found: false };
          return { found: true, order };
        },
      }),
    },
  });
}
