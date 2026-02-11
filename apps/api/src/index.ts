import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { chatRoutes } from "./routes/chat.route";
import { agentRoutes } from "./routes/agents.route";
import { healthRoutes } from "./routes/health.route";
import { errorHandler } from "./middleware/error-handler";
import { rateLimiter } from "./middleware/rate-limiter";
import { authMiddleware } from "./middleware/auth";
import { env } from "./config/env";

const app = new Hono()
  .use("*", logger())
  .use("*", cors({ origin: "*" }))
  .use("*", errorHandler)
  .use("/api/*", rateLimiter)
  .use("/api/*", authMiddleware);

const api = app
  .basePath("/api")
  .route("/chat", chatRoutes)
  .route("/agents", agentRoutes)
  .route("/health", healthRoutes);

export type AppType = typeof api;

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`🚀 Server running on http://localhost:${info.port}`);
  console.log(`📋 Routes:`);
  console.log(`   POST   /api/chat/messages`);
  console.log(`   GET    /api/chat/conversations`);
  console.log(`   GET    /api/chat/conversations/:id`);
  console.log(`   DELETE /api/chat/conversations/:id`);
  console.log(`   GET    /api/agents`);
  console.log(`   GET    /api/agents/:type/capabilities`);
  console.log(`   GET    /api/health`);
});
