const BASE_URL = "/api";

const defaultHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  "x-user-id": "user-1", // In production, use real auth
});

// ─── Chat ────────────────────────────────────────────

export async function sendMessage(
  message: string,
  conversationId?: string | null,
  stream = false,
) {
  const res = await fetch(`${BASE_URL}/chat/messages`, {
    method: "POST",
    headers: defaultHeaders(),
    body: JSON.stringify({ message, conversationId, stream }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Failed to send message");
  }

  return res;
}

// ─── Conversations ───────────────────────────────────

export async function fetchConversations() {
  const res = await fetch(`${BASE_URL}/chat/conversations`, {
    headers: defaultHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch conversations");
  return res.json();
}

export async function fetchConversation(id: string) {
  const res = await fetch(`${BASE_URL}/chat/conversations/${id}`, {
    headers: defaultHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch conversation");
  return res.json();
}

export async function deleteConversation(id: string) {
  const res = await fetch(`${BASE_URL}/chat/conversations/${id}`, {
    method: "DELETE",
    headers: defaultHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete conversation");
  return res.json();
}

// ─── Agents ──────────────────────────────────────────

export async function fetchAgents() {
  const res = await fetch(`${BASE_URL}/agents`, {
    headers: defaultHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch agents");
  return res.json();
}

export async function fetchAgentCapabilities(type: string) {
  const res = await fetch(`${BASE_URL}/agents/${type}/capabilities`, {
    headers: defaultHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch agent capabilities");
  return res.json();
}
