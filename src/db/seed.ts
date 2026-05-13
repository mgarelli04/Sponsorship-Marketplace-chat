/**
 * Script que rellena la base de datos con datos de demo.
 * npm run db:seed
 */
import db, { queryClient } from './db';
import {
	audienceSnapshots,
	categories,
	creatorCategories,
	creatorInterests,
	creatorPastSponsors,
	creators,
	creatorsAssets,
	creatorsMediaKit,
	events,
	interests,
	inventoryItems,
	packageItems,
	packages,
	profiles,
	sponsorCompanies,
	sponsorSavedCreators,
	sponsorshipInquiries,
} from './schema';

type SeedRole = 'creator' | 'sponsor';

type SeedAuthInput = {
	email: string;
	fullName: string;
	role: SeedRole;
};

type SeedAuthUser = SeedAuthInput & {
	id: string;
};

const uuid = (group: number, index: number) =>
	`00000000-0000-4000-${(0x8000 + group).toString(16)}-${index.toString(16).padStart(12, '0')}`;

const now = new Date('2026-05-13T10:00:00.000Z');
const seedUserPassword = process.env.SEED_USER_PASSWORD ?? 'SeedPass123!';

const categorySeed = [
	{ id: uuid(1, 1), name: 'Seed Music', slug: 'seed-music' },
	{ id: uuid(1, 2), name: 'Seed Technology', slug: 'seed-technology' },
	{ id: uuid(1, 3), name: 'Seed Education', slug: 'seed-education' },
	{ id: uuid(1, 4), name: 'Seed Sports', slug: 'seed-sports' },
	{ id: uuid(1, 5), name: 'Seed Food and Beverage', slug: 'seed-food-beverage' },
	{ id: uuid(1, 6), name: 'Seed Gaming', slug: 'seed-gaming' },
	{ id: uuid(1, 7), name: 'Seed Wellness', slug: 'seed-wellness' },
	{ id: uuid(1, 8), name: 'Seed Business', slug: 'seed-business' },
];

const interestSeed = [
	{ id: uuid(2, 1), name: 'Seed Startups', slug: 'seed-startups' },
	{ id: uuid(2, 2), name: 'Seed Live Music', slug: 'seed-live-music' },
	{ id: uuid(2, 3), name: 'Seed AI', slug: 'seed-ai' },
	{ id: uuid(2, 4), name: 'Seed Sustainability', slug: 'seed-sustainability' },
	{ id: uuid(2, 5), name: 'Seed Fitness', slug: 'seed-fitness' },
	{ id: uuid(2, 6), name: 'Seed Family Activities', slug: 'seed-family-activities' },
	{ id: uuid(2, 7), name: 'Seed Premium Networking', slug: 'seed-premium-networking' },
	{ id: uuid(2, 8), name: 'Seed Street Food', slug: 'seed-street-food' },
	{ id: uuid(2, 9), name: 'Seed Creators', slug: 'seed-creators' },
	{ id: uuid(2, 10), name: 'Seed Esports', slug: 'seed-esports' },
	{ id: uuid(2, 11), name: 'Seed Design', slug: 'seed-design' },
	{ id: uuid(2, 12), name: 'Seed Urban Culture', slug: 'seed-urban-culture' },
];

const creatorNames = [
	'Aurora Live Lab',
	'Pixel Summit Madrid',
	'Green Mile Fest',
	'Campus Makers Club',
	'North Beat Collective',
	'Founders Afterwork',
	'Urban Plate Market',
	'Run Social Barcelona',
	'Indie Screen Nights',
	'Cloud Builders Forum',
	'Valencia Wellness Week',
	'GameNest Arena',
	'Design Dock Bilbao',
	'Family Science Days',
	'Soundwave Terrace',
	'Future Retail Meetup',
	'Creators Brunch Club',
	'Mediterranean Yoga Series',
	'Open Air Cinema Hub',
	'Data Talks Seville',
];

const cities = [
	['ES', 'Madrid', 'Madrid', 'Calle Serrano 24', '40.4230000', '-3.6880000'],
	['ES', 'Catalonia', 'Barcelona', 'Carrer de Pallars 108', '41.4036000', '2.1945000'],
	['ES', 'Valencia', 'Valencia', 'Carrer de Colon 31', '39.4699000', '-0.3763000'],
	['ES', 'Andalusia', 'Seville', 'Avenida de la Constitucion 18', '37.3891000', '-5.9845000'],
	['ES', 'Basque Country', 'Bilbao', 'Gran Via 45', '43.2630000', '-2.9350000'],
] as const;

const creatorTypes = [
	'venue',
	'organizer',
	'festival',
	'conference',
	'community_host',
	'media_brand',
] as const;

const creatorRows = creatorNames.map((name, index) => {
	const city = cities[index % cities.length];
	const slug = name.toLowerCase().replaceAll(' ', '-');

	return {
		id: uuid(3, index + 1),
		creatorType: creatorTypes[index % creatorTypes.length],
		displayName: name,
		legalName: `${name} Events SL`,
		slug,
		tagline: `${name} connects high-intent audiences through memorable events.`,
		websiteUrl: `https://${slug}.example.com`,
		linkedinUrl: `https://www.linkedin.com/company/${slug}`,
		instagramUrl: `https://www.instagram.com/${slug.replaceAll('-', '_')}`,
		contactEmail: `partnerships@${slug}.example.com`,
		countryCode: city[0],
		region: city[1],
		city: city[2],
		addressLine: city[3],
		latitude: city[4],
		longitude: city[5],
		onboardingStatus: 'completed' as const,
		profileStatus: index % 10 === 0 ? ('draft' as const) : ('published' as const),
		verificationStatus: index % 6 === 0 ? ('pending' as const) : ('verified' as const),
		responseTimeHours: 6 + (index % 5) * 3,
		createdByUserId: uuid(10, index + 1),
		createdAt: now,
		updatedAt: now,
	};
});

const sponsorNames = [
	'NovaPay',
	'BrightBrew Coffee',
	'FitLoop',
	'CloudForge',
	'EcoRide',
	'Mesa Verde Foods',
	'Pulse Telecom',
	'Northstar Bank',
	'SkillCraft Academy',
	'Viva Travel',
	'UrbanWear Co',
	'Metricly',
	'Solaris Energy',
	'Blend Cosmetics',
	'Habit Health',
	'ArcadeBox',
	'BlueNest Insurance',
	'FreshCart',
	'Luma Audio',
	'TalentBridge',
];

const industries = [
	'Fintech',
	'Food and Beverage',
	'Health and Fitness',
	'Cloud Software',
	'Mobility',
	'Consumer Goods',
	'Telecommunications',
	'Banking',
	'Education',
	'Travel',
];

const sponsorRows = sponsorNames.map((name, index) => {
	const city = cities[(index + 2) % cities.length];
	const slug = name.toLowerCase().replaceAll(' ', '-');

	return {
		id: uuid(4, index + 1),
		name,
		slug,
		websiteUrl: `https://${slug}.example.com`,
		linkedinUrl: `https://www.linkedin.com/company/${slug}`,
		description: `${name} is testing sponsorship channels with measurable local audience data.`,
		industry: industries[index % industries.length],
		companySize: ['11-50', '51-200', '201-500', '501-1000'][index % 4],
		countryCode: city[0],
		city: city[2],
		verificationStatus: index % 5 === 0 ? ('pending' as const) : ('verified' as const),
		createdByUserId: uuid(11, index + 1),
		createdAt: now,
		updatedAt: now,
	};
});

const creatorAuthInputs = creatorRows.map((creator, index) => ({
	email: `creator${index + 1}@seed.example.com`,
	fullName: `${creator.displayName} Admin`,
	role: 'creator' as const,
}));

const sponsorAuthInputs = sponsorRows.map((sponsor, index) => ({
	email: `sponsor${index + 1}@seed.example.com`,
	fullName: `${sponsor.name} Manager`,
	role: 'sponsor' as const,
}));

const buildProfileRows = (creatorAuthUsers: SeedAuthUser[], sponsorAuthUsers: SeedAuthUser[]) => [
	...creatorAuthUsers.map((user, index) => ({
		id: user.id,
		email: user.email,
		fullName: user.fullName,
		avatarUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${creatorRows[index].slug}`,
		phone: `+34600${(100000 + index).toString()}`,
		role: user.role,
		status: 'active',
		createdAt: now,
		updatedAt: now,
	})),
	...sponsorAuthUsers.map((user, index) => ({
		id: user.id,
		email: user.email,
		fullName: user.fullName,
		avatarUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${sponsorRows[index].slug}`,
		phone: `+34610${(100000 + index).toString()}`,
		role: user.role,
		status: 'active',
		createdAt: now,
		updatedAt: now,
	})),
];

const getSupabaseAuthConfig = () => {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!supabaseUrl || !serviceRoleKey) {
		throw new Error(
			'Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY para crear usuarios de Auth con password.',
		);
	}

	return {
		supabaseUrl: supabaseUrl.replace(/\/$/, ''),
		serviceRoleKey,
	};
};

const authAdminRequest = async <T>(path: string, init: RequestInit = {}) => {
	const { supabaseUrl, serviceRoleKey } = getSupabaseAuthConfig();
	const response = await fetch(`${supabaseUrl}/auth/v1${path}`, {
		...init,
		headers: {
			apikey: serviceRoleKey,
			Authorization: `Bearer ${serviceRoleKey}`,
			'Content-Type': 'application/json',
			...(init.headers ?? {}),
		},
	});

	if (!response.ok) {
		const body = await response.text();
		throw new Error(`Supabase Auth Admin ${init.method ?? 'GET'} ${path} fallo (${response.status}): ${body}`);
	}

	return (await response.json()) as T;
};

const extractAuthUser = (payload: unknown): { id: string; email?: string } => {
	if (payload && typeof payload === 'object' && 'user' in payload) {
		const user = (payload as { user: unknown }).user;
		if (user && typeof user === 'object' && 'id' in user) {
			return user as { id: string; email?: string };
		}
	}

	return payload as { id: string; email?: string };
};

const listExistingAuthUsers = async () => {
	const users: Array<{ id: string; email?: string }> = [];
	let page = 1;

	while (true) {
		const payload = await authAdminRequest<{ users?: Array<{ id: string; email?: string }> }>(
			`/admin/users?page=${page}&per_page=1000`,
		);
		const batch = payload.users ?? [];
		users.push(...batch);

		if (batch.length < 1000) {
			break;
		}

		page += 1;
	}

	return users;
};

const ensureAuthUser = async (
	input: SeedAuthInput,
	existingByEmail: Map<string, { id: string; email?: string }>,
): Promise<SeedAuthUser> => {
	const emailKey = input.email.toLowerCase();
	const existing = existingByEmail.get(emailKey);
	const body = {
		email: input.email,
		password: seedUserPassword,
		email_confirm: true,
		user_metadata: {
			full_name: input.fullName,
		},
		app_metadata: {
			role: input.role,
		},
	};

	if (existing) {
		await authAdminRequest(`/admin/users/${existing.id}`, {
			method: 'PUT',
			body: JSON.stringify(body),
		});

		return {
			id: existing.id,
			...input,
		};
	}

	const payload = await authAdminRequest('/admin/users', {
		method: 'POST',
		body: JSON.stringify(body),
	});
	const createdUser = extractAuthUser(payload);
	const seedUser = {
		id: createdUser.id,
		...input,
	};

	existingByEmail.set(emailKey, seedUser);

	return seedUser;
};

const ensureSeedAuthUsers = async () => {
	const existingUsers = await listExistingAuthUsers();
	const existingByEmail = new Map(
		existingUsers
			.filter((user): user is { id: string; email: string } => typeof user.email === 'string')
			.map((user) => [user.email.toLowerCase(), user]),
	);

	const creatorAuthUsers: SeedAuthUser[] = [];
	for (const input of creatorAuthInputs) {
		creatorAuthUsers.push(await ensureAuthUser(input, existingByEmail));
	}

	const sponsorAuthUsers: SeedAuthUser[] = [];
	for (const input of sponsorAuthInputs) {
		sponsorAuthUsers.push(await ensureAuthUser(input, existingByEmail));
	}

	return {
		creatorAuthUsers,
		sponsorAuthUsers,
	};
};

const eventTitles = ['Spring Edition', 'Summer Session', 'Autumn Showcase'];

const eventRows = creatorRows.flatMap((creator, creatorIndex) =>
	eventTitles.map((title, eventIndex) => {
		const category = categorySeed[(creatorIndex + eventIndex) % categorySeed.length];
		const isPast = eventIndex === 0;
		const month = isPast ? ((creatorIndex % 4) + 1) : 6 + eventIndex + (creatorIndex % 4);
		const day = 6 + (creatorIndex % 20);
		const startsAt = new Date(Date.UTC(isPast ? 2026 : 2026, month - 1, day, 17, 0, 0));
		const endsAt = new Date(Date.UTC(isPast ? 2026 : 2026, month - 1, day, 21, 0, 0));

		return {
			id: uuid(5, creatorIndex * eventTitles.length + eventIndex + 1),
			creatorId: creator.id,
			externalProvider: eventIndex === 1 ? 'eventbrite' : 'manual',
			externalEventId: `seed-${creator.slug}-${eventIndex + 1}`,
			title: `${creator.displayName} ${title}`,
			description: `A ${category.name.toLowerCase()} event designed for brand activations, qualified leads and audience learning.`,
			eventFormat: eventIndex === 2 ? ('hybrid' as const) : ('in_person' as const),
			categoryId: category.id,
			startsAt,
			endsAt,
			timezone: 'Europe/Madrid',
			venueName: `${creator.city} Event Hall`,
			countryCode: creator.countryCode,
			region: creator.region,
			city: creator.city,
			addressLine: creator.addressLine ?? 'Main Avenue 1',
			latitude: creator.latitude ?? '40.4168000',
			longitude: creator.longitude ?? '-3.7038000',
			ticketsSold: 650 + creatorIndex * 95 + eventIndex * 180,
			checkinsCount: 520 + creatorIndex * 78 + eventIndex * 140,
			eventStatus: isPast ? ('past' as const) : ('upcoming' as const),
			verificationStatus: 'verified' as const,
			importedAt: now,
			createdAt: now,
			updatedAt: now,
		};
	}),
);

const inventoryTemplates = [
	['logo_placement', 'Main partner logo', 'Logo placement on website, emails and entrance screens.', 'placement', 4],
	['stage_mention', 'Stage mention', 'Host mention during opening and closing sessions.', 'mention', 3],
	['booth', 'Activation booth', 'Physical branded booth in the main attendee flow.', 'booth', 2],
	['social_post', 'Social media post', 'Dedicated social post before and after the event.', 'post', 5],
] as const;

const inventoryRows = creatorRows.flatMap((creator, creatorIndex) =>
	inventoryTemplates.map(([inventoryType, name, description, unitType, capacity], itemIndex) => ({
		id: uuid(6, creatorIndex * inventoryTemplates.length + itemIndex + 1),
		creatorId: creator.id,
		inventoryType,
		name,
		description,
		unitType,
		capacity,
		isActive: true,
		createdAt: now,
		updatedAt: now,
	})),
);

const packageRows = creatorRows.flatMap((creator, creatorIndex) =>
	(['bronze', 'silver', 'gold'] as const).map((packageType, packageIndex) => {
		const basePrice = 1800 + creatorIndex * 170;
		const price = basePrice * (packageIndex + 1);
		const reach = 900 + creatorIndex * 120 + packageIndex * 550;

		return {
			id: uuid(7, creatorIndex * 3 + packageIndex + 1),
			creatorId: creator.id,
			packageType,
			name: `${packageType[0].toUpperCase()}${packageType.slice(1)} Partnership`,
			description: `${packageType} sponsorship package with verified event exposure and recap metrics.`,
			priceAmount: price.toFixed(2),
			currencyCode: 'EUR',
			estimatedImpressions: reach * 3,
			estimatedReach: reach,
			estimatedCpm: ((price / (reach * 3)) * 1000).toFixed(2),
			isPublic: true,
			sortOrder: packageIndex + 1,
			createdAt: now,
			updatedAt: now,
		};
	}),
);

const packageItemRows = packageRows.flatMap((pkg, packageIndex) => {
	const creatorIndex = Math.floor(packageIndex / 3);
	const baseInventoryIndex = creatorIndex * inventoryTemplates.length;
	const itemCount = (packageIndex % 3) + 2;

	return inventoryRows.slice(baseInventoryIndex, baseInventoryIndex + itemCount).map((item, itemIndex) => ({
		packageId: pkg.id,
		inventoryItemId: item.id,
		quantity: itemIndex + 1,
		notes: `Included in ${pkg.name}.`,
	}));
});

const mediaKitRows = creatorRows.map((creator, index) => ({
	id: uuid(8, index + 1),
	creatorId: creator.id,
	headline: `${creator.displayName} media kit`,
	shortDescription: creator.tagline,
	aboutText: `${creator.displayName} produces recurring events with a clear audience profile and sponsor-ready reporting.`,
	missionText: 'Build useful spaces where brands can create value instead of interrupting the audience.',
	whyPartnerText: 'Partners receive measurable visibility, qualified interactions and post-event performance summaries.',
	audienceSummaryText: `Typical audience size ranges from ${900 + index * 120} to ${2200 + index * 180} attendees per event.`,
	isPublic: creator.profileStatus === 'published',
	publishedAt: creator.profileStatus === 'published' ? now : null,
	lastContentUpdateAt: now,
	createdAt: now,
	updatedAt: now,
}));

const assetRows = creatorRows.flatMap((creator, index) => [
	{
		id: uuid(9, index * 2 + 1),
		creatorId: creator.id,
		assetRole: 'logo' as const,
		storageProvider: 'supabase_storage' as const,
		filePath: `seed/creators/${creator.slug}/logo.svg`,
		publicUrl: `https://placehold.co/512x512?text=${encodeURIComponent(creator.displayName[0])}`,
		mimeType: 'image/svg+xml',
		title: `${creator.displayName} logo`,
		sortOrder: 1,
		createdAt: now,
	},
	{
		id: uuid(9, index * 2 + 2),
		creatorId: creator.id,
		assetRole: 'cover' as const,
		storageProvider: 'supabase_storage' as const,
		filePath: `seed/creators/${creator.slug}/cover.jpg`,
		publicUrl: `https://placehold.co/1200x600?text=${encodeURIComponent(creator.displayName)}`,
		mimeType: 'image/jpeg',
		title: `${creator.displayName} cover`,
		sortOrder: 2,
		createdAt: now,
	},
]);

const creatorCategoryRows = creatorRows.flatMap((creator, index) => {
	const primary = categorySeed[index % categorySeed.length];
	const secondary = categorySeed[(index + 3) % categorySeed.length];

	return [
		{ creatorId: creator.id, categoryId: primary.id, isPrimary: true },
		{ creatorId: creator.id, categoryId: secondary.id, isPrimary: false },
	];
});

const creatorInterestRows = creatorRows.flatMap((creator, index) =>
	[0, 1, 2].map((offset) => ({
		creatorId: creator.id,
		interestId: interestSeed[(index + offset * 2) % interestSeed.length].id,
		weight: 100 - offset * 20,
		createdAt: now,
	})),
);

const audienceSnapshotRows = [
	...creatorRows.map((creator, index) => ({
		id: uuid(12, index + 1),
		creatorId: creator.id,
		eventId: null,
		snapshotScope: 'creator' as const,
		sourceProvider: 'manual' as const,
		verificationStatus: creator.verificationStatus,
		snapshotDate: '2026-05-01',
		totalAttendees: 1800 + index * 260,
		totalTicketsSold: 1600 + index * 230,
		totalCheckins: 1370 + index * 205,
		repeatAttendancePct: (22 + (index % 7) * 4).toFixed(2),
		demographicsJsonb: {
			ageGroups: [
				{ label: '18-24', value: 24 + (index % 5) },
				{ label: '25-34', value: 38 + (index % 4) },
				{ label: '35-44', value: 22 },
				{ label: '45+', value: 16 - (index % 3) },
			],
			gender: [
				{ label: 'Female', value: 48 + (index % 8) },
				{ label: 'Male', value: 44 - (index % 5) },
				{ label: 'Other', value: 8 },
			],
		},
		topLocationsJsonb: {
			locations: [
				{ city: creator.city, pct: 56 },
				{ city: cities[(index + 1) % cities.length][2], pct: 24 },
				{ city: cities[(index + 2) % cities.length][2], pct: 20 },
			],
		},
		interestsJsonb: {
			interests: creatorInterestRows
				.filter((row) => row.creatorId === creator.id)
				.map((row) => interestSeed.find((interest) => interest.id === row.interestId)?.name),
		},
		notes: 'Seed creator-level audience snapshot for discovery and media kit validation.',
		lastSyncedAt: now,
		createdAt: now,
	})),
	...eventRows.slice(0, 20).map((event, index) => ({
		id: uuid(13, index + 1),
		creatorId: event.creatorId,
		eventId: event.id,
		snapshotScope: 'event' as const,
		sourceProvider: event.externalProvider === 'eventbrite' ? ('eventbrite' as const) : ('manual' as const),
		verificationStatus: 'verified' as const,
		snapshotDate: '2026-05-01',
		totalAttendees: event.checkinsCount,
		totalTicketsSold: event.ticketsSold,
		totalCheckins: event.checkinsCount,
		repeatAttendancePct: (18 + (index % 6) * 3).toFixed(2),
		demographicsJsonb: { ageGroups: [{ label: '25-34', value: 46 }, { label: '35-44', value: 31 }, { label: 'Other', value: 23 }] },
		topLocationsJsonb: { locations: [{ city: event.city, pct: 68 }, { city: 'Other Spain', pct: 32 }] },
		interestsJsonb: { interests: ['Events', 'Brands', 'Networking'] },
		notes: 'Seed event-level audience snapshot for verified event metrics.',
		lastSyncedAt: now,
		createdAt: now,
	})),
];

const pastSponsorRows = creatorRows.flatMap((creator, index) =>
	[0, 1].map((offset) => {
		const sponsor = sponsorRows[(index + offset + 3) % sponsorRows.length];

		return {
			id: uuid(14, index * 2 + offset + 1),
			creatorId: creator.id,
			sponsorName: sponsor.name,
			logoUrl: `https://placehold.co/256x256?text=${encodeURIComponent(sponsor.name[0])}`,
			campaignTitle: `${sponsor.name} x ${creator.displayName}`,
			description: `Demo collaboration focused on ${sponsor.industry.toLowerCase()} audience engagement.`,
			resultMetricsJsonb: {
				impressions: 12000 + index * 900 + offset * 1200,
				leads: 80 + index * 7 + offset * 18,
				engagementRatePct: 4.5 + offset + (index % 5) * 0.3,
			},
			startDate: `2025-${(offset + 3).toString().padStart(2, '0')}-10`,
			endDate: `2025-${(offset + 3).toString().padStart(2, '0')}-12`,
			createdAt: now,
		};
	}),
);

const buildSavedCreatorRows = (sponsorRowsForInsert: typeof sponsorRows) => sponsorRowsForInsert.flatMap((sponsor, index) =>
	[0, 1, 2].map((offset) => ({
		sponsorCompanyId: sponsor.id,
		creatorId: creatorRows[(index + offset) % creatorRows.length].id,
		savedByUserId: sponsor.createdByUserId,
		createdAt: now,
	})),
);

const buildInquiryRows = (sponsorRowsForInsert: typeof sponsorRows) => sponsorRowsForInsert.map((sponsor, index) => {
	const creator = creatorRows[index % creatorRows.length];
	const event = eventRows.find((row) => row.creatorId === creator.id && row.eventStatus === 'upcoming');
	const selectedPackage = packageRows.find((row) => row.creatorId === creator.id && row.packageType === 'silver');
	const statuses = ['pending', 'negotiating', 'closed_won', 'closed_lost'] as const;
	const goals = [
		'brand_awareness',
		'lead_generation',
		'product_launch',
		'community_building',
		'sampling',
		'employer_branding',
	] as const;

	return {
		id: uuid(15, index + 1),
		creatorId: creator.id,
		eventId: event?.id ?? null,
		sponsorCompanyId: sponsor.id,
		sponsorUserId: sponsor.createdByUserId,
		packageId: selectedPackage?.id ?? null,
		source: index % 2 === 0 ? ('search' as const) : ('public_profile' as const),
		campaignGoal: goals[index % goals.length],
		budgetMin: (2500 + index * 220).toFixed(2),
		budgetMax: (6500 + index * 400).toFixed(2),
		currencyCode: 'EUR',
		preferredStartDate: '2026-06-01',
		preferredEndDate: '2026-11-30',
		requirementsText: `${sponsor.name} wants a measurable campaign with on-site activation and recap metrics.`,
		status: statuses[index % statuses.length],
		createdAt: now,
		updatedAt: now,
		lastMessageAt: now,
	};
});

async function seed() {
	const { creatorAuthUsers, sponsorAuthUsers } = await ensureSeedAuthUsers();
	const creatorRowsForInsert = creatorRows.map((creator, index) => ({
		...creator,
		createdByUserId: creatorAuthUsers[index].id,
	}));
	const sponsorRowsForInsert = sponsorRows.map((sponsor, index) => ({
		...sponsor,
		createdByUserId: sponsorAuthUsers[index].id,
	}));
	const profileRows = buildProfileRows(creatorAuthUsers, sponsorAuthUsers);
	const savedCreatorRows = buildSavedCreatorRows(sponsorRowsForInsert);
	const inquiryRows = buildInquiryRows(sponsorRowsForInsert);

	await db.transaction(async (tx) => {
		await tx.insert(profiles).values(profileRows).onConflictDoNothing();
		await tx.insert(categories).values(categorySeed).onConflictDoNothing();
		await tx.insert(interests).values(interestSeed).onConflictDoNothing();
		await tx.insert(creators).values(creatorRowsForInsert).onConflictDoNothing();
		await tx.insert(sponsorCompanies).values(sponsorRowsForInsert).onConflictDoNothing();
		await tx.insert(creatorCategories).values(creatorCategoryRows).onConflictDoNothing();
		await tx.insert(creatorInterests).values(creatorInterestRows).onConflictDoNothing();
		await tx.insert(creatorsMediaKit).values(mediaKitRows).onConflictDoNothing();
		await tx.insert(creatorsAssets).values(assetRows).onConflictDoNothing();
		await tx.insert(events).values(eventRows).onConflictDoNothing();
		await tx.insert(audienceSnapshots).values(audienceSnapshotRows).onConflictDoNothing();
		await tx.insert(inventoryItems).values(inventoryRows).onConflictDoNothing();
		await tx.insert(packages).values(packageRows).onConflictDoNothing();
		await tx.insert(packageItems).values(packageItemRows).onConflictDoNothing();
		await tx.insert(creatorPastSponsors).values(pastSponsorRows).onConflictDoNothing();
		await tx.insert(sponsorSavedCreators).values(savedCreatorRows).onConflictDoNothing();
		await tx.insert(sponsorshipInquiries).values(inquiryRows).onConflictDoNothing();
	});

	console.log('Seed completado:');
	console.log(`- ${creatorRows.length} creators`);
	console.log(`- ${sponsorRows.length} sponsors`);
	console.log(`- ${eventRows.length} eventos`);
	console.log(`- ${packageRows.length} paquetes`);
	console.log(`- ${inquiryRows.length} inquiries`);
	console.log(`- password demo: ${seedUserPassword}`);
	console.log(`- creator demo: ${creatorAuthInputs[0].email}`);
	console.log(`- sponsor demo: ${sponsorAuthInputs[0].email}`);
}

seed()
	.catch((error) => {
		console.error('Fallo en el seed:', error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await queryClient.end();
	});
