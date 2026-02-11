import { generateText, tool, streamText } from "ai";
import { ai } from "../../config/ai";
import { getConversationHistory } from "../tools/conversation.tool";
import {
  getUserInvoices,
  getUnpaidInvoices,
  getInvoiceById,
  getRefundStatus,
  requestRefund,
} from "../tools/billing.tool";
import { z } from "zod";
import type { AgentContext } from "../../types";

export async function billingAgent(ctx: AgentContext) {
  const history = await getConversationHistory(ctx.conversationId);

  const res = await generateText({
    model: ai(),
    system: `You are a billing and payments assistant.
You help customers with invoices, payments, and refunds.
Always use tools to fetch real billing data before responding.
For refund requests, confirm the order details with the user before submitting.
Never fabricate invoice or payment information.
Be clear about amounts, payment status, and next steps.`,
    prompt: `Conversation History:\n${history}\n\nUser: ${ctx.message}`,
    tools: {
      getAllInvoices: tool({
        description: "Get all invoices for the user",
        inputSchema: z.object({}),
        execute: async () => {
          const invoices = await getUserInvoices(ctx.userId);
          return {
            found: invoices.length > 0,
            count: invoices.length,
            invoices,
          };
        },
      }),
      getUnpaidInvoices: tool({
        description: "Get only unpaid invoices for the user",
        inputSchema: z.object({}),
        execute: async () => {
          const invoices = await getUnpaidInvoices(ctx.userId);
          return {
            found: invoices.length > 0,
            count: invoices.length,
            invoices,
          };
        },
      }),
      lookupInvoice: tool({
        description: "Look up a specific invoice by ID",
        inputSchema: z.object({
          invoiceId: z.string().describe("The invoice ID"),
        }),
        execute: async ({ invoiceId }) => {
          const invoice = await getInvoiceById(invoiceId, ctx.userId);
          if (!invoice) return { found: false };
          return { found: true, invoice };
        },
      }),
      checkRefundStatus: tool({
        description: "Check refund status for a specific order",
        inputSchema: z.object({
          orderId: z.string().describe("The order ID"),
        }),
        execute: async ({ orderId }) => {
          const refund = await getRefundStatus(orderId, ctx.userId);
          if (!refund)
            return { found: false, message: "No refund found for this order" };
          return { found: true, refund };
        },
      }),
      submitRefundRequest: tool({
        description:
          "Submit a refund request. Only use when user explicitly confirms they want a refund.",
        inputSchema: z.object({
          orderId: z.string().describe("The order ID to refund"),
          reason: z.string().describe("Reason for the refund"),
        }),
        execute: async ({ orderId, reason }) => {
          return requestRefund(orderId, ctx.userId, reason);
        },
      }),
    },
  });

  return res.text;
}

export function billingAgentStream(ctx: AgentContext, history: string) {
  return streamText({
    model: ai(),
    system: `You are a billing and payments assistant.
Always use tools to fetch real billing data before responding.
For refund requests, confirm details before submitting.
Never fabricate data.`,
    prompt: `Conversation History:\n${history}\n\nUser: ${ctx.message}`,
    tools: {
      getAllInvoices: tool({
        description: "Get all invoices for the user",
        inputSchema: z.object({}),
        execute: async () => {
          const invoices = await getUserInvoices(ctx.userId);
          return {
            found: invoices.length > 0,
            count: invoices.length,
            invoices,
          };
        },
      }),
      getUnpaidInvoices: tool({
        description: "Get only unpaid invoices",
        inputSchema: z.object({}),
        execute: async () => {
          const invoices = await getUnpaidInvoices(ctx.userId);
          return { found: invoices.length > 0, invoices };
        },
      }),
      checkRefundStatus: tool({
        description: "Check refund status for a specific order",
        inputSchema: z.object({
          orderId: z.string().describe("The order ID"),
        }),
        execute: async ({ orderId }) => {
          const refund = await getRefundStatus(orderId, ctx.userId);
          if (!refund) return { found: false };
          return { found: true, refund };
        },
      }),
      submitRefundRequest: tool({
        description: "Submit a refund request",
        inputSchema: z.object({
          orderId: z.string().describe("The order ID to refund"),
          reason: z.string().describe("Reason for the refund"),
        }),
        execute: async ({ orderId, reason }) => {
          return requestRefund(orderId, ctx.userId, reason);
        },
      }),
    },
  });
}
