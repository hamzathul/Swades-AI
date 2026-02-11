export async function sendMessage(data: {
  userId: string;
  conversationId: string | null;
  message: string;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/chat/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!res.ok) throw new Error("Failed to send message");

  return res.json();
}
