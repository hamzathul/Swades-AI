import type { Context, Next } from "hono";

type Entry = {
  timestamps: number[];
};

const store = new Map<string, Entry>();

const WINDOW_MS = 60_000;

function getLimit(path: string) {
  if (path.startsWith("/api/chat/messages")) return 30;
  return 120;
}

export async function rateLimit(c: Context, next: Next) {
  const ip =
    c.req.header("x-forwarded-for") ||
    c.req.header("cf-connecting-ip") ||
    "local";

  const key = `${ip}:${c.req.path}`;
  const now = Date.now();
  const limit = getLimit(c.req.path);

  let entry = store.get(key);

  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  entry.timestamps = entry.timestamps.filter((ts) => now - ts < WINDOW_MS);

  if (entry.timestamps.length >= limit) {
    return c.json(
      {
        error: "Too many requests. Please slow down.",
        retryAfter: Math.ceil((WINDOW_MS - (now - entry.timestamps[0])) / 1000),
      },
      429,
    );
  }

  entry.timestamps.push(now);

  await next();
}
