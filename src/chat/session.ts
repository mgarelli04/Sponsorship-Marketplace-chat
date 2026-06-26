import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";
import { authOptions } from "../auth/options";
import { db } from "../db/db";
import { profiles } from "../db/schema";
import type { ChatRole, ChatUser } from "./repository";

async function getDemoUserFromCookies(): Promise<ChatUser | null> {
  const cookieStore = await cookies();
  const id = cookieStore.get("demo-user-id")?.value;
  const role = cookieStore.get("demo-role")?.value;

  if (!id || (role !== "creator" && role !== "sponsor")) {
    return null;
  }

  const [profile] = await db
    .select({
      id: profiles.id,
      email: profiles.email,
      fullName: profiles.fullName,
      role: profiles.role,
    })
    .from(profiles)
    .where(eq(profiles.id, id))
    .limit(1);

  if (!profile) {
    return null;
  }

  return {
    id: profile.id,
    role: role as ChatRole,
    email: profile.email,
    name: profile.fullName,
  };
}

export async function getCurrentChatUser(): Promise<ChatUser> {
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;

    if (session?.user?.id && (role === "creator" || role === "sponsor")) {
      return {
        id: session.user.id,
        role: role as ChatRole,
        email: session.user.email,
        name: session.user.name,
      };
    }
  } catch {}

  const demoUser = await getDemoUserFromCookies();

  if (demoUser) {
    return demoUser;
  }

  throw new Error("Unauthorized");
}
