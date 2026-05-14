import SponsorHistoryClient from "./history-client";
import { getSponsorDiscoverData } from "@/src/data/sponsor-discover-db";

export const dynamic = "force-dynamic";

export default async function SponsorHistory() {
  const discoverData = await getSponsorDiscoverData();

  return (
    <SponsorHistoryClient
      creators={discoverData.creators}
      sourceStatus={discoverData.sourceStatus}
      sourceMessage={discoverData.sourceMessage}
    />
  );
}
