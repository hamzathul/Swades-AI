import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    console.error("Error:", err);

    if (err instanceof AppError) {
      return c.json(
        {
          success: false,
          error: err.message,
          details: err.details,
        },
        err.statusCode as any,
      );
    }

    if (err instanceof ZodError) {
      return c.json(
        {
          success: false,
          error: "Validation error",
        },
        400,
      );
    }

    if (err instanceof HTTPException) {
      return c.json(
        {
          success: false,
          error: err.message,
        },
        err.status,
      );
    }

    return c.json(
      {
        success: false,
        error: "Internal server error",
      },
      500,
    );
  }
}
