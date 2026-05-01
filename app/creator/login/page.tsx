"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function CreatorLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLinkedInLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn("linkedin", { redirectTo: "/creator/dashboard" });
    } catch (err) {
      setError("Fallo al iniciar sesión con LinkedIn. Intenta de nuevo.");
      setIsLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-[#f5f6f8] md:grid-cols-[1.1fr_0.9fr]">
      <section className="relative overflow-hidden bg-linear-to-br from-[#07163c] via-[#0c1e4a] to-[#1a2b5a] px-8 py-10 text-white md:px-12 md:py-14">
        <div
          className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/4"
          aria-hidden="true"
        />
        <div
          className="absolute right-16 top-16 h-56 w-56 rounded-full bg-white/5"
          aria-hidden="true"
        />

        <div className="relative z-10 flex min-h-[30vh] flex-col justify-between md:min-h-[calc(100vh-7rem)]">
          <div>
            <Link 
              className="inline-flex items-center gap-3" 
              href="/" 
              aria-label="SponsorHub home"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f79009] text-sm font-bold lowercase text-white">
                s
              </span>
              <span className="text-xl font-bold tracking-tight md:text-2xl">SponsorHub</span>
            </Link>

            <div className="mt-16 max-w-lg">
              <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                <span className="block text-white">Bienvenido,</span>
                <span className="block text-[#f79a1d]">creador</span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-relaxed text-[#aab7d4] md:text-lg">
                Conecta tu plataforma de eventos y atrae sponsors verificados.
                Crea tu media kit y comienza a recibir ofertas.
              </p>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-[#8fa0c9] md:mt-0 md:text-base">
            <span>📊 Media Kits Dinámicos</span>
            <span>✅ Sponsors Verificados</span>
            <span>💰 Mejor Matching</span>
          </div>
        </div>
      </section>

      <section className="grid place-items-center px-6 py-12 md:px-10 md:py-16">
        <div className="w-full max-w-lg">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-sm text-[#6b7e9e] hover:text-[#0f1c3f] mb-6"
          >
            <span>←</span> Atrás
          </Link>
          
          <h2 className="text-2xl font-bold tracking-tight text-[#0f1c3f] md:text-3xl">
            Creator Login
          </h2>
          <p className="mt-3 text-sm text-[#6b7e9e] md:text-base">
            Conecta tu plataforma de eventos para empezar
          </p>

          <div className="mt-8 space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                {error}
              </div>
            )}
            
            <button
              onClick={handleLinkedInLogin}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#d9e0eb] bg-white px-5 py-4 transition hover:border-[#c5cfdf] hover:shadow-[0_4px_12px_rgba(18,34,72,0.06)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-2xl" aria-hidden="true">
                in
              </span>
              <span>
                <span className="block text-lg font-semibold text-[#0f1c3f] md:text-xl">
                  {isLoading ? "Conectando..." : "Continue with LinkedIn"}
                </span>
              </span>
            </button>

            <div className="mt-8 rounded-lg bg-[#eef5ff] p-4 text-sm text-[#5b7399]">
              <p className="font-medium mb-2">¿Por qué LinkedIn?</p>
              <p>
                Verificamos tu identidad y experiencia directamente desde tu perfil
                de LinkedIn para garantizar confianza entre creadores y sponsors.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
