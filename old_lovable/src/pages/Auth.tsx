import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Linkedin, CalendarDays, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Role = "creator" | "sponsor" | "admin";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialRole = (searchParams.get("role") as Role) || null;
  const [selectedRole, setSelectedRole] = useState<Role | null>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === "creator") navigate("/onboarding");
    else if (selectedRole === "sponsor") navigate("/sponsor/discover");
    else if (selectedRole === "admin") navigate("/admin");
  };

  const roles = [
    { key: "creator" as Role, label: "Creator / Organizer", desc: "Build your media kit and attract sponsors", icon: "🎪" },
    { key: "sponsor" as Role, label: "Sponsor / Brand", desc: "Discover and connect with event creators", icon: "🏢" },
    { key: "admin" as Role, label: "Admin", desc: "Platform management and oversight", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero text-primary-foreground p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-16">
            <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center text-accent-foreground font-bold text-sm">S</div>
            <span className="font-display font-bold text-lg">SponsorHub</span>
          </Link>
          <h1 className="font-display text-4xl font-bold leading-tight mb-4">
            The marketplace where <br />
            <span className="text-gradient-accent">sponsorships happen</span>
          </h1>
          <p className="text-primary-foreground/60 text-lg max-w-md">
            Verified data. Dynamic media kits. Smarter matching. Join the platform redefining B2B sponsorships.
          </p>
        </div>
        <div className="relative z-10 flex gap-8 text-sm text-primary-foreground/50">
          <span>247+ Creators</span>
          <span>1,840 Brands</span>
          <span>93% Verified</span>
        </div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-accent" />
          <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-accent/50" />
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Back</span>
          </Link>

          <AnimatePresence mode="wait">
            {!selectedRole ? (
              <motion.div key="role-select" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">Welcome to SponsorHub</h2>
                <p className="text-muted-foreground mb-8">Choose how you'd like to get started</p>
                <div className="space-y-3">
                  {roles.map((role) => (
                    <button key={role.key} onClick={() => setSelectedRole(role.key)}
                      className="w-full p-5 rounded-xl border border-border bg-card hover:border-accent hover:shadow-card transition-all text-left flex items-center gap-4 group">
                      <span className="text-2xl">{role.icon}</span>
                      <div>
                        <div className="font-semibold text-foreground group-hover:text-accent transition-colors">{role.label}</div>
                        <div className="text-sm text-muted-foreground">{role.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="login-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => setSelectedRole(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  {selectedRole === "creator" ? "Creator Login" : selectedRole === "sponsor" ? "Sponsor Login" : "Admin Login"}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {selectedRole === "creator" ? "Connect your event platform to get started" : "Sign in to discover sponsorship opportunities"}
                </p>

                {selectedRole === "creator" && (
                  <div className="space-y-3 mb-6">
                    <Button onClick={() => navigate("/onboarding")} variant="outline" className="w-full h-12 justify-center gap-3 text-sm font-medium border-border hover:border-accent">
                      <CalendarDays className="w-5 h-5 text-[#F6682F]" />
                      Continue with Eventbrite
                    </Button>
                  </div>
                )}

                {selectedRole === "sponsor" && (
                  <div className="space-y-3 mb-6">
                    <Button onClick={() => navigate("/sponsor/discover")} variant="outline" className="w-full h-12 justify-center gap-3 text-sm font-medium border-border hover:border-accent">
                      <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                      Continue with LinkedIn
                    </Button>
                  </div>
                )}

                {(selectedRole === "sponsor" || selectedRole === "admin") && (
                  <>
                    {selectedRole === "sponsor" && (
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-xs text-muted-foreground uppercase">or</span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="mt-1.5 h-11" />
                      </div>
                      <div>
                        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1.5 h-11" />
                      </div>
                      <Button type="submit" className="w-full h-11 bg-gradient-accent text-accent-foreground hover:opacity-90 border-0">
                        {selectedRole === "admin" ? "Sign in" : "Get Started"}
                      </Button>
                    </form>
                  </>
                )}

                <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Your data is encrypted and secure</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
