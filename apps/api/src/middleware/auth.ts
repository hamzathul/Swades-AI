import type { Context, Next } from "hono";

export async function authMiddleware(c: Context, next: Next) {
  const userId = c.req.header("x-user-id") || "user-1";
  c.set("userId", userId);
  return next();
}
