import { Link } from "react-router-dom";
import { Bell, Shield, CheckCircle2, MapPin, Calendar, Users, TrendingUp, BarChart3, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { creators } from "@/data/mockData";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Tooltip as RTooltip } from "recharts";

const creator = creators[0];
const COLORS = ["#F59E0B", "#3B82F6", "#8B5CF6", "#6B7280"];

export default function MediaKit() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-accent flex items-center justify-center text-accent-foreground font-bold text-xs">S</div>
              <span className="font-display font-bold text-foreground">SponsorHub</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <Link to="/creator/dashboard"><Button variant="ghost" size="sm" className="text-sm text-muted-foreground">Dashboard</Button></Link>
              <Link to="/creator/media-kit"><Button variant="ghost" size="sm" className="text-sm font-medium">Media Kit</Button></Link>
              <Link to="/creator/crm"><Button variant="ghost" size="sm" className="text-sm text-muted-foreground">Leads</Button></Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="text-xs gap-1"><ExternalLink className="w-3 h-3" /> Share</Button>
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-sm">🎵</div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden mb-8">
          <div className="h-32 bg-gradient-hero" />
          <div className="p-6 -mt-10">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-20 h-20 rounded-2xl bg-card border-4 border-card shadow-lg flex items-center justify-center text-4xl">{creator.logo}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="font-display text-2xl font-bold text-foreground">{creator.name}</h1>
                  {creator.verified && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge className="bg-trust/10 text-trust border-trust/30 gap-1"><Shield className="w-3 h-3" /> Verified</Badge>
                      </TooltipTrigger>
                      <TooltipContent>Audience data verified via Eventbrite integration</TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mb-2">{creator.tagline}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{creator.location}</span>
                  <Badge variant="outline" className="text-xs">{creator.category}</Badge>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{creator.audienceSize.toLocaleString()} audience</span>
                  <span className="text-xs text-muted-foreground">Updated {creator.lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <section className="bg-card rounded-xl border border-border p-6 shadow-card mb-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">About</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{creator.about}</p>
        </section>

        {/* Past Events */}
        <section className="bg-card rounded-xl border border-border p-6 shadow-card mb-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Past Events</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {creator.pastEvents.map((e) => (
              <div key={e.name} className="rounded-lg border border-border p-4 bg-muted/30">
                <div className="font-medium text-foreground text-sm mb-2">{e.name}</div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{e.date}</div>
                  <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{e.city}</div>
                  <div className="flex items-center gap-1"><Users className="w-3 h-3" />{e.attendance.toLocaleString()} attendees</div>
                  <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-trust" />{e.checkIns.toLocaleString()} check-ins
                    <Tooltip><TooltipTrigger><Shield className="w-3 h-3 text-trust" /></TooltipTrigger><TooltipContent>Verified from ticketing platform</TooltipContent></Tooltip>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Audience Insights */}
        <section className="bg-card rounded-xl border border-border p-6 shadow-card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">Audience Insights</h2>
            <Badge className="bg-trust/10 text-trust border-trust/30 text-xs gap-1"><Shield className="w-3 h-3" /> Verified Data</Badge>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Age */}
            <div>
              <div className="text-sm font-medium text-foreground mb-3">Age Distribution</div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={creator.demographics.ageGroups} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={35} outerRadius={60} strokeWidth={2}>
                      {creator.demographics.ageGroups.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <RTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {creator.demographics.ageGroups.map((g, i) => (
                  <span key={g.label} className="text-xs flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />{g.label}: {g.value}%</span>
                ))}
              </div>
            </div>
            {/* Gender */}
            <div>
              <div className="text-sm font-medium text-foreground mb-3">Gender Split</div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={creator.demographics.gender} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="label" tick={{ fontSize: 11 }} width={60} />
                    <Bar dataKey="value" fill="hsl(38 92% 50%)" radius={[0, 4, 4, 0]} />
                    <RTooltip />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Locations */}
            <div>
              <div className="text-sm font-medium text-foreground mb-3">Top Locations</div>
              <div className="space-y-3">
                {creator.demographics.topLocations.map((loc) => (
                  <div key={loc.city}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-foreground">{loc.city}</span>
                      <span className="text-muted-foreground">{loc.percentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-gradient-accent rounded-full" style={{ width: `${loc.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Interests & Returning */}
            <div>
              <div className="text-sm font-medium text-foreground mb-3">Interests</div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {creator.demographics.interests.map((i) => (
                  <Badge key={i} variant="outline" className="text-xs">{i}</Badge>
                ))}
              </div>
              <div className="rounded-lg bg-trust/5 border border-trust/20 p-3">
                <div className="text-2xl font-display font-bold text-trust">{creator.demographics.returningAttendees}%</div>
                <div className="text-xs text-muted-foreground">Returning Attendees</div>
              </div>
            </div>
          </div>
        </section>

        {/* Ticket vs Check-in */}
        <section className="bg-card rounded-xl border border-border p-6 shadow-card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">Ticket Sales vs Check-ins</h2>
            <Badge className="bg-trust/10 text-trust border-trust/30 text-xs gap-1"><Shield className="w-3 h-3" /> Verified</Badge>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={creator.pastEvents.map((e) => ({ name: e.name.replace("Neon Nights ", ""), tickets: e.attendance, checkIns: e.checkIns }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <RTooltip />
                <Bar dataKey="tickets" fill="hsl(222 47% 11%)" radius={[4, 4, 0, 0]} name="Tickets Sold" />
                <Bar dataKey="checkIns" fill="hsl(38 92% 50%)" radius={[4, 4, 0, 0]} name="Check-ins" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Previous Sponsors */}
        <section className="bg-card rounded-xl border border-border p-6 shadow-card mb-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Previous Sponsors</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {creator.previousSponsors.map((s) => (
              <div key={s.name} className="rounded-lg border border-border p-4 text-center bg-muted/30">
                <div className="text-3xl mb-2">{s.logo}</div>
                <div className="font-medium text-foreground text-sm">{s.name}</div>
                <div className="text-xs text-trust mt-1">{s.metric}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Inventory */}
        <section className="bg-card rounded-xl border border-border p-6 shadow-card mb-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Sponsorship Inventory</h2>
          <div className="flex flex-wrap gap-2">
            {creator.inventory.map((item) => (
              <Badge key={item} variant="outline" className="py-1.5 px-3 text-sm">{item}</Badge>
            ))}
          </div>
        </section>

        {/* Packages */}
        <section className="mb-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Sponsorship Packages</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {creator.packages.map((pkg) => (
              <div key={pkg.tier} className={`bg-card rounded-xl border p-6 shadow-card relative ${pkg.tier === "Gold" ? "border-accent ring-2 ring-accent/20" : "border-border"}`}>
                {pkg.tier === "Gold" && <Badge className="absolute -top-2.5 left-4 bg-gradient-accent text-accent-foreground border-0">Most Popular</Badge>}
                <Badge variant="outline" className={`mb-3 ${pkg.tier === "Bronze" ? "text-amber-700 border-amber-700/20" : pkg.tier === "Silver" ? "text-slate-500 border-slate-400/20" : "text-accent border-accent/20"}`}>{pkg.tier}</Badge>
                <div className="text-3xl font-display font-bold text-foreground mb-1">${pkg.price.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mb-4">CPM: ${pkg.cpm} · {pkg.impressions.toLocaleString()} impressions</div>
                <ul className="space-y-2 mb-6">
                  {pkg.benefits.map((b) => (
                    <li key={b} className="text-sm text-muted-foreground flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-trust shrink-0 mt-0.5" />{b}</li>
                  ))}
                </ul>
                <Link to="/sponsor/match">
                  <Button className={`w-full ${pkg.tier === "Gold" ? "bg-gradient-accent text-accent-foreground hover:opacity-90 border-0" : ""}`} variant={pkg.tier === "Gold" ? "default" : "outline"}>
                    Sponsor this creator
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
