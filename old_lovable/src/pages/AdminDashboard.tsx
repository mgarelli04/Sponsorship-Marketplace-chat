import { Link } from "react-router-dom";
import { Users, BarChart3, Shield, TrendingUp, FileText, AlertTriangle, CheckCircle2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminStats } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line, Funnel } from "recharts";

export default function AdminDashboard() {
  const kpis = [
    { label: "Total Creators", value: adminStats.totalCreators, icon: Users, change: "+12 this month" },
    { label: "Total Sponsors", value: adminStats.totalSponsors.toLocaleString(), icon: BarChart3, change: "+156 this month" },
    { label: "Verified Media Kits", value: adminStats.verifiedMediaKits, icon: Shield, change: "76% of total" },
    { label: "Total Leads", value: adminStats.totalLeads.toLocaleString(), icon: TrendingUp, change: `${adminStats.conversionRate}% conversion` },
  ];

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
            <Badge variant="outline" className="text-xs bg-sponsor/10 text-sponsor border-sponsor/20">Admin</Badge>
          </div>
          <Link to="/"><Button variant="ghost" size="sm" className="text-sm">Exit Admin</Button></Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Platform Overview</h1>
        <p className="text-muted-foreground text-sm mb-8">Real-time metrics and platform health</p>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="bg-card rounded-xl border border-border p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <kpi.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-2xl font-display font-bold text-foreground">{kpi.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{kpi.label}</div>
              <div className="text-xs text-trust mt-1">{kpi.change}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Leads */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-card">
            <h2 className="font-display font-semibold text-foreground mb-4">Monthly Leads</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={adminStats.monthlyLeads}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="leads" stroke="hsl(38 92% 50%)" strokeWidth={2.5} dot={{ fill: "hsl(38 92% 50%)", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-card">
            <h2 className="font-display font-semibold text-foreground mb-4">Conversion Funnel</h2>
            <div className="space-y-3">
              {adminStats.conversionFunnel.map((stage, i) => {
                const maxCount = adminStats.conversionFunnel[0].count;
                const pct = (stage.count / maxCount) * 100;
                return (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-foreground font-medium">{stage.stage}</span>
                      <span className="text-muted-foreground">{stage.count.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-8 rounded-lg bg-muted overflow-hidden">
                      <div className="h-full rounded-lg bg-gradient-accent flex items-center justify-end pr-3 transition-all" style={{ width: `${pct}%` }}>
                        <span className="text-xs font-medium text-accent-foreground">{pct.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Top Categories */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-card">
            <h2 className="font-display font-semibold text-foreground mb-4">Top Categories</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adminStats.topCategories} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={110} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(222 47% 11%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Geographies */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-card">
            <h2 className="font-display font-semibold text-foreground mb-4">Top Geographies</h2>
            <div className="space-y-3">
              {adminStats.topGeographies.map((geo) => (
                <div key={geo.name} className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground flex-1">{geo.name}</span>
                  <span className="text-sm font-medium text-foreground">{geo.count}</span>
                  <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-accent rounded-full" style={{ width: `${(geo.count / 45) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-5 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-accent" />
              <span className="font-medium text-foreground text-sm">Flagged Profiles</span>
            </div>
            <div className="text-2xl font-display font-bold text-foreground">4</div>
            <div className="text-xs text-muted-foreground">Require manual review</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-trust" />
              <span className="font-medium text-foreground text-sm">Verification Queue</span>
            </div>
            <div className="text-2xl font-display font-bold text-foreground">12</div>
            <div className="text-xs text-muted-foreground">Pending verification</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-trust" />
              <span className="font-medium text-foreground text-sm">Data Sync Health</span>
            </div>
            <div className="text-2xl font-display font-bold text-trust">98.2%</div>
            <div className="text-xs text-muted-foreground">All integrations healthy</div>
          </div>
        </div>
      </div>
    </div>
  );
}
