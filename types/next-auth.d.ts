import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: "creator" | "sponsor";
      provider?: string;
      providers?: string[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: "creator" | "sponsor";
    provider?: string;
    providers?: string[];
  }

  interface JWT {
    id?: string;
    role?: "creator" | "sponsor";
    provider?: string;
    providers?: string[];
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "creator" | "sponsor";
    provider?: string;
    providers?: string[];
    accessToken?: string;
  }
}

