import ConversationSidebar from "../../components/ConversationSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <ConversationSidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
