"use client";

import { AgentBadge } from "./AgentBadge";
import type { Message } from "../hooks/use-chat";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-start gap-3 px-4 py-2 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
          isUser ? "bg-blue-600 text-white" : "bg-gray-200"
        }`}
      >
        {isUser ? "U" : "🤖"}
      </div>

      {/* Message content */}
      <div className={`max-w-[70%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Agent badge */}
        {!isUser && message.intent && (
          <div className={`mb-1 ${isUser ? "text-right" : "text-left"}`}>
            <AgentBadge intent={message.intent} />
          </div>
        )}

        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-2.5 ${
            isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
          }`}
        >
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </p>

          {/* Streaming cursor */}
          {!isUser && message.content === "" && (
            <span className="inline-block h-4 w-1 animate-pulse bg-gray-400" />
          )}
        </div>

        {/* Timestamp */}
        <p
          className={`mt-1 text-xs text-gray-400 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
