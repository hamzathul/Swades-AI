import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string(),
  AI_API_KEY: z.string(),
  AI_BASE_URL: z.string().default("https://openrouter.ai/api/v1"),
  AI_MODEL: z.string().default("meta-llama/llama-3.1-8b-instruct"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  RATE_LIMIT_MAX: z.coerce.number().default(20),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
});

export const env = envSchema.parse(process.env);
