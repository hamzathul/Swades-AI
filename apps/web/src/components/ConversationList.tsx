"use client";

import type { ConversationSummary } from "../hooks/use-conversations";

interface ConversationListProps {
  conversations: ConversationSummary[];
  activeId: string | null;
  loading: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNewChat: () => void;
}

export function ConversationList({
  conversations,
  activeId,
  loading,
  onSelect,
  onDelete,
  onNewChat,
}: ConversationListProps) {
  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* Header */}
      <div className="border-b p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Conversations
        </h2>
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 active:bg-blue-800"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Chat
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          </div>
        )}

        {!loading && conversations.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-gray-400">No conversations yet</p>
            <p className="mt-1 text-xs text-gray-400">
              Start a new chat to begin
            </p>
          </div>
        )}

        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`group relative cursor-pointer border-b border-gray-100 px-4 py-3 transition hover:bg-gray-100 ${
              activeId === conv.id
                ? "border-l-2 border-l-blue-600 bg-blue-50"
                : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1 pr-2">
                <p className="truncate text-sm font-medium text-gray-900">
                  {conv.title || "New Conversation"}
                </p>
                <p className="mt-0.5 truncate text-xs text-gray-500">
                  {conv.lastMessage || "No messages yet"}
                </p>
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conv.id);
                }}
                className="hidden shrink-0 rounded p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500 group-hover:block"
                title="Delete conversation"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {conv.messageCount} messages
              </span>
              <span className="text-xs text-gray-300">·</span>
              <span className="text-xs text-gray-400">
                {new Date(conv.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
