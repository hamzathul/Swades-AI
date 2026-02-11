import { generateText } from "ai";
import { ai } from "../../config/ai";
import { getConversationHistory } from "../chat/conversation.service";

interface AgentContext {
  userId: string;
  conversationId: string;
  message: string;
}

export async function supportAgent(ctx: AgentContext) {
  const history = await getConversationHistory(ctx.conversationId);

  const res = await generateText({
    model: ai("meta-llama/llama-3.1-8b-instruct"),
    system: "You are customer support.",
    prompt: `History:\n${history}\nUser:${ctx.message}`,
  });

  return res.text;
}
