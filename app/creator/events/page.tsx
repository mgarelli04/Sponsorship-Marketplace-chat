import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/auth/options";
import { getCreatorEventsData } from "@/src/creator/events";
import CreatorEventsClient from "./events-client";

export const dynamic = "force-dynamic";

export default async function CreatorEventsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "creator" || !session.user.email) {
    redirect("/creator/login");
  }

  const data = await getCreatorEventsData({
    userId: session.user.id,
    email: session.user.email,
    fullName: session.user.name,
  });

  return (
    <CreatorEventsClient
      initialEvents={data.events}
      categories={data.categories}
      creator={data.creator}
    />
  );
}
