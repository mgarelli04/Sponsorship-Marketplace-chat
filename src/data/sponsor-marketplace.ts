export type AudienceType = "B2C" | "B2B";

export type CreatorPackage = {
  id?: string;
  tier: "Bronze" | "Silver" | "Gold";
  price: number;
  impressions: number;
  reach: number;
  cpm: number;
  benefits: string[];
  items: { name: string; description: string }[];
};

export type MarketplaceCreator = {
  id: string;
  logo: string;
  name: string;
  tagline: string;
  location: string;
  city: string;
  region: string;
  country: string;
  category: string;
  audienceSize: number;
  matchScore: number;
  verified: boolean;
  audienceTypes: AudienceType[];
  interests: string[];
  returningAttendees: number;
  checkInRate: number;
  responseTimeHours: number;
  lastUpdated: string;
  previousSponsors: string[];
  eventSearchTerms: string[];
  packages: CreatorPackage[];
};

export type DiscoverDataSourceStatus = "connected" | "missing-env" | "query-error";

export type DiscoverData = {
  creators: MarketplaceCreator[];
  categories: string[];
  sourceStatus: DiscoverDataSourceStatus;
  sourceMessage?: string;
};

export const suggestedSponsorSearches = [
  "Music festivals in California with 2000+ attendees",
  "Tech conferences in Austin targeting Gen Z",
  "Education events in Madrid with verified audience data",
];
