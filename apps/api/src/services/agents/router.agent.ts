import { generateText } from "ai";
import { ai } from "../../config/ai";
import type { Intent } from "../../types";

export async function routeIntent(message: string): Promise<Intent> {
  const res = await generateText({
    model: ai(),
    system: `You are an intent classifier for a customer support system.
Classify the user message into exactly ONE category.
Respond with ONLY the category name, nothing else.

Categories:
- order: order status, tracking, shipment, delivery, order history, what did I order, cancel order
- billing: invoices, payments, refunds, charges, receipts, pricing, subscription, how much, payment method
- support: everything else — general help, complaints, account issues, product questions, greetings, how to use`,
    prompt: message,
  });

  const intent = res.text.trim().toLowerCase();

  if (intent.includes("order")) return "order";
  if (intent.includes("billing")) return "billing";
  return "support";
}
