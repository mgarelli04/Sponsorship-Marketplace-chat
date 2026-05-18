export interface Creator {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  tagline: string;
  category: string;
  location: string;
  verified: boolean;
  about: string;
  audienceSize: number;
  matchScore?: number;
  demographics: {
    ageGroups: { label: string; value: number }[];
    gender: { label: string; value: number }[];
    topLocations: { city: string; percentage: number }[];
    interests: string[];
    returningAttendees: number;
  };
  pastEvents: {
    name: string;
    date: string;
    city: string;
    attendance: number;
    checkIns: number;
    category: string;
  }[];
  previousSponsors: { name: string; logo: string; metric: string }[];
  packages: {
    tier: string;
    price: number;
    impressions: number;
    reach: number;
    cpm: number;
    benefits: string[];
  }[];
  inventory: string[];
  lastUpdated: string;
}

export interface SponsorLead {
  id: string;
  sponsorName: string;
  sponsorLogo: string;
  company: string;
  package: string;
  budget: string;
  goal: string;
  dateSubmitted: string;
  status: "pending" | "negotiating" | "closed_won" | "closed_lost";
  contactPerson: string;
  email: string;
  notes: string;
  eventDate: string;
}

export const creators: Creator[] = [
  {
    id: "1",
    name: "Neon Nights Festival",
    logo: "🎵",
    coverImage: "",
    tagline: "California's premier electronic music experience",
    category: "Music Festival",
    location: "Los Angeles, CA",
    verified: true,
    about: "Neon Nights brings together 15,000+ electronic music fans for a 3-day immersive experience featuring world-class DJs, interactive art installations, and brand activation zones. Our audience is highly engaged, affluent, and digitally connected.",
    audienceSize: 15000,
    matchScore: 94,
    demographics: {
      ageGroups: [
        { label: "18-24", value: 35 },
        { label: "25-34", value: 40 },
        { label: "35-44", value: 18 },
        { label: "45+", value: 7 },
      ],
      gender: [
        { label: "Male", value: 52 },
        { label: "Female", value: 44 },
        { label: "Non-binary", value: 4 },
      ],
      topLocations: [
        { city: "Los Angeles", percentage: 35 },
        { city: "San Francisco", percentage: 20 },
        { city: "San Diego", percentage: 15 },
        { city: "Las Vegas", percentage: 10 },
      ],
      interests: ["Electronic Music", "Nightlife", "Fashion", "Tech", "Fitness"],
      returningAttendees: 62,
    },
    pastEvents: [
      { name: "Neon Nights Summer 2024", date: "2024-07-15", city: "Los Angeles", attendance: 15200, checkIns: 14800, category: "Music" },
      { name: "Neon Nights NYE 2024", date: "2023-12-31", city: "Los Angeles", attendance: 8500, checkIns: 8200, category: "Music" },
      { name: "Neon Nights Spring 2024", date: "2024-03-20", city: "San Diego", attendance: 6000, checkIns: 5700, category: "Music" },
    ],
    previousSponsors: [
      { name: "Red Bull", logo: "🐂", metric: "2.3M social impressions" },
      { name: "Samsung", logo: "📱", metric: "45K booth interactions" },
      { name: "Spotify", logo: "🎧", metric: "12K app downloads" },
    ],
    packages: [
      { tier: "Bronze", price: 5000, impressions: 50000, reach: 15000, cpm: 100, benefits: ["Logo on event website", "Social media mention", "Banner placement"] },
      { tier: "Silver", price: 15000, impressions: 200000, reach: 45000, cpm: 75, benefits: ["Stage mentions", "Branded lounge area", "Email blast inclusion", "VIP passes (10)", "Social content package"] },
      { tier: "Gold", price: 35000, impressions: 500000, reach: 120000, cpm: 70, benefits: ["Title sponsorship opportunity", "Main stage branding", "Exclusive activation zone", "Full media package", "VIP passes (25)", "Post-event report"] },
    ],
    inventory: ["Main stage branding", "VIP lounge naming", "Lanyard sponsorship", "Digital screens", "Branded water stations", "After-party sponsorship"],
    lastUpdated: "2025-03-05",
  },
  {
    id: "2",
    name: "TechForward Summit",
    logo: "💻",
    coverImage: "",
    tagline: "Where innovation meets investment",
    category: "Tech Conference",
    location: "Austin, TX",
    verified: true,
    about: "TechForward Summit is the leading B2B technology conference in the Southwest, connecting 3,000+ startup founders, investors, and enterprise decision-makers. Our attendees have an average household income of $150K+ and are active technology buyers.",
    audienceSize: 3200,
    matchScore: 87,
    demographics: {
      ageGroups: [
        { label: "18-24", value: 15 },
        { label: "25-34", value: 45 },
        { label: "35-44", value: 28 },
        { label: "45+", value: 12 },
      ],
      gender: [
        { label: "Male", value: 58 },
        { label: "Female", value: 38 },
        { label: "Non-binary", value: 4 },
      ],
      topLocations: [
        { city: "Austin", percentage: 40 },
        { city: "Dallas", percentage: 15 },
        { city: "Houston", percentage: 12 },
        { city: "San Francisco", percentage: 10 },
      ],
      interests: ["SaaS", "AI/ML", "Venture Capital", "Startups", "Cloud"],
      returningAttendees: 48,
    },
    pastEvents: [
      { name: "TechForward 2024", date: "2024-09-10", city: "Austin", attendance: 3200, checkIns: 3050, category: "Tech" },
      { name: "TechForward AI Day", date: "2024-04-15", city: "Austin", attendance: 1200, checkIns: 1150, category: "Tech" },
    ],
    previousSponsors: [
      { name: "AWS", logo: "☁️", metric: "1,500 booth leads" },
      { name: "Stripe", logo: "💳", metric: "850 demo signups" },
    ],
    packages: [
      { tier: "Bronze", price: 3000, impressions: 25000, reach: 3200, cpm: 120, benefits: ["Logo on website", "Attendee list access", "1 exhibit table"] },
      { tier: "Silver", price: 10000, impressions: 80000, reach: 10000, cpm: 125, benefits: ["Panel speaking slot", "Branded session", "Email sponsorship", "5 VIP passes"] },
      { tier: "Gold", price: 25000, impressions: 200000, reach: 30000, cpm: 125, benefits: ["Keynote intro", "Premium booth", "Full lead capture", "Dinner sponsorship", "Content partnership"] },
    ],
    inventory: ["Keynote stage", "Workshop rooms", "Networking lounge", "Badge lanyards", "Mobile app", "Lunch sponsorship"],
    lastUpdated: "2025-03-01",
  },
  {
    id: "3",
    name: "EduConnect Global",
    logo: "📚",
    coverImage: "",
    tagline: "Empowering the future of learning",
    category: "Education",
    location: "Madrid, Spain",
    verified: true,
    about: "EduConnect Global brings together 2,000+ education leaders, edtech companies, and policymakers from 40+ countries. Our conferences focus on digital transformation in education, making it the perfect platform for brands targeting the education sector.",
    audienceSize: 2000,
    matchScore: 76,
    demographics: {
      ageGroups: [
        { label: "18-24", value: 10 },
        { label: "25-34", value: 30 },
        { label: "35-44", value: 35 },
        { label: "45+", value: 25 },
      ],
      gender: [
        { label: "Male", value: 45 },
        { label: "Female", value: 52 },
        { label: "Non-binary", value: 3 },
      ],
      topLocations: [
        { city: "Madrid", percentage: 25 },
        { city: "Barcelona", percentage: 15 },
        { city: "London", percentage: 12 },
        { city: "Berlin", percentage: 8 },
      ],
      interests: ["EdTech", "K-12", "Higher Ed", "E-Learning", "Policy"],
      returningAttendees: 55,
    },
    pastEvents: [
      { name: "EduConnect 2024", date: "2024-11-05", city: "Madrid", attendance: 2100, checkIns: 1950, category: "Education" },
      { name: "EduConnect Spring", date: "2024-05-20", city: "Barcelona", attendance: 1400, checkIns: 1300, category: "Education" },
    ],
    previousSponsors: [
      { name: "Google Education", logo: "🎓", metric: "2,800 platform signups" },
      { name: "Microsoft", logo: "🪟", metric: "1,200 trial activations" },
    ],
    packages: [
      { tier: "Bronze", price: 2500, impressions: 20000, reach: 2000, cpm: 125, benefits: ["Logo placement", "Social mention", "Brochure distribution"] },
      { tier: "Silver", price: 8000, impressions: 60000, reach: 8000, cpm: 133, benefits: ["Workshop sponsorship", "Branded content", "Lead capture", "3 VIP passes"] },
      { tier: "Gold", price: 20000, impressions: 150000, reach: 25000, cpm: 133, benefits: ["Platinum visibility", "Keynote branding", "Full activation", "Dedicated session", "10 VIP passes"] },
    ],
    inventory: ["Workshop rooms", "Exhibition hall", "Badge sponsorship", "Welcome reception", "Mobile app", "Lunch area"],
    lastUpdated: "2025-02-28",
  },
  {
    id: "4",
    name: "Urban Bites Festival",
    logo: "🍔",
    coverImage: "",
    tagline: "Street food meets street culture",
    category: "Food & Culture",
    location: "Brooklyn, NY",
    verified: true,
    about: "Urban Bites is a 2-day celebration of street food, local artisans, and emerging music acts. We attract 8,000+ young professionals who care about sustainability, local brands, and authentic experiences.",
    audienceSize: 8000,
    matchScore: 82,
    demographics: {
      ageGroups: [
        { label: "18-24", value: 28 },
        { label: "25-34", value: 45 },
        { label: "35-44", value: 20 },
        { label: "45+", value: 7 },
      ],
      gender: [
        { label: "Male", value: 46 },
        { label: "Female", value: 50 },
        { label: "Non-binary", value: 4 },
      ],
      topLocations: [
        { city: "New York", percentage: 55 },
        { city: "New Jersey", percentage: 15 },
        { city: "Philadelphia", percentage: 8 },
        { city: "Boston", percentage: 5 },
      ],
      interests: ["Food", "Sustainability", "Local Brands", "Live Music", "Art"],
      returningAttendees: 70,
    },
    pastEvents: [
      { name: "Urban Bites Summer 2024", date: "2024-08-10", city: "Brooklyn", attendance: 8200, checkIns: 7900, category: "Food" },
      { name: "Urban Bites Fall 2023", date: "2023-10-14", city: "Brooklyn", attendance: 6500, checkIns: 6200, category: "Food" },
    ],
    previousSponsors: [
      { name: "Oatly", logo: "🥛", metric: "15K samples distributed" },
      { name: "Hendrick's Gin", logo: "🍸", metric: "4.2K cocktail servings" },
    ],
    packages: [
      { tier: "Bronze", price: 3500, impressions: 40000, reach: 8000, cpm: 87, benefits: ["Booth space", "Logo on signage", "Social mention"] },
      { tier: "Silver", price: 12000, impressions: 150000, reach: 25000, cpm: 80, benefits: ["Branded food station", "Stage shoutouts", "Content creation", "5 VIP passes"] },
      { tier: "Gold", price: 28000, impressions: 400000, reach: 80000, cpm: 70, benefits: ["Title sponsorship", "Exclusive zone", "Full brand immersion", "15 VIP passes", "Post-event content"] },
    ],
    inventory: ["Main stage", "Food court area", "Art installation zone", "VIP garden", "Entrance arch", "Merch collaboration"],
    lastUpdated: "2025-03-07",
  },
  {
    id: "5",
    name: "Wellness Collective",
    logo: "🧘",
    coverImage: "",
    tagline: "Mind, body, and brand alignment",
    category: "Health & Wellness",
    location: "Denver, CO",
    verified: false,
    about: "Wellness Collective is a boutique wellness retreat and expo bringing together 1,500 health-conscious consumers. Perfect for brands in fitness, nutrition, mental health, and sustainable living.",
    audienceSize: 1500,
    matchScore: 71,
    demographics: {
      ageGroups: [
        { label: "18-24", value: 20 },
        { label: "25-34", value: 38 },
        { label: "35-44", value: 30 },
        { label: "45+", value: 12 },
      ],
      gender: [
        { label: "Male", value: 30 },
        { label: "Female", value: 65 },
        { label: "Non-binary", value: 5 },
      ],
      topLocations: [
        { city: "Denver", percentage: 45 },
        { city: "Boulder", percentage: 20 },
        { city: "Colorado Springs", percentage: 10 },
        { city: "Salt Lake City", percentage: 5 },
      ],
      interests: ["Yoga", "Nutrition", "Mental Health", "Fitness", "Sustainability"],
      returningAttendees: 58,
    },
    pastEvents: [
      { name: "Wellness Collective 2024", date: "2024-06-01", city: "Denver", attendance: 1500, checkIns: 1420, category: "Wellness" },
    ],
    previousSponsors: [
      { name: "Lululemon", logo: "🏃", metric: "800 in-store visits" },
    ],
    packages: [
      { tier: "Bronze", price: 2000, impressions: 15000, reach: 1500, cpm: 133, benefits: ["Booth space", "Logo on materials", "Social post"] },
      { tier: "Silver", price: 6000, impressions: 45000, reach: 5000, cpm: 133, benefits: ["Workshop sponsorship", "Product sampling", "Email inclusion", "3 VIP passes"] },
      { tier: "Gold", price: 15000, impressions: 100000, reach: 15000, cpm: 150, benefits: ["Title sponsorship", "Branded wellness zone", "Full content package", "8 VIP passes"] },
    ],
    inventory: ["Yoga pavilion", "Smoothie bar", "Meditation garden", "Workshop tent", "Welcome bags", "Digital screens"],
    lastUpdated: "2025-02-15",
  },
];

export const sponsorLeads: SponsorLead[] = [
  {
    id: "l1",
    sponsorName: "Nike",
    sponsorLogo: "✓",
    company: "Nike Inc.",
    package: "Gold",
    budget: "$30,000 - $50,000",
    goal: "Brand Awareness",
    dateSubmitted: "2025-03-07",
    status: "pending",
    contactPerson: "Sarah Chen",
    email: "sarah.chen@nike.com",
    notes: "Interested in exclusive activation zone for new running shoe launch. Want to integrate AR experience.",
    eventDate: "2025-07-15",
  },
  {
    id: "l2",
    sponsorName: "Spotify",
    sponsorLogo: "🎧",
    company: "Spotify AB",
    package: "Silver",
    budget: "$10,000 - $20,000",
    goal: "Lead Generation",
    dateSubmitted: "2025-03-05",
    status: "negotiating",
    contactPerson: "Marcus Johnson",
    email: "m.johnson@spotify.com",
    notes: "Want to promote new podcast feature. Looking for stage mentions and branded listening stations.",
    eventDate: "2025-07-15",
  },
  {
    id: "l3",
    sponsorName: "Red Bull",
    sponsorLogo: "🐂",
    company: "Red Bull GmbH",
    package: "Gold",
    budget: "$40,000 - $60,000",
    goal: "Community Building",
    dateSubmitted: "2025-02-28",
    status: "closed_won",
    contactPerson: "Lisa Mueller",
    email: "l.mueller@redbull.com",
    notes: "Returning sponsor. Wants expanded activation area and exclusive after-party branding.",
    eventDate: "2025-07-15",
  },
  {
    id: "l4",
    sponsorName: "Coinbase",
    sponsorLogo: "₿",
    company: "Coinbase Global",
    package: "Bronze",
    budget: "$3,000 - $5,000",
    goal: "Product Launch",
    dateSubmitted: "2025-02-20",
    status: "closed_lost",
    contactPerson: "James Park",
    email: "j.park@coinbase.com",
    notes: "Budget too low for their desired visibility. Suggested partnership for next smaller event.",
    eventDate: "2025-07-15",
  },
  {
    id: "l5",
    sponsorName: "Adidas",
    sponsorLogo: "👟",
    company: "Adidas AG",
    package: "Silver",
    budget: "$15,000 - $25,000",
    goal: "Brand Awareness",
    dateSubmitted: "2025-03-08",
    status: "pending",
    contactPerson: "Emma Wilson",
    email: "e.wilson@adidas.com",
    notes: "First-time sponsor. Interested in youth audience demographics. Wants product activation zone.",
    eventDate: "2025-07-15",
  },
];

export const adminStats = {
  totalCreators: 247,
  totalSponsors: 1840,
  verifiedMediaKits: 189,
  totalLeads: 3420,
  conversionRate: 23.5,
  topCategories: [
    { name: "Music Festivals", count: 78 },
    { name: "Tech Conferences", count: 52 },
    { name: "Food & Culture", count: 41 },
    { name: "Education", count: 35 },
    { name: "Health & Wellness", count: 28 },
    { name: "Sports", count: 13 },
  ],
  topGeographies: [
    { name: "California", count: 45 },
    { name: "New York", count: 38 },
    { name: "Texas", count: 29 },
    { name: "Spain", count: 18 },
    { name: "UK", count: 15 },
  ],
  monthlyLeads: [
    { month: "Oct", leads: 180 },
    { month: "Nov", leads: 220 },
    { month: "Dec", leads: 150 },
    { month: "Jan", leads: 310 },
    { month: "Feb", leads: 380 },
    { month: "Mar", leads: 420 },
  ],
  conversionFunnel: [
    { stage: "Profile Views", count: 12400 },
    { stage: "Inquiry Started", count: 3420 },
    { stage: "Negotiating", count: 1560 },
    { stage: "Closed Won", count: 803 },
  ],
};
