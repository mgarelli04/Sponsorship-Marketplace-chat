import { and, asc, desc, eq, ne } from "drizzle-orm";
import { db } from "../db/db";
import {
  chatConnections,
  chatMessages,
  creators,
  profiles,
  sponsorCompanies,
} from "../db/schema";

export type ChatRole = "creator" | "sponsor";
export type ChatStatus = "pending" | "accepted" | "closed";

export interface ChatUser {
  id: string;
  role: ChatRole;
  email?: string | null;
  name?: string | null;
}

function requireRole(user: ChatUser, role: ChatRole) {
  if (user.role !== role) {
    throw new Error("No tienes permisos para realizar esta accion.");
  }
}

function displayName(user: ChatUser, fallback: string) {
  return user.name?.trim() || user.email?.split("@")[0]?.trim() || fallback;
}

export async function ensureSponsorCompany(user: ChatUser) {
  requireRole(user, "sponsor");

  const [existingCompany] = await db
    .select()
    .from(sponsorCompanies)
    .where(eq(sponsorCompanies.createdByUserId, user.id))
    .limit(1);

  if (existingCompany) {
    return existingCompany;
  }

  const sponsorName = displayName(user, "Sponsor");
  const [company] = await db
    .insert(sponsorCompanies)
    .values({
      name: `${sponsorName} Company`,
      slug: `sponsor-${user.id}`,
      websiteUrl: "",
      linkedinUrl: "",
      description: "Auto-created sponsor company profile.",
      industry: "General",
      verificationStatus: "unverified",
      createdByUserId: user.id,
    })
    .returning();

  return company;
}

export async function listChatThreads(user: ChatUser) {
  const creatorFilter = await getCreatorFilter(user);

  const rows = await db
    .select({
      id: chatConnections.id,
      status: chatConnections.status,
      createdAt: chatConnections.createdAt,
      acceptedAt: chatConnections.acceptedAt,
      closedAt: chatConnections.closedAt,
      lastMessageAt: chatConnections.lastMessageAt,
      creatorName: creators.displayName,
      sponsorName: sponsorCompanies.name,
      sponsorIndustry: sponsorCompanies.industry,
    })
    .from(chatConnections)
    .innerJoin(creators, eq(chatConnections.creatorId, creators.id))
    .innerJoin(sponsorCompanies, eq(chatConnections.sponsorCompanyId, sponsorCompanies.id))
    .where(
      user.role === "sponsor"
        ? eq(chatConnections.sponsorUserId, user.id)
        : eq(chatConnections.creatorId, creatorFilter.creatorId),
    )
    .orderBy(desc(chatConnections.lastMessageAt), desc(chatConnections.createdAt));

  const threads = await Promise.all(
    rows.map(async (row) => {
      const [lastMessage] = await db
        .select({
          body: chatMessages.body,
          createdAt: chatMessages.createdAt,
          senderUserId: chatMessages.senderUserId,
        })
        .from(chatMessages)
        .where(eq(chatMessages.connectionId, row.id))
        .orderBy(desc(chatMessages.createdAt))
        .limit(1);

      return {
        ...row,
        counterpartName: user.role === "sponsor" ? row.creatorName : row.sponsorName,
        lastMessage: lastMessage ?? null,
      };
    }),
  );

  return threads;
}

async function getCreatorFilter(user: ChatUser) {
  if (user.role !== "creator") {
    return { creatorId: "" };
  }

  const [creator] = await db
    .select({ id: creators.id })
    .from(creators)
    .where(eq(creators.createdByUserId, user.id))
    .limit(1);

  if (!creator) {
    throw new Error("No se encontro el perfil de creator asociado a este usuario.");
  }

  return { creatorId: creator.id };
}

export async function createChatConnection(user: ChatUser, creatorId: string) {
  requireRole(user, "sponsor");

  if (!creatorId) {
    throw new Error("Falta el creatorId.");
  }

  const [creator] = await db
    .select({ id: creators.id })
    .from(creators)
    .where(eq(creators.id, creatorId))
    .limit(1);

  if (!creator) {
    throw new Error("Creator no encontrado.");
  }

  const company = await ensureSponsorCompany(user);

  const [existingConnection] = await db
    .select({ id: chatConnections.id, status: chatConnections.status })
    .from(chatConnections)
    .where(
      and(
        eq(chatConnections.creatorId, creatorId),
        eq(chatConnections.sponsorCompanyId, company.id),
        ne(chatConnections.status, "closed"),
      ),
    )
    .limit(1);

  if (existingConnection) {
    return existingConnection;
  }

  const [connection] = await db
    .insert(chatConnections)
    .values({
      creatorId,
      sponsorCompanyId: company.id,
      sponsorUserId: user.id,
      requestedByUserId: user.id,
      status: "pending",
    })
    .returning({ id: chatConnections.id, status: chatConnections.status });

  return connection;
}

export async function getChatThreadForUser(threadId: string, user: ChatUser) {
  const thread = await getAuthorizedThread(threadId, user);
  const messages = await listMessages(threadId);

  return {
    ...thread,
    counterpartName: user.role === "sponsor" ? thread.creatorName : thread.sponsorName,
    messages,
  };
}

async function listMessages(threadId: string) {
  return db
    .select({
      id: chatMessages.id,
      connectionId: chatMessages.connectionId,
      senderUserId: chatMessages.senderUserId,
      senderName: profiles.fullName,
      senderRole: profiles.role,
      body: chatMessages.body,
      createdAt: chatMessages.createdAt,
    })
    .from(chatMessages)
    .innerJoin(profiles, eq(chatMessages.senderUserId, profiles.id))
    .where(eq(chatMessages.connectionId, threadId))
    .orderBy(asc(chatMessages.createdAt));
}

export async function getAuthorizedThread(threadId: string, user: ChatUser) {
  const [thread] = await db
    .select({
      id: chatConnections.id,
      status: chatConnections.status,
      creatorId: chatConnections.creatorId,
      sponsorCompanyId: chatConnections.sponsorCompanyId,
      sponsorUserId: chatConnections.sponsorUserId,
      creatorOwnerUserId: creators.createdByUserId,
      creatorName: creators.displayName,
      sponsorName: sponsorCompanies.name,
      sponsorIndustry: sponsorCompanies.industry,
      createdAt: chatConnections.createdAt,
      acceptedAt: chatConnections.acceptedAt,
      closedAt: chatConnections.closedAt,
      lastMessageAt: chatConnections.lastMessageAt,
    })
    .from(chatConnections)
    .innerJoin(creators, eq(chatConnections.creatorId, creators.id))
    .innerJoin(sponsorCompanies, eq(chatConnections.sponsorCompanyId, sponsorCompanies.id))
    .where(eq(chatConnections.id, threadId))
    .limit(1);

  if (!thread) {
    throw new Error("Conversacion no encontrada.");
  }

  const isSponsor = user.role === "sponsor" && thread.sponsorUserId === user.id;
  const isCreator = user.role === "creator" && thread.creatorOwnerUserId === user.id;

  if (!isSponsor && !isCreator) {
    throw new Error("No tienes acceso a esta conversacion.");
  }

  return thread;
}

export async function acceptChatConnection(threadId: string, user: ChatUser) {
  requireRole(user, "creator");
  const thread = await getAuthorizedThread(threadId, user);

  if (thread.status !== "pending") {
    throw new Error("Solo se pueden aceptar conversaciones pendientes.");
  }

  const now = new Date();
  const [updated] = await db
    .update(chatConnections)
    .set({
      status: "accepted",
      acceptedByUserId: user.id,
      acceptedAt: now,
      updatedAt: now,
    })
    .where(eq(chatConnections.id, threadId))
    .returning({ id: chatConnections.id, status: chatConnections.status, acceptedAt: chatConnections.acceptedAt });

  return updated;
}

export async function closeChatConnection(threadId: string, user: ChatUser) {
  const thread = await getAuthorizedThread(threadId, user);

  if (thread.status === "closed") {
    return { id: thread.id, status: thread.status, closedAt: thread.closedAt };
  }

  const now = new Date();
  const [updated] = await db
    .update(chatConnections)
    .set({
      status: "closed",
      closedByUserId: user.id,
      closedAt: now,
      updatedAt: now,
    })
    .where(eq(chatConnections.id, threadId))
    .returning({ id: chatConnections.id, status: chatConnections.status, closedAt: chatConnections.closedAt });

  return updated;
}

export async function addChatMessage(threadId: string, user: ChatUser, rawBody: string) {
  const body = rawBody.trim();
  if (!body) {
    throw new Error("El mensaje no puede estar vacio.");
  }

  if (body.length > 2000) {
    throw new Error("El mensaje no puede superar 2000 caracteres.");
  }

  const thread = await getAuthorizedThread(threadId, user);
  if (thread.status !== "accepted") {
    throw new Error("La conversacion debe estar aceptada para poder enviar mensajes.");
  }

  const [message] = await db
    .insert(chatMessages)
    .values({
      connectionId: threadId,
      senderUserId: user.id,
      body,
    })
    .returning({
      id: chatMessages.id,
      connectionId: chatMessages.connectionId,
      senderUserId: chatMessages.senderUserId,
      body: chatMessages.body,
      createdAt: chatMessages.createdAt,
    });

  const now = new Date();
  await db
    .update(chatConnections)
    .set({ lastMessageAt: message.createdAt ?? now, updatedAt: now })
    .where(eq(chatConnections.id, threadId));

  return {
    ...message,
    senderName: displayName(user, user.role === "creator" ? "Creator" : "Sponsor"),
    senderRole: user.role,
  };
}
