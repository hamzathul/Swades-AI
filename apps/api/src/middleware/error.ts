import type { Context, Next } from "hono";

export async function errorMiddleware(c: Context, next: Next) {
  try {
    await next();
  } catch (err: any) {
    console.error(err);
    return c.json({ error: err.message || "Internal Error" }, 500);
  }
}
