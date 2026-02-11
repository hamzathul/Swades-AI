import ChatClient from "../../../components/ChatClient";
import { fetchConversation } from "../../../lib/conversation";

 

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const data = await fetchConversation(id);

  const initialMessages =
    data?.messages?.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })) ?? [];

  return (
    <ChatClient initialMessages={initialMessages} initialConversationId={id} />
  );
}
