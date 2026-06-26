import { NextRequest, NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import { eq } from "drizzle-orm";
import { createClient } from "@supabase/supabase-js";
import { db } from "@/src/db/db";
import { profiles } from "@/src/db/schema";

const DEMO_PASSWORDS = new Set(["SeedPass123!", "Seed123!"]);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

function normalizeRole(value: string | null) {
  return value === "creator" ? "creator" : "sponsor";
}

function redirectForRole(request: NextRequest, role: "creator" | "sponsor") {
  return new URL(role === "creator" ? "/creator/dashboard" : "/sponsor/discover", request.url);
}

async function findProfile(email: string) {
  const [profile] = await db
    .select({
      id: profiles.id,
      email: profiles.email,
      fullName: profiles.fullName,
      role: profiles.role,
    })
    .from(profiles)
    .where(eq(profiles.email, email))
    .limit(1);

  return profile;
}

async function createResponseWithSession({
  request,
  profile,
  role,
}: {
  request: NextRequest;
  profile: { id: string; email: string; fullName: string; role: string };
  role: "creator" | "sponsor";
}) {
  const secret = process.env.NEXTAUTH_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "Falta NEXTAUTH_SECRET en .env.local" }, { status: 500 });
  }

  const maxAge = 30 * 24 * 60 * 60;
  const sessionToken = await encode({
    secret,
    maxAge,
    token: {
      id: profile.id,
      sub: profile.id,
      email: profile.email,
      name: profile.fullName,
      role,
    },
  });

  const response = NextResponse.redirect(redirectForRole(request, role));

  response.cookies.set("next-auth.session-token", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  response.cookies.set("demo-user-id", profile.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  response.cookies.set("demo-role", role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  return response;
}

async function loginWithEmailPassword({
  request,
  email,
  password,
  expectedRole,
}: {
  request: NextRequest;
  email: string;
  password: string;
  expectedRole: "creator" | "sponsor";
}) {
  const normalizedEmail = email.trim().toLowerCase();
  const profile = await findProfile(normalizedEmail);

  if (!profile) {
    return NextResponse.redirect(new URL(`/${expectedRole}/login?error=user`, request.url));
  }

  if (profile.role !== expectedRole) {
    return NextResponse.redirect(new URL(`/${expectedRole}/login?error=role`, request.url));
  }

  if (!DEMO_PASSWORDS.has(password)) {
    if (!supabase) {
      return NextResponse.redirect(new URL(`/${expectedRole}/login?error=password`, request.url));
    }

    const { error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
    if (error) {
      return NextResponse.redirect(new URL(`/${expectedRole}/login?error=password`, request.url));
    }
  }

  return createResponseWithSession({ request, profile, role: expectedRole });
}

export async function GET(request: NextRequest) {
  const role = normalizeRole(request.nextUrl.searchParams.get("role"));
  const n = request.nextUrl.searchParams.get("n")?.match(/^\d+$/)
    ? request.nextUrl.searchParams.get("n")
    : "1";
  const email =
    request.nextUrl.searchParams.get("email") ||
    (role === "creator" ? `creator${n}@seed.example.com` : `sponsor${n}@seed.example.com`);

  const profile = await findProfile(email.trim().toLowerCase());

  if (!profile) {
    return NextResponse.json(
      { error: `No existe el usuario demo ${email}. Ejecuta npm run db:seed.` },
      { status: 404 },
    );
  }

  return createResponseWithSession({ request, profile, role });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const expectedRole = normalizeRole(String(formData.get("expectedRole") ?? formData.get("role") ?? "sponsor"));

  if (!email || !password) {
    return NextResponse.redirect(new URL(`/${expectedRole}/login?error=missing`, request.url));
  }

  return loginWithEmailPassword({ request, email, password, expectedRole });
}
