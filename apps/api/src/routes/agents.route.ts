import { Hono } from "hono";
import {
  listAgents,
  getAgentCapabilities,
} from "../controllers/agents.controller";

export const agentRoutes = new Hono()
  .get("/", listAgents)
  .get("/:type/capabilities", getAgentCapabilities);
