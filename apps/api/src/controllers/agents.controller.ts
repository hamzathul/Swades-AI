import type { Context } from "hono";
import { AGENTS } from "@repo/shared";
import { AppError } from "../middleware/error-handler";

export async function listAgents(c: Context) {
  return c.json({
    success: true,
    data: AGENTS,
  });
}

export async function getAgentCapabilities(c: Context) {
  const type = c.req.param("type");
  const agent = AGENTS.find((a) => a.type === type);

  if (!agent) {
    throw new AppError(404, `Agent type '${type}' not found`);
  }

  return c.json({
    success: true,
    data: agent,
  });
}
