"use client";

import { useRouter } from "next/navigation";
import { deleteConversation } from "../lib/conversation";
 
export default function DeleteConversationButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    await deleteConversation(id);
    router.refresh();
  }

  return (
    <button onClick={handleDelete} className="text-red-500 text-xs">
      ✕
    </button>
  );
}
