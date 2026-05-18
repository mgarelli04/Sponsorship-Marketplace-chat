"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type UserType = "creator" | "sponsor";
type FormType = "login" | "register";

interface AuthFormProps {
  userType: UserType;
  formType: FormType;
}

const messages = {
  creator: {
    login: {
      title: "Bienvenido, creador",
      subtitle: "Conecta tu plataforma de eventos para empezar",
      titleAlt: "Creator Login",
      backLink: "/login",
      button: "Iniciar sesión",
      noAccount: "¿No tienes cuenta?",
      hasAccount: "¿Ya tienes cuenta?",
      features: ["📊 Media Kits Dinámicos", "✅ Sponsors Verificados", "💰 Mejor Matching"],
    },
    register: {
      title: "Únete como creador",
      subtitle: "Completa tu registro para empezar a recibir ofertas",
      titleAlt: "Creator Register",
      backLink: "/login",
      button: "Registrarse",
      noAccount: "¿Ya tienes cuenta?",
      hasAccount: "¿No tienes cuenta?",
      features: ["📊 Media Kits Dinámicos", "✅ Sponsors Verificados", "💰 Mejor Matching"],
    },
  },
  sponsor: {
    login: {
      title: "Welcome, sponsor brand",
      subtitle: "Sign in to discover sponsorship opportunities",
      titleAlt: "Sponsor Login",
      backLink: "/login",
      button: "Sign In",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      features: ["🔎 Curated Creators", "📩 Faster Outreach", "📈 Smarter Campaigns"],
    },
    register: {
      title: "Join as a sponsor",
      subtitle: "Complete your registration to start discovering creators",
      titleAlt: "Sponsor Register",
      backLink: "/login",
      button: "Sign Up",
      noAccount: "Already have an account?",
      hasAccount: "Don't have an account?",
      features: ["🔎 Curated Creators", "📩 Faster Outreach", "📈 Smarter Campaigns"],
    },
  },
};

const urlConfig = {
  creator: {
    redirect: "/creator/dashboard",
    login: "/creator/login",
    register: "/creator/register",
  },
  sponsor: {
    redirect: "/sponsor/discover",
    login: "/sponsor/login",
    register: "/sponsor/register",
  },
};

export default function AuthForm({ userType, formType }: AuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const config = messages[userType][formType];
  const urls = urlConfig[userType];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (formType === "register") {
        // Llamar endpoint de registro
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            fullName,
            userType,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Error al registrarse");
          setIsLoading(false);
          return;
        }

        // Auto-login después del registro
        const result = await signIn("credentials", {
          email,
          password,
          expectedRole: userType,
          redirect: false,
        });

        if (result?.error) {
          setError(
            result.error === "User not found"
              ? "Usuario no encontrado"
              : result.error === "Invalid password"
                ? "Contraseña inválida"
                : result.error === "Invalid role for this form"
                  ? `No tienes permiso para acceder como ${userType}`
                  : result.error
          );
          setIsLoading(false);
          return;
        }

        router.push(urls.redirect);
      } else {
        // Login
        const result = await signIn("credentials", {
          email,
          password,
          expectedRole: userType,
          redirect: false,
        });

        if (result?.error) {
          setError(
            result.error === "User not found"
              ? "Usuario no encontrado"
              : result.error === "Invalid password"
                ? "Contraseña inválida"
                : result.error === "Invalid role for this form"
                  ? `No tienes permiso para acceder como ${userType}`
                  : result.error
          );
          setIsLoading(false);
          return;
        }

        router.push(urls.redirect);
      }
    } catch (err) {
      setError(formType === "register" ? "Error al registrarse" : "Error al iniciar sesión");
      setIsLoading(false);
    }
  };

  const toggleLink = formType === "login" ? urls.register : urls.login;

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
                {userType === "creator" ? (
                  <>
                    <span className="block text-white">
                      {formType === "login" ? "Bienvenido," : "Únete"}
                    </span>
                    <span className="block text-[#f79a1d]">
                      {formType === "login" ? "creador" : "como creador"}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block text-white">
                      {formType === "login" ? "Welcome," : "Join"}
                    </span>
                    <span className="block text-[#f7b14b]">
                      {formType === "login" ? "sponsor brand" : "as a sponsor"}
                    </span>
                  </>
                )}
              </h1>

              <p className="mt-6 max-w-md text-base leading-relaxed text-[#aab7d4] md:text-lg">
                {userType === "creator" ? (
                  formType === "login" ? (
                    "Conecta tu plataforma de eventos y atrae sponsors verificados. Crea tu media kit y comienza a recibir ofertas."
                  ) : (
                    "Completa tu registro y comienza a conectar con sponsors verificados."
                  )
                ) : (
                  formType === "login" ? (
                    "Discover verified creators, launch campaigns faster, and manage sponsorship opportunities from one place."
                  ) : (
                    "Complete your registration to start discovering creators and launch campaigns."
                  )
                )}
              </p>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-[#8fa0c9] md:mt-0 md:text-base">
            {config.features.map((feature) => (
              <span key={feature}>{feature}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid place-items-center px-6 py-12 md:px-10 md:py-16">
        <div className="w-full max-w-lg">
          <Link 
            href={config.backLink} 
            className="inline-flex items-center gap-2 text-sm text-[#6b7e9e] hover:text-[#0f1c3f] mb-6 transition"
          >
            <span>←</span> {userType === "creator" ? "Atrás" : "Back"}
          </Link>
          
          <h2 className="text-2xl font-bold tracking-tight text-[#0f1c3f] md:text-3xl">
            {config.titleAlt}
          </h2>
          <p className="mt-3 text-sm text-[#6b7e9e] md:text-base">
            {config.subtitle}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                {error}
              </div>
            )}

            {formType === "register" && (
              <div>
                <label 
                  htmlFor="fullName" 
                  className="block text-sm font-medium text-[#0f1c3f] mb-2"
                >
                  {userType === "creator" ? "Nombre completo" : "Full Name"}
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={userType === "creator" ? "Tu nombre" : "Your name"}
                  required
                  className="w-full rounded-lg border border-[#d9e0eb] px-4 py-3 transition focus:border-[#07163c] focus:outline-none focus:ring-2 focus:ring-[#07163c]/10"
                />
              </div>
            )}

            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-[#0f1c3f] mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full rounded-lg border border-[#d9e0eb] px-4 py-3 transition focus:border-[#07163c] focus:outline-none focus:ring-2 focus:ring-[#07163c]/10"
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-[#0f1c3f] mb-2"
              >
                {userType === "creator" ? "Contraseña" : "Password"}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full rounded-lg border border-[#d9e0eb] px-4 py-3 transition focus:border-[#07163c] focus:outline-none focus:ring-2 focus:ring-[#07163c]/10"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#07163c] px-5 py-3 font-semibold text-white transition hover:bg-[#0c1e4a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? userType === "creator"
                  ? "Cargando..."
                  : "Loading..."
                : config.button}
            </button>

            <div className="text-center text-sm text-[#6b7e9e]">
              {formType === "login" ? (
                <>
                  {config.noAccount}{" "}
                  <Link 
                    href={toggleLink}
                    className="font-semibold text-[#07163c] hover:text-[#0c1e4a] transition"
                  >
                    {userType === "creator" ? "Regístrate" : "Sign up"}
                  </Link>
                </>
              ) : (
                <>
                  {config.hasAccount}{" "}
                  <Link 
                    href={toggleLink}
                    className="font-semibold text-[#07163c] hover:text-[#0c1e4a] transition"
                  >
                    {userType === "creator" ? "Inicia sesión" : "Sign in"}
                  </Link>
                </>
              )}
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
