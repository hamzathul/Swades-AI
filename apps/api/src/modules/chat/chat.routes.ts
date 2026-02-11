import { Hono } from "hono";
import { sendMessage } from "./chat.controller";
import {
  getConversation,
  listConversations,
  removeConversation,
} from "./conversation.controller";

export const chatRoutes = new Hono();

chatRoutes.post("/messages", sendMessage);

chatRoutes.get("/conversations", listConversations);
chatRoutes.get("/conversations/:id", getConversation);
chatRoutes.delete("/conversations/:id", removeConversation);
