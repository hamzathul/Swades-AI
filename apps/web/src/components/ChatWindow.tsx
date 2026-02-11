"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { AgentBadge } from "./AgentBadge";
import type { Message } from "../hooks/use-chat";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  thinking: string | null;
  currentIntent: string | null;
  onSendMessage: (message: string) => void;
  onStopStreaming: () => void;
}

const SUGGESTIONS = [
  "Where is my order?",
  "Show my invoices",
  "I need a refund",
  "Help with my account",
  "What are my recent orders?",
  "Do I have any unpaid bills?",
];

export function ChatWindow({
  messages,
  isLoading,
  isStreaming,
  thinking,
  currentIntent,
  onSendMessage,
  onStopStreaming,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading || isStreaming) return;
    onSendMessage(trimmed);
    setInput("");
  };

  const handleSuggestion = (suggestion: string) => {
    if (isLoading || isStreaming) return;
    onSendMessage(suggestion);
  };

  const isDisabled = isLoading || isStreaming;

  return (
    <div className="flex h-full flex-col">
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            AI Customer Support
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            {currentIntent ? (
              <>
                <span className="text-sm text-gray-500">Handled by</span>
                <AgentBadge intent={currentIntent} size="sm" />
              </>
            ) : (
              <span className="text-sm text-gray-500">
                Ask me anything about orders, billing, or support
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isStreaming && (
            <button
              onClick={onStopStreaming}
              className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
            >
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
              Stop
            </button>
          )}

          {isStreaming && (
            <span className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              Streaming
            </span>
          )}
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto bg-white py-4">
        {/* Empty state */}
        {messages.length === 0 && !isLoading && (
          <div className="flex h-full flex-col items-center justify-center px-4">
            <div className="mb-4 text-5xl">🤖</div>
            <h2 className="text-xl font-semibold text-gray-900">
              How can I help you today?
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              I can help with orders, billing, and general support
            </p>

            {/* Suggestion chips */}
            <div className="mt-6 flex max-w-lg flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestion(suggestion)}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message list */}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {isLoading && thinking && <TypingIndicator message={thinking} />}

        <div ref={scrollRef} />
      </div>

      {/* ── Input ── */}
      <div className="border-t bg-white px-4 py-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isDisabled ? "Waiting for response..." : "Type your message..."
              }
              disabled={isDisabled}
              className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm transition placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isDisabled}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
