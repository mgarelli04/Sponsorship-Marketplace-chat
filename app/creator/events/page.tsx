import { redirect } from "next/navigation";
import { getCurrentChatUser } from "@/src/chat/session";
import { getCreatorEventsData } from "@/src/creator/events";
import CreatorEventsClient from "./events-client";

export const dynamic = "force-dynamic";

export default async function CreatorEventsPage() {
  const user = await getCurrentChatUser().catch(() => null);

  if (!user || user.role !== "creator" || !user.email) {
    redirect("/creator/login");
  }

  const data = await getCreatorEventsData({
    userId: user.id,
    email: user.email,
    fullName: user.name,
  });

  return (
    <CreatorEventsClient
      initialEvents={data.events}
      categories={data.categories}
      creator={data.creator}
    />
  );
}
