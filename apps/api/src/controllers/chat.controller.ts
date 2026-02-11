import type { Context } from "hono";
import { z } from "zod";
import {
  handleMessage,
  handleMessageStream,
  saveStreamedResponse,
} from "../services/chat/chat.service";
import {
  getConversationById,
  getUserConversations,
  deleteConversation,
} from "../services/chat/conversation.service";
import { AppError } from "../middleware/error-handler";

const sendMessageSchema = z.object({
  message: z.string().min(1, "Message is required").max(5000),
  conversationId: z.string().optional().nullable(),
  stream: z.boolean().optional().default(false),
});

export async function sendMessage(c: Context) {
  const userId = c.get("userId") as string;
  const body = await c.req.json();
  const parsed = sendMessageSchema.parse(body);

  if (parsed.stream) {
    return sendMessageStreaming(c, userId, parsed);
  }

  const result = await handleMessage({
    userId,
    conversationId: parsed.conversationId || null,
    message: parsed.message,
  });

  return c.json({
    success: true,
    data: result,
  });
}

async function sendMessageStreaming(
  c: Context,
  userId: string,
  parsed: z.infer<typeof sendMessageSchema>,
) {
  const { stream, intent, conversationId, thinking } =
    await handleMessageStream({
      userId,
      conversationId: parsed.conversationId || null,
      message: parsed.message,
    });

  // Set SSE headers
  c.header("Content-Type", "text/event-stream");
  c.header("Cache-Control", "no-cache");
  c.header("Connection", "keep-alive");

  const encoder = new TextEncoder();
  let fullText = "";

  const readable = new ReadableStream({
    async start(controller) {
      try {
        // Send metadata
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "metadata", intent, conversationId, thinking })}\n\n`,
          ),
        );

        // Send typing indicator
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "thinking", message: thinking })}\n\n`,
          ),
        );

        // Stream the text
        for await (const chunk of stream.textStream) {
          fullText += chunk;
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "text", content: chunk })}\n\n`,
            ),
          );
        }

        // Save completed response
        await saveStreamedResponse(conversationId, fullText, intent);

        // Send done signal
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "done", fullText, intent, conversationId })}\n\n`,
          ),
        );

        controller.close();
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", message: "Stream error" })}\n\n`,
          ),
        );
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export async function getConversation(c: Context) {
  const userId = c.get("userId") as string;
  const id = c.req.param("id");

  const conversation = await getConversationById(id, userId);

  return c.json({ success: true, data: conversation });
}

export async function listConversations(c: Context) {
  const userId = c.get("userId") as string;
  const conversations = await getUserConversations(userId);

  return c.json({ success: true, data: conversations });
}

export async function removeConversation(c: Context) {
  const userId = c.get("userId") as string;
  const id = c.req.param("id");

  await deleteConversation(id, userId);

  return c.json({ success: true, message: "Conversation deleted" });
}
