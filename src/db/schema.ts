/**
 * Aqui se definen las tablas de la base de datos usando Drizzle-ORM.
 *
 * Para aplicar los cambios en el esquema, sigue estos pasos:
 * 1) npm run db:generate
 * 2) npm run db:migrate
 *
 */
import {
	boolean,
	date,
	index,
	integer,
	jsonb,
	numeric,
	pgEnum,
	pgSchema,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core';

const auth = pgSchema('auth');

export const authUsers = auth.table('users', {
	id: uuid('id').primaryKey().notNull(),
});

export const profiles = pgTable('profiles', {
	id: uuid('id')
		.primaryKey()
		.notNull()
		.references(() => authUsers.id, { onDelete: 'cascade' }),
	email: text('email').notNull(),
	fullName: text('full_name').notNull(),
	avatarUrl: text('avatar_url').notNull(),
	phone: text('phone').notNull(),
	role: text('role').notNull(),
	status: text('status').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const creatorTypeEnum = pgEnum('creator_type', [
	'venue',
	'organizer',
	'festival',
	'conference',
	'community_host',
	'media_brand',
]);

export const onboardingStatusEnum = pgEnum('onboarding_status', [
	'not_started',
	'in_progress',
	'completed',
]);

export const profileStatusEnum = pgEnum('profile_status', ['draft', 'published', 'archived']);

export const verificationStatusEnum = pgEnum('verification_status', [
	'unverified',
	'pending',
	'verified',
	'rejected',
]);

export const creators = pgTable(
	'creators',
	{
		id: uuid('id').primaryKey().notNull().defaultRandom(),
		creatorType: creatorTypeEnum('creator_type').notNull(),
		displayName: text('display_name').notNull(),
		legalName: text('legal_name'),
		slug: text('slug').notNull().unique(),
		tagline: text('tagline').notNull(),
		websiteUrl: text('website_url').notNull(),
		linkedinUrl: text('linkedin_url').notNull(),
		instagramUrl: text('instagram_url').notNull(),
		contactEmail: text('contact_email').notNull(),
		countryCode: text('country_code').notNull(),
		region: text('region').notNull(),
		city: text('city').notNull(),
		addressLine: text('address_line'),
		latitude: numeric('latitude', { precision: 10, scale: 7 }),
		longitude: numeric('longitude', { precision: 10, scale: 7 }),
		onboardingStatus: onboardingStatusEnum('onboarding_status').notNull(),
		profileStatus: profileStatusEnum('profile_status').notNull(),
		verificationStatus: verificationStatusEnum('verification_status').notNull(),
		responseTimeHours: integer('response_time_hours'),
		createdByUserId: uuid('created_by_user_id')
			.notNull()
			.references(() => profiles.id, { onDelete: 'restrict' }),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index('creators_created_by_user_id_idx').on(table.createdByUserId),
		index('creators_country_code_idx').on(table.countryCode),
		index('creators_profile_status_idx').on(table.profileStatus),
	],
);

export const creatorsMediaKit = pgTable(
	'creators_media_kit',
	{
		id: uuid('id').primaryKey().notNull().defaultRandom(),
		creatorId: uuid('creator_id')
			.notNull()
			.unique()
			.references(() => creators.id, { onDelete: 'cascade' }),
		headline: text('headline').notNull(),
		shortDescription: text('short_description').notNull(),
		aboutText: text('about_text').notNull(),
		missionText: text('mission_text').notNull(),
		whyPartnerText: text('why_partner_text').notNull(),
		audienceSummaryText: text('audience_summary_text').notNull(),
		isPublic: boolean('is_public').notNull().default(false),
		publishedAt: timestamp('published_at', { withTimezone: true }),
		lastContentUpdateAt: timestamp('last_content_update_at', { withTimezone: true }),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [index('creators_media_kit_creator_id_idx').on(table.creatorId)],
);

export const assetRoleEnum = pgEnum('asset_role', [
	'logo',
	'cover',
	'gallery_image',
	'gallery_video',
]);

export const storageProviderEnum = pgEnum('storage_provider', ['s3', 'ipfs', 'supabase_storage']);

export const creatorsAssets = pgTable(
	'creators_assets',
	{
		id: uuid('id').primaryKey().notNull().defaultRandom(),
		creatorId: uuid('creator_id')
			.notNull()
			.references(() => creators.id, { onDelete: 'cascade' }),
		assetRole: assetRoleEnum('asset_role').notNull(),
		storageProvider: storageProviderEnum('storage_provider').notNull(),
		filePath: text('file_path').notNull(),
		publicUrl: text('public_url').notNull(),
		mimeType: text('mime_type').notNull(),
		title: text('title').notNull(),
		sortOrder: integer('sort_order').notNull().default(0),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [index('creators_assets_creator_id_idx').on(table.creatorId)],
);

export const creatorPastSponsors = pgTable(
	'creator_past_sponsors',
	{
		id: uuid('id').primaryKey().notNull().defaultRandom(),
		creatorId: uuid('creator_id')
			.notNull()
			.references(() => creators.id, { onDelete: 'cascade' }),
		sponsorName: text('sponsor_name').notNull(),
		logoUrl: text('logo_url').notNull(),
		campaignTitle: text('campaign_title'),
		description: text('description').notNull(),
		resultMetricsJsonb: jsonb('result_metrics_jsonb').$type<Record<string, unknown> | null>(),
		startDate: date('start_date'),
		endDate: date('end_date'),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [index('creator_past_sponsors_creator_id_idx').on(table.creatorId)],
);

export const categories = pgTable('categories', {
	id: uuid('id').primaryKey().notNull().defaultRandom(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	isActive: boolean('is_active').notNull().default(true),
});

export const creatorCategories = pgTable(
	'creator_categories',
	{
		creatorId: uuid('creator_id')
			.notNull()
			.references(() => creators.id, { onDelete: 'cascade' }),
		categoryId: uuid('category_id')
			.notNull()
			.references(() => categories.id, { onDelete: 'cascade' }),
		isPrimary: boolean('is_primary').notNull().default(false),
	},
	(table) => [
		primaryKey({ columns: [table.creatorId, table.categoryId], name: 'creator_categories_pk' }),
		index('creator_categories_category_id_idx').on(table.categoryId),
	],
);

export const interests = pgTable('interests', {
	id: uuid('id').primaryKey().notNull().defaultRandom(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	isActive: boolean('is_active').notNull().default(true),
});

export const creatorInterests = pgTable(
	'creator_interests',
	{
		creatorId: uuid('creator_id')
			.notNull()
			.references(() => creators.id, { onDelete: 'cascade' }),
		interestId: uuid('interest_id')
			.notNull()
			.references(() => interests.id, { onDelete: 'cascade' }),
		weight: integer('weight'),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		primaryKey({ columns: [table.creatorId, table.interestId], name: 'creator_interests_pk' }),
		index('creator_interests_interest_id_idx').on(table.interestId),
	],
);

export const eventFormatEnum = pgEnum('event_format', ['in_person', 'hybrid', 'online']);

export const eventStatusEnum = pgEnum('event_status', ['upcoming', 'past', 'cancelled', 'draft']);

export const events = pgTable(
	'events',
	{
		id: uuid('id').primaryKey().notNull().defaultRandom(),
		creatorId: uuid('creator_id')
			.notNull()
			.references(() => creators.id, { onDelete: 'cascade' }),
		externalProvider: text('external_provider'),
		externalEventId: text('external_event_id'),
		title: text('title').notNull(),
		description: text('description').notNull(),
		eventFormat: eventFormatEnum('event_format').notNull(),
		categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
		startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
		endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
		timezone: text('timezone').notNull(),
		venueName: text('venue_name').notNull(),
		countryCode: text('country_code').notNull(),
		region: text('region').notNull(),
		city: text('city').notNull(),
		addressLine: text('address_line').notNull(),
		latitude: numeric('latitude', { precision: 10, scale: 7 }).notNull(),
		longitude: numeric('longitude', { precision: 10, scale: 7 }).notNull(),
		ticketsSold: integer('tickets_sold').notNull().default(0),
		checkinsCount: integer('checkins_count').notNull().default(0),
		eventStatus: eventStatusEnum('event_status').notNull(),
		verificationStatus: verificationStatusEnum('verification_status').notNull(),
		importedAt: timestamp('imported_at', { withTimezone: true }).defaultNow().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index('events_creator_id_idx').on(table.creatorId),
		index('events_category_id_idx').on(table.categoryId),
		index('events_starts_at_idx').on(table.startsAt),
	],
);

export const snapshotScopeEnum = pgEnum('snapshot_scope', ['creator', 'event']);

export const sourceProviderEnum = pgEnum('source_provider', ['eventbrite', 'manual', 'third_party']);

export const audienceSnapshots = pgTable(
	'audience_snapshots',
	{
		id: uuid('id').primaryKey().notNull().defaultRandom(),
		creatorId: uuid('creator_id').references(() => creators.id, { onDelete: 'set null' }),
		eventId: uuid('event_id').references(() => events.id, { onDelete: 'set null' }),
		snapshotScope: snapshotScopeEnum('snapshot_scope').notNull(),
		sourceProvider: sourceProviderEnum('source_provider').notNull(),
		verificationStatus: verificationStatusEnum('verification_status').notNull(),
		snapshotDate: date('snapshot_date').notNull(),
		totalAttendees: integer('total_attendees').notNull().default(0),
		totalTicketsSold: integer('total_tickets_sold').notNull().default(0),
		totalCheckins: integer('total_checkins').notNull().default(0),
		repeatAttendancePct: numeric('repeat_attendance_pct', { precision: 5, scale: 2 }),
		demographicsJsonb: jsonb('demographics_jsonb').$type<Record<string, unknown>>().notNull(),
		topLocationsJsonb: jsonb('top_locations_jsonb').$type<Record<string, unknown>>().notNull(),
		interestsJsonb: jsonb('interests_jsonb').$type<Record<string, unknown>>().notNull(),
		notes: text('notes').notNull(),
		lastSyncedAt: timestamp('last_synced_at', { withTimezone: true }).defaultNow().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [index('audience_snapshots_creator_id_idx').on(table.creatorId), index('audience_snapshots_event_id_idx').on(table.eventId)],
);

export const inventoryTypeEnum = pgEnum('inventory_type', [
	'booth',
	'stage_mention',
	'logo_placement',
	'lanyard',
	'vip_activation',
	'product_sampling',
	'newsletter',
	'social_post',
	'email_blast',
	'digital_screen',
	'speaking_slot',
	'custom',
]);

export const inventoryItems = pgTable(
	'inventory_items',
	{
		id: uuid('id').primaryKey().notNull().defaultRandom(),
		creatorId: uuid('creator_id')
			.notNull()
			.references(() => creators.id, { onDelete: 'cascade' }),
		inventoryType: inventoryTypeEnum('inventory_type').notNull(),
		name: text('name').notNull(),
		description: text('description').notNull(),
		unitType: text('unit_type'),
		capacity: integer('capacity'),
		isActive: boolean('is_active').notNull().default(true),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [index('inventory_items_creator_id_idx').on(table.creatorId)],
);

export const packageTypeEnum = pgEnum('package_type', ['bronze', 'silver', 'gold', 'custom']);

export const packages = pgTable(
	'packages',
	{
		id: uuid('id').primaryKey().notNull().defaultRandom(),
		creatorId: uuid('creator_id')
			.notNull()
			.references(() => creators.id, { onDelete: 'cascade' }),
		packageType: packageTypeEnum('package_type').notNull(),
		name: text('name').notNull(),
		description: text('description').notNull(),
		priceAmount: numeric('price_amount', { precision: 12, scale: 2 }).notNull(),
		currencyCode: text('currency_code').notNull(),
		estimatedImpressions: integer('estimated_impressions'),
		estimatedReach: integer('estimated_reach'),
		estimatedCpm: numeric('estimated_cpm', { precision: 12, scale: 2 }),
		isPublic: boolean('is_public').notNull().default(false),
		sortOrder: integer('sort_order').notNull().default(0),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [index('packages_creator_id_idx').on(table.creatorId)],
);

export const packageItems = pgTable(
	'package_items',
	{
		packageId: uuid('package_id')
			.notNull()
			.references(() => packages.id, { onDelete: 'cascade' }),
		inventoryItemId: uuid('inventory_item_id')
			.notNull()
			.references(() => inventoryItems.id, { onDelete: 'cascade' }),
		quantity: integer('quantity'),
		notes: text('notes'),
	},
	(table) => [
		primaryKey({ columns: [table.packageId, table.inventoryItemId], name: 'package_items_pk' }),
		index('package_items_inventory_item_id_idx').on(table.inventoryItemId),
	],
);

export const sponsorCompanies = pgTable(
	'sponsor_companies',
	{
		id: uuid('id').primaryKey().notNull().defaultRandom(),
		name: text('name').notNull(),
		slug: text('slug').notNull().unique(),
		websiteUrl: text('website_url').notNull(),
		linkedinUrl: text('linkedin_url').notNull(),
		description: text('description').notNull(),
		industry: text('industry').notNull(),
		companySize: text('company_size'),
		countryCode: text('country_code'),
		city: text('city'),
		verificationStatus: verificationStatusEnum('verification_status').notNull(),
		createdByUserId: uuid('created_by_user_id')
			.notNull()
			.references(() => profiles.id, { onDelete: 'restrict' }),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [index('sponsor_companies_created_by_user_id_idx').on(table.createdByUserId)],
);

export const sponsorSavedCreators = pgTable(
	'sponsor_saved_creators',
	{
		sponsorCompanyId: uuid('sponsor_company_id')
			.notNull()
			.references(() => sponsorCompanies.id, { onDelete: 'cascade' }),
		creatorId: uuid('creator_id')
			.notNull()
			.references(() => creators.id, { onDelete: 'cascade' }),
		savedByUserId: uuid('saved_by_user_id')
			.notNull()
			.references(() => profiles.id, { onDelete: 'restrict' }),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.sponsorCompanyId, table.creatorId, table.savedByUserId],
			name: 'sponsor_saved_creators_pk',
		}),
		index('sponsor_saved_creators_creator_id_idx').on(table.creatorId),
	],
);

export const inquirySourceEnum = pgEnum('inquiry_source', [
	'public_profile',
	'search',
	'direct_link',
	'admin_created',
]);

export const campaignGoalEnum = pgEnum('campaign_goal', [
	'brand_awareness',
	'lead_generation',
	'product_launch',
	'community_building',
	'sampling',
	'employer_branding',
]);

export const inquiryStatusEnum = pgEnum('inquiry_status', [
	'pending',
	'negotiating',
	'closed_won',
	'closed_lost',
]);

export const sponsorshipInquiries = pgTable(
	'sponsorship_inquiries',
	{
		id: uuid('id').primaryKey().notNull().defaultRandom(),
		creatorId: uuid('creator_id')
			.notNull()
			.references(() => creators.id, { onDelete: 'cascade' }),
		eventId: uuid('event_id').references(() => events.id, { onDelete: 'set null' }),
		sponsorCompanyId: uuid('sponsor_company_id')
			.notNull()
			.references(() => sponsorCompanies.id, { onDelete: 'cascade' }),
		sponsorUserId: uuid('sponsor_user_id')
			.notNull()
			.references(() => profiles.id, { onDelete: 'restrict' }),
		packageId: uuid('package_id').references(() => packages.id, { onDelete: 'set null' }),
		source: inquirySourceEnum('source').notNull(),
		campaignGoal: campaignGoalEnum('campaign_goal').notNull(),
		budgetMin: numeric('budget_min', { precision: 12, scale: 2 }),
		budgetMax: numeric('budget_max', { precision: 12, scale: 2 }),
		currencyCode: text('currency_code').notNull(),
		preferredStartDate: date('preferred_start_date'),
		preferredEndDate: date('preferred_end_date'),
		requirementsText: text('requirements_text').notNull(),
		status: inquiryStatusEnum('status').notNull().default('pending'),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
		lastMessageAt: timestamp('last_message_at', { withTimezone: true }),
	},
	(table) => [
		index('sponsorship_inquiries_creator_id_idx').on(table.creatorId),
		index('sponsorship_inquiries_sponsor_company_id_idx').on(table.sponsorCompanyId),
		index('sponsorship_inquiries_event_id_idx').on(table.eventId),
	],
);


export const chatConnectionStatusEnum = pgEnum('chat_connection_status', ['pending', 'accepted', 'closed']);

export const chatConnections = pgTable(
	'chat_connections',
	{
		id: uuid('id').primaryKey().notNull().defaultRandom(),
		creatorId: uuid('creator_id')
			.notNull()
			.references(() => creators.id, { onDelete: 'cascade' }),
		sponsorCompanyId: uuid('sponsor_company_id')
			.notNull()
			.references(() => sponsorCompanies.id, { onDelete: 'cascade' }),
		sponsorUserId: uuid('sponsor_user_id')
			.notNull()
			.references(() => profiles.id, { onDelete: 'restrict' }),
		requestedByUserId: uuid('requested_by_user_id')
			.notNull()
			.references(() => profiles.id, { onDelete: 'restrict' }),
		acceptedByUserId: uuid('accepted_by_user_id').references(() => profiles.id, { onDelete: 'set null' }),
		closedByUserId: uuid('closed_by_user_id').references(() => profiles.id, { onDelete: 'set null' }),
		status: chatConnectionStatusEnum('status').notNull().default('pending'),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
		acceptedAt: timestamp('accepted_at', { withTimezone: true }),
		closedAt: timestamp('closed_at', { withTimezone: true }),
		lastMessageAt: timestamp('last_message_at', { withTimezone: true }),
	},
	(table) => [
		index('chat_connections_creator_id_idx').on(table.creatorId),
		index('chat_connections_sponsor_company_id_idx').on(table.sponsorCompanyId),
		index('chat_connections_sponsor_user_id_idx').on(table.sponsorUserId),
		index('chat_connections_status_idx').on(table.status),
	],
);

export const chatMessages = pgTable(
	'chat_messages',
	{
		id: uuid('id').primaryKey().notNull().defaultRandom(),
		connectionId: uuid('connection_id')
			.notNull()
			.references(() => chatConnections.id, { onDelete: 'cascade' }),
		senderUserId: uuid('sender_user_id')
			.notNull()
			.references(() => profiles.id, { onDelete: 'restrict' }),
		body: text('body').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index('chat_messages_connection_id_idx').on(table.connectionId),
		index('chat_messages_created_at_idx').on(table.createdAt),
	],
);

