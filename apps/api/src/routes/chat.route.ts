import { Hono } from "hono";
import {
  sendMessage,
  getConversation,
  listConversations,
  removeConversation,
} from "../controllers/chat.controller";

export const chatRoutes = new Hono()
  .post("/messages", sendMessage)
  .get("/conversations", listConversations)
  .get("/conversations/:id", getConversation)
  .delete("/conversations/:id", removeConversation);
