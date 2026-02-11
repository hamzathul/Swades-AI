"use client";

import { useCallback } from "react";
import { ChatWindow } from "../components/ChatWindow";
import { ConversationList } from "../components/ConversationList";
import { useChat } from "../hooks/use-chat";
import { useConversations } from "../hooks/use-conversations";
import type { Message } from "../hooks/use-chat";

function ChatApp() {
  const chat = useChat();
  const convos = useConversations();

  const handleSelectConversation = useCallback(
    async (id: string) => {
      const data = await convos.loadConversation(id);
      if (!data) return;

      chat.setConversationId(data.id);
      chat.setMessages(
        data.messages.map(
          (m: {
            id: string;
            role: string;
            content: string;
            intent?: string;
            agentType?: string;
            createdAt: string;
          }): Message => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: m.content,
            intent: m.intent ?? undefined,
            agentType: m.agentType ?? undefined,
            createdAt: m.createdAt,
          }),
        ),
      );
    },
    [convos, chat],
  );

  const handleNewChat = useCallback(() => {
    chat.clearChat();
  }, [chat]);

  const handleSendMessage = useCallback(
    async (message: string) => {
      await chat.sendMessage(message);
      setTimeout(() => convos.loadConversations(), 500);
    },
    [chat, convos],
  );

  const handleDeleteConversation = useCallback(
    async (id: string) => {
      await convos.removeConversation(id);
      if (chat.conversationId === id) {
        chat.clearChat();
      }
    },
    [convos, chat],
  );

  return (
    <div className="flex h-screen bg-white">
      <aside className="hidden w-72 shrink-0 border-r md:block">
        <ConversationList
          conversations={convos.conversations}
          activeId={chat.conversationId}
          loading={convos.loading}
          onSelect={handleSelectConversation}
          onDelete={handleDeleteConversation}
          onNewChat={handleNewChat}
        />
      </aside>

      <main className="flex-1">
        <ChatWindow
          messages={chat.messages}
          isLoading={chat.isLoading}
          isStreaming={chat.isStreaming}
          thinking={chat.thinking}
          currentIntent={chat.currentIntent}
          onSendMessage={handleSendMessage}
          onStopStreaming={chat.stopStreaming}
        />
      </main>
    </div>
  );
}

export default function Page() {
  return <ChatApp />;
}
