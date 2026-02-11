import { Hono } from "hono";
import { cors } from "hono/cors";
import { errorMiddleware } from "./middleware/error";
import { rateLimit } from "./middleware/rateLimit";
import { chatRoutes } from "./modules/chat/chat.routes";
import { healthRoutes } from "./routes/health.routes";

export const app = new Hono()
  .use("*", errorMiddleware)
  .use("*", rateLimit)
  .use("*", cors())
  .route("/api/chat", chatRoutes)
  .route("/api/health", healthRoutes);

export type AppType = typeof app;
