import SponsorSavedClient from "./saved-client";
import { getSponsorDiscoverData } from "@/src/data/sponsor-discover-db";

export const dynamic = "force-dynamic";

export default async function SponsorSaved() {
  const discoverData = await getSponsorDiscoverData();

  return (
    <SponsorSavedClient
      creators={discoverData.creators}
      categories={discoverData.categories}
      sourceStatus={discoverData.sourceStatus}
      sourceMessage={discoverData.sourceMessage}
    />
  );
}
