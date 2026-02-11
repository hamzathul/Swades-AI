import type { Context } from "hono";
import { handleMessage } from "./chat.service";

export async function sendMessage(c: Context) {
  const body = await c.req.json();

  const result = await handleMessage(
    body.userId,
    body.conversationId ?? null,
    body.message,
  );

  return c.json(result);
}
