import SponsorDiscoverClient from "./discover-client";
import { getSponsorDiscoverData } from "@/src/data/sponsor-discover-db";

export const dynamic = "force-dynamic";

export default async function SponsorDiscover() {
  const discoverData = await getSponsorDiscoverData();

  return (
    <SponsorDiscoverClient
      creators={discoverData.creators}
      categories={discoverData.categories}
      sourceStatus={discoverData.sourceStatus}
      sourceMessage={discoverData.sourceMessage}
    />
  );
}
