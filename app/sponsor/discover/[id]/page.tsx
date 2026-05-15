import { getCreatorProfile } from "@/src/data/sponsor-creator-profile";
import { notFound } from "next/navigation";
import CreatorProfileClient from "./profile-client";

export const dynamic = "force-dynamic";

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getCreatorProfile(id);

  if (!data) {
    notFound();
  }

  return <CreatorProfileClient data={data} />;
}
