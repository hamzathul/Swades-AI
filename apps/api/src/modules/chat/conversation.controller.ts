import type { Context } from "hono";
import {
  listUserConversations,
  getConversationHistory,
  deleteConversation,
} from "./conversation.service";

export async function listConversations(c: Context) {
  const userId = c.req.query("userId");

  if (!userId) return c.json({ error: "userId required" }, 400);

  const data = await listUserConversations(userId);
  return c.json(data);
}

export async function getConversation(c: Context) {
  const id = c.req.param("id");

  const data = await getConversationHistory(id);

  if (!data) return c.json({ error: "Not found" }, 404);

  return c.json(data);
}

export async function removeConversation(c: Context) {
  const id = c.req.param("id");

  await deleteConversation(id);
  return c.json({ success: true });
}
