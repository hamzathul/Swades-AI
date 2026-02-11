"use client";

import { useState, useCallback, useRef } from "react";
import { sendMessage as apiSendMessage } from "../lib/api";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  intent?: string;
  agentType?: string;
  createdAt: string;
}

const THINKING_PHRASES = [
  "Analyzing your request...",
  "Looking into this...",
  "Searching for information...",
  "Processing your query...",
  "Checking the details...",
];

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [thinking, setThinking] = useState<string | null>(null);
  const [currentIntent, setCurrentIntent] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      // Add user message immediately
      const userMessage: Message = {
        id: `temp-user-${Date.now()}`,
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setThinking(
        THINKING_PHRASES[Math.floor(Math.random() * THINKING_PHRASES.length)] ||
          null,
      );

      // Allow aborting
      abortRef.current = new AbortController();

      try {
        const res = await apiSendMessage(content, conversationId, true);
        const contentType = res.headers.get("content-type") || "";

        if (contentType.includes("text/event-stream")) {
          // ── SSE Streaming ──
          await handleStreamResponse(res);
        } else {
          // ── JSON (non-streaming fallback) ──
          const data = await res.json();

          setConversationId(data.data.conversationId);
          setCurrentIntent(data.data.intent);

          const assistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: data.data.reply,
            intent: data.data.intent,
            agentType: data.data.agentType,
            createdAt: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, assistantMessage]);
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") return;

        console.error("Chat error:", error);
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
        setThinking(null);
        abortRef.current = null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [conversationId],
  );

  const handleStreamResponse = useCallback(async (res: Response) => {
    setIsStreaming(true);

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    const assistantId = `assistant-${Date.now()}`;
    let fullContent = "";

    // Add empty assistant message placeholder
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
      },
    ]);

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process complete SSE lines
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep incomplete line in buffer

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;

        try {
          const data = JSON.parse(line.slice(6));

          switch (data.type) {
            case "metadata":
              setConversationId(data.conversationId);
              setCurrentIntent(data.intent);
              break;

            case "thinking":
              setThinking(data.message);
              break;

            case "text":
              setThinking(null);
              fullContent += data.content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: fullContent } : m,
                ),
              );
              break;

            case "done":
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? {
                        ...m,
                        content: data.fullText,
                        intent: data.intent,
                        agentType: data.intent,
                      }
                    : m,
                ),
              );
              break;

            case "error":
              console.error("Stream error:", data.message);
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: "An error occurred while processing." }
                    : m,
                ),
              );
              break;
          }
        } catch {
          // Skip malformed JSON
        }
      }
    }
  }, []);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setIsLoading(false);
    setThinking(null);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setCurrentIntent(null);
    setThinking(null);
  }, []);

  return {
    messages,
    isLoading,
    isStreaming,
    thinking,
    currentIntent,
    conversationId,
    sendMessage,
    stopStreaming,
    setConversationId,
    setMessages,
    clearChat,
  };
}
