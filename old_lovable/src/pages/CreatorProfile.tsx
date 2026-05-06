import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, MapPin, Users, Calendar, CheckCircle2, Heart, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { creators } from "@/data/mockData";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip } from "recharts";

const COLORS = ["#F59E0B", "#3B82F6", "#8B5CF6", "#6B7280"];

export default function CreatorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const creator = creators.find((c) => c.id === id) || creators[0];
  const [showInquiry, setShowInquiry] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setShowInquiry(false);
    navigate("/sponsor/match");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-4">
            <Link to="/sponsor/discover"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button></Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setSaved(!saved)} className={saved ? "border-accent text-accent" : ""}>
              <Heart className={`w-4 h-4 mr-1 ${saved ? "fill-accent" : ""}`} /> {saved ? "Saved" : "Save"}
            </Button>
            <Button size="sm" className="bg-gradient-accent text-accent-foreground hover:opacity-90 border-0" onClick={() => setShowInquiry(true)}>
              Sponsor this creator
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden mb-8">
          <div className="h-36 bg-gradient-hero" />
          <div className="p-6 -mt-12">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-24 h-24 rounded-2xl bg-card border-4 border-card shadow-lg flex items-center justify-center text-5xl">{creator.logo}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="font-display text-2xl font-bold text-foreground">{creator.name}</h1>
                  {creator.verified && (
                    <Tooltip>
                      <TooltipTrigger><Badge className="bg-trust/10 text-trust border-trust/30 gap-1"><Shield className="w-3 h-3" /> Verified</Badge></TooltipTrigger>
                      <TooltipContent>Audience data verified via Eventbrite integration</TooltipContent>
                    </Tooltip>
                  )}
                  {creator.matchScore && <Badge className="bg-accent/10 text-accent border-accent/20">{creator.matchScore}% match</Badge>}
                </div>
                <p className="text-muted-foreground text-sm mb-2">{creator.tagline}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{creator.location}</span>
                  <Badge variant="outline" className="text-xs">{creator.category}</Badge>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{creator.audienceSize.toLocaleString()} audience</span>
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

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Audience", value: creator.audienceSize.toLocaleString(), sub: "across all events" },
            { label: "Returning Rate", value: `${creator.demographics.returningAttendees}%`, sub: "loyal attendees" },
            { label: "Avg CPM", value: `$${creator.packages[1]?.cpm || creator.packages[0].cpm}`, sub: "silver package" },
            { label: "Events Hosted", value: creator.pastEvents.length.toString(), sub: "verified events" },
          ].map((k) => (
            <div key={k.label} className="bg-card rounded-xl border border-border p-5 shadow-card">
              <div className="text-2xl font-display font-bold text-foreground">{k.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{k.label}</div>
              <div className="text-[10px] text-trust mt-1">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Audience */}
        <section className="bg-card rounded-xl border border-border p-6 shadow-card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">Audience Insights</h2>
            <Badge className="bg-trust/10 text-trust border-trust/30 text-xs gap-1"><Shield className="w-3 h-3" /> Verified</Badge>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-sm font-medium text-foreground mb-3">Age Distribution</div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={creator.demographics.ageGroups} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={30} outerRadius={55} strokeWidth={2}>
                    {creator.demographics.ageGroups.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie><RTooltip /></PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-foreground mb-3">Gender</div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={creator.demographics.gender} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="label" tick={{ fontSize: 10 }} width={55} />
                    <Bar dataKey="value" fill="hsl(38 92% 50%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-foreground mb-3">Top Locations</div>
              <div className="space-y-2.5">
                {creator.demographics.topLocations.map((l) => (
                  <div key={l.city}>
                    <div className="flex justify-between text-xs mb-1"><span className="text-foreground">{l.city}</span><span className="text-muted-foreground">{l.percentage}%</span></div>
                    <div className="w-full h-1.5 rounded-full bg-muted"><div className="h-full bg-gradient-accent rounded-full" style={{ width: `${l.percentage}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-foreground mb-3">Interests</div>
              <div className="flex flex-wrap gap-1.5">
                {creator.demographics.interests.map((i) => <Badge key={i} variant="outline" className="text-xs">{i}</Badge>)}
              </div>
            </div>
          </div>
        </section>

        {/* Events */}
        <section className="bg-card rounded-xl border border-border p-6 shadow-card mb-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Past Events</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {creator.pastEvents.map((e) => (
              <div key={e.name} className="rounded-lg border border-border p-4">
                <div className="font-medium text-foreground text-sm mb-2">{e.name}</div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{e.date}</div>
                  <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{e.city}</div>
                  <div className="flex items-center gap-1"><Users className="w-3 h-3" />{e.attendance.toLocaleString()} · <CheckCircle2 className="w-3 h-3 text-trust" />{e.checkIns.toLocaleString()} check-ins</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Packages */}
        <section className="mb-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Sponsorship Packages</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {creator.packages.map((pkg) => (
              <div key={pkg.tier} className={`bg-card rounded-xl border p-6 shadow-card ${pkg.tier === "Gold" ? "border-accent ring-2 ring-accent/20" : "border-border"}`}>
                {pkg.tier === "Gold" && <Badge className="bg-gradient-accent text-accent-foreground border-0 mb-3">Most Popular</Badge>}
                <Badge variant="outline" className="mb-2">{pkg.tier}</Badge>
                <div className="text-2xl font-display font-bold text-foreground mb-1">${pkg.price.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mb-4">CPM: ${pkg.cpm} · {pkg.impressions.toLocaleString()} impr.</div>
                <ul className="space-y-1.5 mb-5">
                  {pkg.benefits.map((b) => <li key={b} className="text-sm text-muted-foreground flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-trust shrink-0 mt-0.5" />{b}</li>)}
                </ul>
                <Button className="w-full bg-gradient-accent text-accent-foreground hover:opacity-90 border-0" onClick={() => setShowInquiry(true)}>
                  Request Sponsorship
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Previous Sponsors */}
        <section className="bg-card rounded-xl border border-border p-6 shadow-card mb-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Previous Sponsors</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {creator.previousSponsors.map((s) => (
              <div key={s.name} className="rounded-lg border border-border p-4 text-center">
                <div className="text-3xl mb-2">{s.logo}</div>
                <div className="font-medium text-foreground text-sm">{s.name}</div>
                <div className="text-xs text-trust mt-1">{s.metric}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border p-4 z-30">
          <div className="container mx-auto max-w-5xl flex items-center justify-between">
            <div>
              <div className="font-display font-semibold text-foreground text-sm">{creator.name}</div>
              <div className="text-xs text-muted-foreground">Starting at ${creator.packages[0].price.toLocaleString()}</div>
            </div>
            <Button className="bg-gradient-accent text-accent-foreground hover:opacity-90 border-0 animate-pulse-glow" onClick={() => setShowInquiry(true)}>
              Sponsor this creator
            </Button>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      <Dialog open={showInquiry} onOpenChange={setShowInquiry}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Send Sponsorship Inquiry</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitInquiry} className="space-y-4">
            <div>
              <Label className="text-sm">Package of Interest</Label>
              <Select defaultValue="gold">
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {creator.packages.map((p) => <SelectItem key={p.tier} value={p.tier.toLowerCase()}>{p.tier} - ${p.price.toLocaleString()}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Campaign Objective</Label>
              <Select defaultValue="awareness">
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="awareness">Brand Awareness</SelectItem>
                  <SelectItem value="launch">Product Launch</SelectItem>
                  <SelectItem value="leads">Lead Generation</SelectItem>
                  <SelectItem value="community">Community Building</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Budget Range</Label>
                <Select defaultValue="30-50">
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5-15">$5K - $15K</SelectItem>
                    <SelectItem value="15-30">$15K - $30K</SelectItem>
                    <SelectItem value="30-50">$30K - $50K</SelectItem>
                    <SelectItem value="50+">$50K+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Preferred Date</Label>
                <Input type="date" className="mt-1.5" defaultValue="2025-07-15" />
              </div>
            </div>
            <div>
              <Label className="text-sm">Your Name</Label>
              <Input className="mt-1.5" placeholder="Sarah Chen" />
            </div>
            <div>
              <Label className="text-sm">Company Email</Label>
              <Input className="mt-1.5" type="email" placeholder="sarah@company.com" />
            </div>
            <div>
              <Label className="text-sm">Notes / Requirements</Label>
              <Textarea className="mt-1.5" placeholder="Tell the creator about your campaign goals..." rows={3} />
            </div>
            <Button type="submit" className="w-full bg-gradient-accent text-accent-foreground hover:opacity-90 border-0 h-11">
              Send Inquiry
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
