export type AudienceType = "B2C" | "B2B";

export type CreatorPackage = {
  tier: "Bronze" | "Silver" | "Gold";
  price: number;
  impressions: number;
  reach: number;
  cpm: number;
  benefits: string[];
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
  packages: CreatorPackage[];
};

export const marketplaceCreators: MarketplaceCreator[] = [
  {
    id: "neon-nights-festival",
    logo: "🎵",
    name: "Neon Nights Festival",
    tagline: "California's premier electronic music experience",
    location: "Los Angeles, CA",
    city: "Los Angeles",
    region: "California",
    country: "US",
    category: "Music Festival",
    audienceSize: 15000,
    matchScore: 94,
    verified: true,
    audienceTypes: ["B2C"],
    interests: ["Electronic Music", "Nightlife", "Fashion", "Tech", "Fitness"],
    returningAttendees: 62,
    checkInRate: 97,
    responseTimeHours: 18,
    lastUpdated: "2025-03-05",
    previousSponsors: ["Red Bull", "Samsung", "Spotify"],
    packages: [
      {
        tier: "Bronze",
        price: 5000,
        impressions: 50000,
        reach: 15000,
        cpm: 100,
        benefits: ["Logo on event website", "Social media mention", "Banner placement"],
      },
      {
        tier: "Silver",
        price: 15000,
        impressions: 200000,
        reach: 45000,
        cpm: 75,
        benefits: ["Stage mentions", "Branded lounge area", "Email blast inclusion"],
      },
      {
        tier: "Gold",
        price: 35000,
        impressions: 500000,
        reach: 120000,
        cpm: 70,
        benefits: ["Title sponsorship", "Main stage branding", "Full media package"],
      },
    ],
  },
  {
    id: "techforward-summit",
    logo: "💻",
    name: "TechForward Summit",
    tagline: "Where innovation meets investment",
    location: "Austin, TX",
    city: "Austin",
    region: "Texas",
    country: "US",
    category: "Tech Conference",
    audienceSize: 3200,
    matchScore: 87,
    verified: true,
    audienceTypes: ["B2B"],
    interests: ["SaaS", "AI/ML", "Venture Capital", "Startups", "Cloud"],
    returningAttendees: 48,
    checkInRate: 95,
    responseTimeHours: 24,
    lastUpdated: "2025-03-01",
    previousSponsors: ["AWS", "Stripe"],
    packages: [
      {
        tier: "Bronze",
        price: 3000,
        impressions: 25000,
        reach: 3200,
        cpm: 120,
        benefits: ["Logo on website", "Attendee list access", "Exhibit table"],
      },
      {
        tier: "Silver",
        price: 10000,
        impressions: 80000,
        reach: 10000,
        cpm: 125,
        benefits: ["Panel speaking slot", "Branded session", "Email sponsorship"],
      },
      {
        tier: "Gold",
        price: 25000,
        impressions: 200000,
        reach: 30000,
        cpm: 125,
        benefits: ["Keynote intro", "Premium booth", "Full lead capture"],
      },
    ],
  },
  {
    id: "educonnect-global",
    logo: "📚",
    name: "EduConnect Global",
    tagline: "Empowering the future of learning",
    location: "Madrid, Spain",
    city: "Madrid",
    region: "Madrid",
    country: "ES",
    category: "Education",
    audienceSize: 2000,
    matchScore: 76,
    verified: true,
    audienceTypes: ["B2B", "B2C"],
    interests: ["EdTech", "K-12", "Higher Ed", "E-Learning", "Policy"],
    returningAttendees: 55,
    checkInRate: 93,
    responseTimeHours: 30,
    lastUpdated: "2025-02-28",
    previousSponsors: ["Google Education", "Microsoft"],
    packages: [
      {
        tier: "Bronze",
        price: 2500,
        impressions: 20000,
        reach: 2000,
        cpm: 125,
        benefits: ["Logo placement", "Social mention", "Brochure distribution"],
      },
      {
        tier: "Silver",
        price: 8000,
        impressions: 60000,
        reach: 8000,
        cpm: 133,
        benefits: ["Workshop sponsorship", "Branded content", "Lead capture"],
      },
      {
        tier: "Gold",
        price: 20000,
        impressions: 150000,
        reach: 25000,
        cpm: 133,
        benefits: ["Keynote branding", "Full activation", "Dedicated session"],
      },
    ],
  },
  {
    id: "urban-bites-festival",
    logo: "🍔",
    name: "Urban Bites Festival",
    tagline: "Street food meets street culture",
    location: "Brooklyn, NY",
    city: "Brooklyn",
    region: "New York",
    country: "US",
    category: "Food & Culture",
    audienceSize: 8000,
    matchScore: 82,
    verified: true,
    audienceTypes: ["B2C"],
    interests: ["Food", "Sustainability", "Local Brands", "Live Music", "Art"],
    returningAttendees: 70,
    checkInRate: 96,
    responseTimeHours: 20,
    lastUpdated: "2025-03-07",
    previousSponsors: ["Oatly", "Hendrick's Gin"],
    packages: [
      {
        tier: "Bronze",
        price: 3500,
        impressions: 40000,
        reach: 8000,
        cpm: 87,
        benefits: ["Booth space", "Logo on signage", "Social mention"],
      },
      {
        tier: "Silver",
        price: 12000,
        impressions: 150000,
        reach: 25000,
        cpm: 80,
        benefits: ["Branded food station", "Stage shoutouts", "Content creation"],
      },
      {
        tier: "Gold",
        price: 28000,
        impressions: 400000,
        reach: 80000,
        cpm: 70,
        benefits: ["Title sponsorship", "Exclusive zone", "Brand immersion"],
      },
    ],
  },
  {
    id: "wellness-collective",
    logo: "🧘",
    name: "Wellness Collective",
    tagline: "Mind, body, and brand alignment",
    location: "Denver, CO",
    city: "Denver",
    region: "Colorado",
    country: "US",
    category: "Health & Wellness",
    audienceSize: 1500,
    matchScore: 71,
    verified: false,
    audienceTypes: ["B2C", "B2B"],
    interests: ["Yoga", "Nutrition", "Mental Health", "Fitness", "Sustainability"],
    returningAttendees: 58,
    checkInRate: 94,
    responseTimeHours: 36,
    lastUpdated: "2025-02-15",
    previousSponsors: ["Lululemon"],
    packages: [
      {
        tier: "Bronze",
        price: 2000,
        impressions: 15000,
        reach: 1500,
        cpm: 133,
        benefits: ["Booth space", "Logo on materials", "Social post"],
      },
      {
        tier: "Silver",
        price: 6000,
        impressions: 45000,
        reach: 5000,
        cpm: 133,
        benefits: ["Workshop sponsorship", "Product sampling", "Email inclusion"],
      },
      {
        tier: "Gold",
        price: 15000,
        impressions: 100000,
        reach: 15000,
        cpm: 150,
        benefits: ["Title sponsorship", "Wellness zone", "Content package"],
      },
    ],
  },
];

export const marketplaceCategories = [
  "All",
  "Music Festival",
  "Tech Conference",
  "Education",
  "Food & Culture",
  "Health & Wellness",
] as const;

export const suggestedSponsorSearches = [
  "Music festivals in California with 2000+ attendees",
  "Tech conferences in Austin targeting Gen Z",
  "Education events in Madrid with verified audience data",
];
