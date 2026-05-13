import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, MessageSquare, Calendar, DollarSign, Target, ChevronRight, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { sponsorLeads, type SponsorLead } from "@/data/mockData";

const columns = [
  { key: "pending" as const, label: "Pending", icon: Clock, color: "text-accent" },
  { key: "negotiating" as const, label: "Negotiating", icon: MessageSquare, color: "text-sponsor" },
  { key: "closed_won" as const, label: "Closed Won", icon: CheckCircle2, color: "text-trust" },
  { key: "closed_lost" as const, label: "Closed Lost", icon: XCircle, color: "text-destructive" },
];

export default function CreatorCRM() {
  const [leads, setLeads] = useState(sponsorLeads);
  const [selectedLead, setSelectedLead] = useState<SponsorLead | null>(null);
  const [view, setView] = useState<"board" | "list">("board");

  const moveToStatus = (leadId: string, status: SponsorLead["status"]) => {
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status } : l));
    if (selectedLead?.id === leadId) setSelectedLead({ ...selectedLead, status });
  };

  const getLeadsByStatus = (status: SponsorLead["status"]) => leads.filter((l) => l.status === status);

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
              <Link to="/creator/media-kit"><Button variant="ghost" size="sm" className="text-sm text-muted-foreground">Media Kit</Button></Link>
              <Link to="/creator/crm"><Button variant="ghost" size="sm" className="text-sm font-medium">Leads</Button></Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex border border-border rounded-lg overflow-hidden text-xs">
              <button onClick={() => setView("board")} className={`px-3 py-1.5 ${view === "board" ? "bg-muted font-medium" : "text-muted-foreground"}`}>Board</button>
              <button onClick={() => setView("list")} className={`px-3 py-1.5 ${view === "list" ? "bg-muted font-medium" : "text-muted-foreground"}`}>List</button>
            </div>
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-sm">🎵</div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-56px)]">
        {/* Board / List */}
        <div className={`flex-1 overflow-auto p-6 ${selectedLead ? "hidden lg:block" : ""}`}>
          <div className="mb-6">
            <h1 className="font-display text-xl font-bold text-foreground">Sponsorship Pipeline</h1>
            <p className="text-sm text-muted-foreground">{leads.length} total leads</p>
          </div>

          {view === "board" ? (
            <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
              {columns.map((col) => (
                <div key={col.key} className="w-72 shrink-0">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <col.icon className={`w-4 h-4 ${col.color}`} />
                    <span className="font-display font-semibold text-foreground text-sm">{col.label}</span>
                    <Badge variant="outline" className="ml-auto text-xs">{getLeadsByStatus(col.key).length}</Badge>
                  </div>
                  <div className="space-y-3">
                    {getLeadsByStatus(col.key).map((lead) => (
                      <button key={lead.id} onClick={() => setSelectedLead(lead)}
                        className={`w-full text-left bg-card rounded-xl border p-4 shadow-card hover:shadow-card-hover transition-all ${
                          selectedLead?.id === lead.id ? "border-accent ring-1 ring-accent/20" : "border-border"
                        }`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-lg">{lead.sponsorLogo}</div>
                          <div>
                            <div className="font-medium text-foreground text-sm">{lead.sponsorName}</div>
                            <div className="text-xs text-muted-foreground">{lead.company}</div>
                          </div>
                        </div>
                        <div className="space-y-1.5 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1"><Target className="w-3 h-3" />{lead.goal}</div>
                          <div className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{lead.budget}</div>
                          <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{lead.dateSubmitted}</div>
                        </div>
                        <Badge variant="outline" className="mt-3 text-xs">{lead.package}</Badge>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {leads.map((lead) => (
                <button key={lead.id} onClick={() => setSelectedLead(lead)}
                  className={`w-full text-left bg-card rounded-xl border p-4 shadow-card flex items-center gap-4 hover:shadow-card-hover transition-all ${
                    selectedLead?.id === lead.id ? "border-accent" : "border-border"
                  }`}>
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">{lead.sponsorLogo}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground text-sm">{lead.sponsorName} · {lead.company}</div>
                    <div className="text-xs text-muted-foreground">{lead.package} · {lead.goal} · {lead.budget}</div>
                  </div>
                  <Badge variant="outline" className={
                    lead.status === "pending" ? "bg-accent/10 text-accent border-accent/20" :
                    lead.status === "negotiating" ? "bg-sponsor/10 text-sponsor border-sponsor/20" :
                    lead.status === "closed_won" ? "bg-trust/10 text-trust border-trust/20" :
                    "bg-destructive/10 text-destructive border-destructive/20"
                  }>{lead.status === "closed_won" ? "Won" : lead.status === "closed_lost" ? "Lost" : lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}</Badge>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedLead && (
          <div className="w-full lg:w-96 border-l border-border bg-card overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-foreground">Lead Details</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedLead(null)} className="lg:hidden">Close</Button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">{selectedLead.sponsorLogo}</div>
                <div>
                  <div className="font-display font-semibold text-foreground">{selectedLead.sponsorName}</div>
                  <div className="text-sm text-muted-foreground">{selectedLead.company}</div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Package</span><span className="text-foreground font-medium">{selectedLead.package}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Budget</span><span className="text-foreground font-medium">{selectedLead.budget}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Goal</span><span className="text-foreground font-medium">{selectedLead.goal}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Event Date</span><span className="text-foreground font-medium">{selectedLead.eventDate}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Contact</span><span className="text-foreground font-medium">{selectedLead.contactPerson}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Email</span><span className="text-foreground font-medium text-xs">{selectedLead.email}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Submitted</span><span className="text-foreground font-medium">{selectedLead.dateSubmitted}</span></div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-foreground mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">{selectedLead.notes}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-foreground mb-2">Quick Reply</h3>
                <Textarea placeholder="Type a message..." rows={3} className="mb-2" />
                <Button size="sm" className="bg-gradient-accent text-accent-foreground hover:opacity-90 border-0">Send Message</Button>
              </div>

              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Move to</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedLead.status !== "negotiating" && (
                    <Button variant="outline" size="sm" onClick={() => moveToStatus(selectedLead.id, "negotiating")} className="text-xs">Move to Negotiating</Button>
                  )}
                  {selectedLead.status !== "closed_won" && (
                    <Button variant="outline" size="sm" onClick={() => moveToStatus(selectedLead.id, "closed_won")} className="text-xs text-trust border-trust/30">Mark as Won</Button>
                  )}
                  {selectedLead.status !== "closed_lost" && (
                    <Button variant="outline" size="sm" onClick={() => moveToStatus(selectedLead.id, "closed_lost")} className="text-xs text-destructive border-destructive/30">Mark as Lost</Button>
                  )}
                  {selectedLead.status !== "pending" && (
                    <Button variant="outline" size="sm" onClick={() => moveToStatus(selectedLead.id, "pending")} className="text-xs">Back to Pending</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
