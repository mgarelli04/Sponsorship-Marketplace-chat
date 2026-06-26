import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getServerSession } from "next-auth";
import { AuthProvider } from "./auth-provider";
import { authOptions } from "@/src/auth/options";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SponsorHub | Marketplace de Patrocinios",
  description:
    "Conecta marcas con creadores de eventos en un marketplace de patrocinios basado en datos verificables.",
  openGraph: {
    title: "SponsorHub | Marketplace de Patrocinios",
    description:
      "Encuentra creadores, explora media kits y cierra patrocinios con audiencias verificadas.",
    siteName: "SponsorHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SponsorHub | Marketplace de Patrocinios",
    description:
      "La plataforma para conectar sponsors y creadores con datos reales y deals mas rapidos.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider session={session}>{children}</AuthProvider>
      </body>
    </html>
  );
}
