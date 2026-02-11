const API = process.env.NEXT_PUBLIC_API_URL;

export async function fetchConversations(userId: string) {
  const res = await fetch(`${API}/api/chat/conversations?userId=${userId}`);
  return res.json();
}

export async function fetchConversation(id: string) {
  const res = await fetch(`${API}/api/chat/conversations/${id}`);
  return res.json();
}

export async function deleteConversation(id: string) {
  await fetch(`${API}/api/chat/conversations/${id}`, { method: "DELETE" });
}
