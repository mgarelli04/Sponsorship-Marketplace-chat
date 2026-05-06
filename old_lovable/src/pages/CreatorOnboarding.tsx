import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, Upload, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const steps = ["Import Profile", "Review Details", "Sponsorship Packages", "Preview & Launch"];

export default function CreatorOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);

  const simulateImport = () => {
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setImported(true);
    }, 2000);
  };

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else navigate("/creator/dashboard");
  };
  const back = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center text-accent-foreground font-bold text-sm">S</div>
            <span className="font-display font-bold text-foreground">SponsorHub</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/creator/dashboard")} className="text-muted-foreground">Skip for now</Button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-12">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-all ${
                i < currentStep ? "bg-trust text-trust-foreground" : i === currentStep ? "bg-gradient-accent text-accent-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === currentStep ? "text-foreground font-medium" : "text-muted-foreground"}`}>{step}</span>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < currentStep ? "bg-trust" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
            {currentStep === 0 && (
              <div className="text-center">
                <h2 className="font-display text-3xl font-bold text-foreground mb-3">Import your Eventbrite profile</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">We'll pull your organizer details, past events, and audience data to build your media kit.</p>
                {!imported ? (
                  <div className="bg-card rounded-xl border border-border p-12 shadow-card max-w-sm mx-auto">
                    <div className="text-5xl mb-4">📅</div>
                    <Button onClick={simulateImport} disabled={importing} className="bg-gradient-accent text-accent-foreground hover:opacity-90 border-0 h-12 px-8">
                      {importing ? (
                        <span className="flex items-center gap-2">
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full" />
                          Importing...
                        </span>
                      ) : "Continue with Eventbrite"}
                    </Button>
                  </div>
                ) : (
                  <div className="bg-card rounded-xl border border-trust/30 p-8 shadow-card max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-full bg-trust/10 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-6 h-6 text-trust" />
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-2">Import successful!</h3>
                    <p className="text-sm text-muted-foreground mb-1">Neon Nights Festival</p>
                    <p className="text-xs text-muted-foreground">3 events · 29,700 total attendees · Los Angeles</p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">Review your profile</h2>
                <p className="text-muted-foreground mb-8">Verify the imported data and add missing details.</p>
                <div className="space-y-6 bg-card rounded-xl border border-border p-8 shadow-card">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center text-3xl">🎵</div>
                    <div>
                      <div className="font-display font-semibold text-foreground text-lg">Neon Nights Festival</div>
                      <Badge variant="outline" className="bg-trust/10 text-trust border-trust/30 text-xs">Verified via Eventbrite</Badge>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Organizer Name</Label>
                      <Input defaultValue="Neon Nights Festival" className="mt-1.5" />
                    </div>
                    <div>
                      <Label className="text-sm">Category</Label>
                      <Input defaultValue="Music Festival" className="mt-1.5" />
                    </div>
                    <div>
                      <Label className="text-sm">Location</Label>
                      <Input defaultValue="Los Angeles, CA" className="mt-1.5" />
                    </div>
                    <div>
                      <Label className="text-sm">Website</Label>
                      <Input defaultValue="neonnights.com" className="mt-1.5" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Tagline</Label>
                    <Input defaultValue="California's premier electronic music experience" className="mt-1.5" />
                  </div>
                  <div>
                    <Label className="text-sm">About</Label>
                    <Textarea defaultValue="Neon Nights brings together 15,000+ electronic music fans for a 3-day immersive experience featuring world-class DJs, interactive art installations, and brand activation zones." className="mt-1.5" rows={3} />
                  </div>

                  {/* Contact Information */}
                  <div className="pt-2 border-t border-border">
                    <h3 className="font-display font-semibold text-foreground text-sm mb-3">Contact Information</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">Contact Email</Label>
                        <Input type="email" defaultValue="partnerships@neonnights.com" className="mt-1.5" placeholder="partnerships@example.com" />
                      </div>
                      <div>
                        <Label className="text-sm">Phone Number</Label>
                        <Input type="tel" defaultValue="+1 (310) 555-0192" className="mt-1.5" placeholder="+1 (555) 000-0000" />
                      </div>
                      <div>
                        <Label className="text-sm">Contact Person</Label>
                        <Input defaultValue="Alex Rivera" className="mt-1.5" placeholder="Full name" />
                      </div>
                      <div>
                        <Label className="text-sm">Role / Title</Label>
                        <Input defaultValue="Head of Partnerships" className="mt-1.5" placeholder="e.g. Marketing Director" />
                      </div>
                    </div>
                  </div>

                  {/* Social & Additional Info */}
                  <div className="pt-2 border-t border-border">
                    <h3 className="font-display font-semibold text-foreground text-sm mb-3">Social & Additional Details</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">Instagram</Label>
                        <Input defaultValue="@neonnightsfest" className="mt-1.5" placeholder="@handle" />
                      </div>
                      <div>
                        <Label className="text-sm">LinkedIn</Label>
                        <Input defaultValue="linkedin.com/company/neonnights" className="mt-1.5" placeholder="LinkedIn URL" />
                      </div>
                      <div>
                        <Label className="text-sm">Twitter / X</Label>
                        <Input defaultValue="@neonnights" className="mt-1.5" placeholder="@handle" />
                      </div>
                      <div>
                        <Label className="text-sm">TikTok</Label>
                        <Input defaultValue="@neonnightsfest" className="mt-1.5" placeholder="@handle" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm mb-2 block">Imported Events</Label>
                    <div className="space-y-2">
                      {["Neon Nights Summer 2024 · LA · 15,200 attendees", "Neon Nights NYE 2024 · LA · 8,500 attendees", "Neon Nights Spring 2024 · SD · 6,000 attendees"].map((e) => (
                        <div key={e} className="flex items-center gap-2 p-3 rounded-lg bg-muted text-sm">
                          <Check className="w-4 h-4 text-trust shrink-0" />
                          <span className="text-foreground">{e}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">Define your sponsorship packages</h2>
                <p className="text-muted-foreground mb-8">Set up standardized packages so sponsors can evaluate quickly.</p>
                <div className="space-y-4">
                  {[
                    { tier: "Bronze", price: "$5,000", color: "bg-amber-700/10 text-amber-700 border-amber-700/20" },
                    { tier: "Silver", price: "$15,000", color: "bg-slate-400/10 text-slate-500 border-slate-400/20" },
                    { tier: "Gold", price: "$35,000", color: "bg-accent/10 text-accent border-accent/20" },
                  ].map((pkg) => (
                    <div key={pkg.tier} className="bg-card rounded-xl border border-border p-6 shadow-card">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Badge className={pkg.color}>{pkg.tier}</Badge>
                          <Input defaultValue={pkg.price} className="w-32 h-8 text-sm" />
                        </div>
                        <Button variant="ghost" size="sm"><X className="w-4 h-4" /></Button>
                      </div>
                      <div className="mt-3">
                        <Label className="text-xs">Package Description</Label>
                        <Textarea defaultValue={pkg.tier === "Bronze" ? "Perfect for brands looking to get initial exposure at our events. Includes basic logo visibility across our digital and physical channels, ideal for testing audience alignment before committing to a larger partnership." : pkg.tier === "Silver" ? "Our most balanced sponsorship package, designed for brands seeking meaningful engagement with our audience. Includes prominent on-site presence, digital reach, and direct access to attendees through curated experiences and content." : "The ultimate brand partnership experience. Full creative integration across every touchpoint — from main stage presence to exclusive activation zones. Ideal for brands ready to make a bold statement and build lasting connections with our community."} className="mt-1 text-sm" rows={3} />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3 mt-3">
                        <div>
                          <Label className="text-xs">Estimated Impressions</Label>
                          <Input defaultValue={pkg.tier === "Bronze" ? "50,000" : pkg.tier === "Silver" ? "200,000" : "500,000"} className="mt-1 h-8 text-sm" />
                        </div>
                        <div>
                          <Label className="text-xs">Estimated Reach</Label>
                          <Input defaultValue={pkg.tier === "Bronze" ? "15,000" : pkg.tier === "Silver" ? "45,000" : "120,000"} className="mt-1 h-8 text-sm" />
                        </div>
                      </div>
                      <div className="mt-3">
                        <Label className="text-xs">Benefits (comma-separated)</Label>
                        <Input defaultValue={pkg.tier === "Bronze" ? "Logo on website, Social mention, Banner" : pkg.tier === "Silver" ? "Stage mentions, Branded lounge, Email blast, 10 VIP passes" : "Title sponsorship, Main stage branding, Activation zone, Full media, 25 VIP passes"} className="mt-1 h-8 text-sm" />
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full border-dashed h-12"><Plus className="w-4 h-4 mr-2" /> Add Package</Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-trust/10 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-trust" />
                </div>
                <h2 className="font-display text-3xl font-bold text-foreground mb-3">Your media kit is ready!</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">Your dynamic media kit is live and discoverable by sponsors. You can edit it anytime from your dashboard.</p>
                <div className="bg-card rounded-xl border border-border p-6 shadow-card max-w-sm mx-auto mb-8">
                  <div className="text-4xl mb-3">🎵</div>
                  <div className="font-display font-semibold text-foreground mb-1">Neon Nights Festival</div>
                  <div className="text-sm text-muted-foreground mb-3">Music Festival · Los Angeles, CA</div>
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <span>15K+ audience</span>
                    <span>3 events</span>
                    <span className="text-trust font-medium">✓ Verified</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Nav buttons */}
        <div className="flex items-center justify-between mt-10">
          <Button variant="ghost" onClick={back} disabled={currentStep === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button onClick={next} className="bg-gradient-accent text-accent-foreground hover:opacity-90 border-0 px-8"
            disabled={currentStep === 0 && !imported}>
            {currentStep === steps.length - 1 ? "Go to Dashboard" : "Continue"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
