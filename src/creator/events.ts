import "server-only";

import { and, asc, desc, eq } from "drizzle-orm";
import { ensureCreatorForUser } from "@/src/creator/defaults";
import { db } from "@/src/db/db";
import { categories, creators, creatorsMediaKit, events } from "@/src/db/schema";

export const EVENT_FORMATS = ["in_person", "hybrid", "online"] as const;
export const EVENT_STATUSES = ["upcoming", "past", "cancelled", "draft"] as const;

export type EventFormat = (typeof EVENT_FORMATS)[number];
export type EventStatus = (typeof EVENT_STATUSES)[number];

export type CreatorUserInput = {
  userId: string;
  email: string;
  fullName?: string | null;
};

export type CreatorEventFormData = {
  title: string;
  description: string;
  eventFormat: EventFormat;
  categoryId: string | null;
  startsAt: Date;
  endsAt: Date;
  timezone: string;
  venueName: string;
  countryCode: string;
  region: string;
  city: string;
  addressLine: string;
  latitude: string;
  longitude: string;
  ticketsSold: number;
  checkinsCount: number;
  eventStatus: EventStatus;
};

export type CreatorEventView = {
  id: string;
  title: string;
  description: string;
  eventFormat: EventFormat;
  categoryId: string | null;
  categoryName: string | null;
  startsAt: string;
  endsAt: string;
  timezone: string;
  venueName: string;
  countryCode: string;
  region: string;
  city: string;
  addressLine: string;
  latitude: string;
  longitude: string;
  ticketsSold: number;
  checkinsCount: number;
  eventStatus: EventStatus;
  verificationStatus: string;
  updatedAt: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function trimString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseRequiredString(body: Record<string, unknown>, field: string, errors: string[]) {
  const value = trimString(body[field]);
  if (!value) {
    errors.push(`${field} is required`);
  }
  return value;
}

function parseEnum<T extends readonly string[]>(
  value: unknown,
  allowed: T,
  field: string,
  fallback: T[number],
  errors: string[],
) {
  if (typeof value === "string" && allowed.includes(value)) {
    return value as T[number];
  }

  if (value !== undefined && value !== null && value !== "") {
    errors.push(`${field} is invalid`);
  }

  return fallback;
}

function parseDate(value: unknown, field: string, errors: string[]) {
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(`${field} is required`);
    return new Date(Number.NaN);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    errors.push(`${field} must be a valid date`);
  }

  return parsed;
}

function parseNonNegativeInteger(value: unknown, field: string, errors: string[]) {
  const parsed = Number(value ?? 0);
  if (!Number.isInteger(parsed) || parsed < 0) {
    errors.push(`${field} must be a non-negative integer`);
    return 0;
  }

  return parsed;
}

function parseCoordinate(
  value: unknown,
  field: string,
  min: number,
  max: number,
  errors: string[],
) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    errors.push(`${field} must be between ${min} and ${max}`);
    return "0.0000000";
  }

  return parsed.toFixed(7);
}

export function validateCreatorEventPayload(payload: unknown):
  | { ok: true; data: CreatorEventFormData }
  | { ok: false; errors: string[] } {
  const errors: string[] = [];

  if (!isRecord(payload)) {
    return { ok: false, errors: ["Payload must be an object"] };
  }

  const startsAt = parseDate(payload.startsAt, "startsAt", errors);
  const endsAt = parseDate(payload.endsAt, "endsAt", errors);

  if (!Number.isNaN(startsAt.getTime()) && !Number.isNaN(endsAt.getTime()) && endsAt <= startsAt) {
    errors.push("endsAt must be after startsAt");
  }

  const ticketsSold = parseNonNegativeInteger(payload.ticketsSold, "ticketsSold", errors);
  const checkinsCount = parseNonNegativeInteger(payload.checkinsCount, "checkinsCount", errors);

  if (checkinsCount > ticketsSold && ticketsSold > 0) {
    errors.push("checkinsCount cannot be greater than ticketsSold");
  }

  const categoryId = trimString(payload.categoryId) || null;

  const data: CreatorEventFormData = {
    title: parseRequiredString(payload, "title", errors),
    description: parseRequiredString(payload, "description", errors),
    eventFormat: parseEnum(payload.eventFormat, EVENT_FORMATS, "eventFormat", "in_person", errors),
    categoryId,
    startsAt,
    endsAt,
    timezone: parseRequiredString(payload, "timezone", errors),
    venueName: parseRequiredString(payload, "venueName", errors),
    countryCode: parseRequiredString(payload, "countryCode", errors).toUpperCase(),
    region: parseRequiredString(payload, "region", errors),
    city: parseRequiredString(payload, "city", errors),
    addressLine: parseRequiredString(payload, "addressLine", errors),
    latitude: parseCoordinate(payload.latitude, "latitude", -90, 90, errors),
    longitude: parseCoordinate(payload.longitude, "longitude", -180, 180, errors),
    ticketsSold,
    checkinsCount,
    eventStatus: parseEnum(payload.eventStatus, EVENT_STATUSES, "eventStatus", "upcoming", errors),
  };

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data };
}

function serializeEvent(row: {
  event: typeof events.$inferSelect;
  category: typeof categories.$inferSelect | null;
}): CreatorEventView {
  return {
    id: row.event.id,
    title: row.event.title,
    description: row.event.description,
    eventFormat: row.event.eventFormat,
    categoryId: row.event.categoryId,
    categoryName: row.category?.name ?? null,
    startsAt: row.event.startsAt.toISOString(),
    endsAt: row.event.endsAt.toISOString(),
    timezone: row.event.timezone,
    venueName: row.event.venueName,
    countryCode: row.event.countryCode,
    region: row.event.region,
    city: row.event.city,
    addressLine: row.event.addressLine,
    latitude: String(row.event.latitude),
    longitude: String(row.event.longitude),
    ticketsSold: row.event.ticketsSold,
    checkinsCount: row.event.checkinsCount,
    eventStatus: row.event.eventStatus,
    verificationStatus: row.event.verificationStatus,
    updatedAt: row.event.updatedAt.toISOString(),
  };
}

export async function getCreatorEventsData(input: CreatorUserInput) {
  const creator = await ensureCreatorForUser(input);

  const [eventRows, categoryRows] = await Promise.all([
    db
      .select({ event: events, category: categories })
      .from(events)
      .leftJoin(categories, eq(events.categoryId, categories.id))
      .where(eq(events.creatorId, creator.id))
      .orderBy(desc(events.startsAt)),
    db.select().from(categories).where(eq(categories.isActive, true)).orderBy(asc(categories.name)),
  ]);

  return {
    creator: {
      id: creator.id,
      displayName: creator.displayName,
      profileStatus: creator.profileStatus,
      countryCode: creator.countryCode,
      region: creator.region,
      city: creator.city,
      addressLine: creator.addressLine,
      latitude: creator.latitude ? String(creator.latitude) : "",
      longitude: creator.longitude ? String(creator.longitude) : "",
    },
    events: eventRows.map(serializeEvent),
    categories: categoryRows.map((category) => ({
      id: category.id,
      name: category.name,
    })),
  };
}

export async function categoryExists(categoryId: string | null) {
  if (!categoryId) {
    return true;
  }

  const rows = await db
    .select({ id: categories.id })
    .from(categories)
    .where(and(eq(categories.id, categoryId), eq(categories.isActive, true)))
    .limit(1);

  return rows.length > 0;
}

export function buildEventMutationValues(creatorId: string, data: CreatorEventFormData) {
  return {
    creatorId,
    externalProvider: "manual",
    externalEventId: null,
    title: data.title,
    description: data.description,
    eventFormat: data.eventFormat,
    categoryId: data.categoryId,
    startsAt: data.startsAt,
    endsAt: data.endsAt,
    timezone: data.timezone,
    venueName: data.venueName,
    countryCode: data.countryCode,
    region: data.region,
    city: data.city,
    addressLine: data.addressLine,
    latitude: data.latitude,
    longitude: data.longitude,
    ticketsSold: data.ticketsSold,
    checkinsCount: data.checkinsCount,
    eventStatus: data.eventStatus,
    verificationStatus: "unverified" as const,
    updatedAt: new Date(),
  };
}

export async function touchCreatorEventContent(creatorId: string) {
  const now = new Date();

  await Promise.all([
    db.update(creators).set({ updatedAt: now }).where(eq(creators.id, creatorId)),
    db
      .update(creatorsMediaKit)
      .set({ updatedAt: now, lastContentUpdateAt: now })
      .where(eq(creatorsMediaKit.creatorId, creatorId)),
  ]);
}
