import { redirect } from "next/navigation";

export default function Page() {
  const id = crypto.randomUUID();
  redirect(`/chat/${id}`);
}
