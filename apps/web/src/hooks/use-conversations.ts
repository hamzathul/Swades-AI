"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchConversations,
  fetchConversation,
  deleteConversation as apiDeleteConversation,
} from "../lib/api";

export interface ConversationSummary {
  id: string;
  title: string | null;
  lastMessage: string | null;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export function useConversations() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchConversations();
      setConversations(res.data || []);
    } catch (err) {
      setError("Failed to load conversations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadConversation = useCallback(async (id: string) => {
    try {
      const res = await fetchConversation(id);
      return res.data;
    } catch (err) {
      console.error("Failed to load conversation:", err);
      return null;
    }
  }, []);

  const removeConversation = useCallback(async (id: string) => {
    try {
      await apiDeleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    loading,
    error,
    loadConversations,
    loadConversation,
    removeConversation,
  };
}
