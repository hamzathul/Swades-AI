import Link from "next/link";
import DeleteConversationButton from "./DeleteConversationButton";
import { fetchConversations } from "../lib/conversation";
import { ConversationPreview } from "../types/conversation";

const USER_ID = "demo-user";

export default async function ConversationSidebar() {
  const convos: ConversationPreview[] = await fetchConversations(USER_ID);

  return (
    <div className="w-72 border-r h-screen p-3 space-y-2">
      <h2 className="font-bold">Conversations</h2>

      {convos.map((c) => (
        <div
          key={c.id}
          className="flex justify-between items-center p-2 rounded hover:bg-gray-100 hover:text-black"
        >
          <Link href={`/chat/${c.id}`} className="flex-1 truncate">
            {c.messages?.[0]?.content ?? "New conversation"}
          </Link>

          <DeleteConversationButton id={c.id} />
        </div>
      ))}
    </div>
  );
}
