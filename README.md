PROJECT: AI-powered multi-agent customer support system

MONOREPO STRUCTURE (Turborepo):

- packages/db — Prisma ORM + PostgreSQL
- packages/shared — Shared TypeScript types
- apps/server — Hono.dev backend (port 3001)
- apps/web — Next.js 15 frontend (port 3000)

TECH STACK:

- Backend: Hono.dev on Node.js
- Frontend: Next.js 15 (App Router), React 19, Tailwind CSS
- Database: PostgreSQL with Prisma ORM
- AI: Vercel AI SDK with OpenRouter (default model: meta-llama/llama-3.1-70b-instruct)
- Monorepo: Turborepo
- Language: TypeScript throughout

PREREQUISITES:

- Node.js >= 18
- PostgreSQL >= 14
- An API key from OpenRouter (https://openrouter.ai) or OpenAI

ENVIRONMENT VARIABLES NEEDED:

- DATABASE_URL (PostgreSQL connection string)
- AI_API_KEY (OpenRouter or OpenAI key)
- AI_BASE_URL (default: https://openrouter.ai/api/v1)
- AI_MODEL (default: meta-llama/llama-3.1-70b-instruct)
- PORT (default: 3001)
- NODE_ENV (default: development)
- RATE_LIMIT_MAX (default: 20)
- RATE_LIMIT_WINDOW_MS (default: 60000)

SETUP STEPS:

1. Clone repo
2. npm install (installs all workspaces)
3. Copy .env.example to .env and fill values
4. npm run db:generate (generates Prisma client)
5. npm run db:migrate (runs migrations, creates tables)
6. npm run db:seed (seeds sample data: 4 orders, 4 invoices, 1 refund, order items, 1 conversation)
7. npm run dev (starts both frontend and backend via Turborepo)

AVAILABLE SCRIPTS:

- npm run dev — starts both apps
- npm run build — builds all packages
- npm run db:generate — generates Prisma client
- npm run db:migrate — runs migrations
- npm run db:seed — seeds database


TECHNICAL DECISIONS TO EXPLAIN:
1. Why Turborepo monorepo (shared types between frontend/backend, single dev command, dependency management)
2. Why controller-service pattern (separation of concerns, testability, clean request/response handling)
3. Why SSE streaming over WebSockets (simpler to implement, HTTP-based, sufficient for one-directional server-to-client streaming, no extra dependencies)
4. Why router agent pattern (single entry point, intent classification before delegation, specialized agents stay focused)
5. Why OpenRouter as default AI provider (access to multiple models with one API key, easy to switch models, cost effective)
6. Why Prisma over Drizzle (mature ecosystem, auto-generated types, simpler migrations, better documentation)
7. Why global error handling middleware (consistent error responses, centralized logging, catches unhandled errors)
