import type { Context, Next } from "hono";
import { env } from "../config/env";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 60000);

export async function rateLimiter(c: Context, next: Next) {
  const key =
    c.req.header("x-user-id") || c.req.header("x-forwarded-for") || "anonymous";

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + env.RATE_LIMIT_WINDOW_MS });
    c.header("X-RateLimit-Remaining", String(env.RATE_LIMIT_MAX - 1));
    return next();
  }

  if (entry.count >= env.RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    c.header("Retry-After", String(retryAfter));
    return c.json({ success: false, error: "Rate limit exceeded" }, 429);
  }

  entry.count++;
  c.header("X-RateLimit-Remaining", String(env.RATE_LIMIT_MAX - entry.count));
  return next();
}
