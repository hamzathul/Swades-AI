export interface AgentContext {
  userId: string;
  conversationId: string;
  message: string;
}

export type Intent = "support" | "order" | "billing";
