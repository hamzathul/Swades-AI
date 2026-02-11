"use client";

import { useState } from "react";
import { sendMessage } from "../lib/api";

type Msg = {
  role: "user" | "assistant";
  content: string;
};

const USER_ID = "demo-user";

export default function ChatClient({
  initialMessages,
  initialConversationId,
}: {
  initialMessages: Msg[];
  initialConversationId: string;
}) {
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(
    initialConversationId,
  );
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await sendMessage({
        userId: USER_ID,
        conversationId,
        message: userMessage,
      });

      // backend may create new conversation
      if (res.conversationId !== conversationId) {
        window.history.replaceState({}, "", `/chat/${res.conversationId}`);
        setConversationId(res.conversationId);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Server error" },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Support</h1>

      <div className="flex-1 overflow-y-auto space-y-4 border rounded p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg ${
              m.role === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div className="text-sm text-gray-500 italic">Agent is typing...</div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about orders, billing, support..."
        />
        <button
          onClick={handleSend}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
