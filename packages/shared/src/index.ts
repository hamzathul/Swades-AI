export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  reply: string;
  intent: string;
  conversationId: string;
  agentType: string;
}

export interface AgentInfo {
  type: string;
  name: string;
  description: string;
  capabilities: string[];
}

export interface ConversationSummary {
  id: string;
  title: string | null;
  lastMessage: string | null;
  createdAt: string;
  messageCount: number;
}

export const AGENTS: AgentInfo[] = [
  {
    type: "support",
    name: "Support Agent",
    description: "Handles general support inquiries, FAQs, and troubleshooting",
    capabilities: [
      "Answer general questions",
      "Troubleshoot common issues",
      "Query conversation history for context",
      "Provide FAQ responses",
    ],
  },
  {
    type: "order",
    name: "Order Agent",
    description:
      "Handles order status, tracking, modifications, and cancellations",
    capabilities: [
      "Check order status",
      "Provide tracking information",
      "List all user orders",
      "Look up specific orders by ID",
    ],
  },
  {
    type: "billing",
    name: "Billing Agent",
    description:
      "Handles payment issues, refunds, invoices, and subscription queries",
    capabilities: [
      "Check invoice details",
      "List unpaid invoices",
      "Check refund status",
      "Submit refund requests",
    ],
  },
];
