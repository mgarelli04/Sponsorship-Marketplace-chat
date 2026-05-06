import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        expectedRole: { label: "Expected Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const expectedRole = credentials.expectedRole?.toLowerCase() as
          | "creator"
          | "sponsor"
          | undefined;

        // Verificar usuario en Supabase
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

        if (signInError || !signInData.user) {
          if (signInError?.message.includes("Invalid login credentials")) {
            throw new Error("Invalid password");
          }
          throw new Error(signInError?.message || "User not found");
        }

        // Obtener el rol del usuario desde app_metadata (raw_app_meta_data en Supabase)
        const metadataRole = (signInData.user.app_metadata?.role as string | undefined)?.toLowerCase();
        const userRole =
          metadataRole === "creator" || metadataRole === "sponsor"
            ? metadataRole
            : undefined;

        const metadataProvider = signInData.user.app_metadata?.provider;
        const userProvider =
          typeof metadataProvider === "string" ? metadataProvider : undefined;

        const metadataProviders = signInData.user.app_metadata?.providers;
        const userProviders = Array.isArray(metadataProviders)
          ? metadataProviders.filter(
              (value): value is string => typeof value === "string"
            )
          : undefined;

        const fullName =
          typeof signInData.user.user_metadata?.full_name === "string"
            ? signInData.user.user_metadata.full_name
            : "";

        // Bloquea login cruzado: creator en form sponsor o sponsor en form creator
        if (expectedRole && userRole !== expectedRole) {
          throw new Error("Invalid role for this form");
        }

        return {
          id: signInData.user.id,
          email: signInData.user.email,
          name: fullName,
          role: userRole,
          provider: userProvider,
          providers: userProviders,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.provider = user.provider;
        token.providers = user.providers;
        if (user.email) {
          token.email = user.email;
        }
        if (user.name) {
          token.name = user.name;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        session.user.provider = token.provider;
        session.user.providers = token.providers;
        if (token.email) {
          session.user.email = token.email;
        }
        if (token.name) {
          session.user.name = token.name;
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // No permitir login si el rol no es válido
      // En este punto, el rol ya se validó en el authorize callback
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
