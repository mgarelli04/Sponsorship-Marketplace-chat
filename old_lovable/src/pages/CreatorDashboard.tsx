import { Link } from "react-router-dom";
import { BarChart3, FileText, Users, MessageSquare, TrendingUp, Eye, ArrowUpRight, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { creators, sponsorLeads } from "@/data/mockData";

const creator = creators[0];
const recentLeads = sponsorLeads.slice(0, 3);

export default function CreatorDashboard() {
  const kpis = [
    { label: "Profile Views", value: "2,340", change: "+18%", icon: Eye },
    { label: "Active Leads", value: "5", change: "+2", icon: Users },
    { label: "Deals Closed", value: "3", change: "$95K", icon: TrendingUp },
    { label: "Media Kit Score", value: "92%", change: "Excellent", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <nav className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-accent flex items-center justify-center text-accent-foreground font-bold text-xs">S</div>
              <span className="font-display font-bold text-foreground">SponsorHub</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <Link to="/creator/dashboard"><Button variant="ghost" size="sm" className="text-sm font-medium">Dashboard</Button></Link>
              <Link to="/creator/media-kit"><Button variant="ghost" size="sm" className="text-sm text-muted-foreground">Media Kit</Button></Link>
              <Link to="/creator/crm"><Button variant="ghost" size="sm" className="text-sm text-muted-foreground">Leads</Button></Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-sm">🎵</div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground">Welcome back, Neon Nights</h1>
          <p className="text-muted-foreground text-sm">Here's how your sponsorship pipeline looks today.</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="bg-card rounded-xl border border-border p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <kpi.icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-trust font-medium">{kpi.change}</span>
              </div>
              <div className="text-2xl font-display font-bold text-foreground">{kpi.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{kpi.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent leads */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-foreground">Recent Inquiries</h2>
              <Link to="/creator/crm"><Button variant="ghost" size="sm" className="text-sm">View all <ArrowUpRight className="w-3 h-3 ml-1" /></Button></Link>
            </div>
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="bg-card rounded-xl border border-border p-5 shadow-card flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">{lead.sponsorLogo}</div>
                    <div>
                      <div className="font-medium text-foreground text-sm">{lead.sponsorName}</div>
                      <div className="text-xs text-muted-foreground">{lead.package} Package · {lead.goal}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={
                      lead.status === "pending" ? "bg-accent/10 text-accent border-accent/20" :
                      lead.status === "negotiating" ? "bg-sponsor/10 text-sponsor border-sponsor/20" :
                      lead.status === "closed_won" ? "bg-trust/10 text-trust border-trust/20" :
                      "bg-destructive/10 text-destructive border-destructive/20"
                    }>
                      {lead.status === "closed_won" ? "Won" : lead.status === "closed_lost" ? "Lost" : lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </Badge>
                    <span className="text-xs text-muted-foreground hidden sm:block">{lead.dateSubmitted}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="space-y-4">
            <h2 className="font-display text-lg font-semibold text-foreground">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/creator/media-kit" className="block">
                <div className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-shadow group cursor-pointer">
                  <FileText className="w-5 h-5 text-accent mb-2" />
                  <div className="font-medium text-foreground text-sm group-hover:text-accent transition-colors">Edit Media Kit</div>
                  <div className="text-xs text-muted-foreground">Update packages, add events</div>
                </div>
              </Link>
              <Link to="/creator/crm" className="block">
                <div className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-shadow group cursor-pointer">
                  <MessageSquare className="w-5 h-5 text-sponsor mb-2" />
                  <div className="font-medium text-foreground text-sm group-hover:text-sponsor transition-colors">Manage Leads</div>
                  <div className="text-xs text-muted-foreground">2 pending inquiries</div>
                </div>
              </Link>
              <div className="bg-card rounded-xl border border-border p-5 shadow-card">
                <div className="text-xs text-muted-foreground mb-2">Profile Completeness</div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-accent rounded-full" style={{ width: "92%" }} />
                </div>
                <div className="text-xs text-muted-foreground mt-2">92% — Add a promo video to reach 100%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
