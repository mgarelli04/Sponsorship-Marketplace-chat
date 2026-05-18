import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, Grid3X3, List, Shield, MapPin, Users, Star, Heart, ArrowUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { creators } from "@/data/mockData";
import { motion } from "framer-motion";

const categories = ["All", "Music Festival", "Tech Conference", "Education", "Food & Culture", "Health & Wellness"];
const searchExamples = [
  "Music festivals in California with 2000+ attendees",
  "Tech conferences in Austin targeting Gen Z",
  "Education events in Madrid with verified audience data",
];

export default function SponsorDiscovery() {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [savedCreators, setSavedCreators] = useState<string[]>([]);

  const filtered = creators.filter((c) => {
    if (selectedCategory !== "All" && c.category !== selectedCategory) return false;
    if (verifiedOnly && !c.verified) return false;
    if (query && !c.name.toLowerCase().includes(query.toLowerCase()) && !c.category.toLowerCase().includes(query.toLowerCase()) && !c.location.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const toggleSave = (id: string) => {
    setSavedCreators((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

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
              <Button variant="ghost" size="sm" className="text-sm font-medium">Discover</Button>
              <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">Saved ({savedCreators.length})</Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sponsor/10 flex items-center justify-center text-sm">🏢</div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Search */}
        <div className="mb-6">
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search creators, events, categories, locations..."
              className="pl-12 h-12 text-base bg-card shadow-card border-border" />
          </div>
          <div className="flex flex-wrap gap-2">
            {searchExamples.map((ex) => (
              <button key={ex} onClick={() => setQuery(ex)}
                className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors">
                {ex}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters */}
          {showFilters && (
            <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block w-64 shrink-0">
              <div className="bg-card rounded-xl border border-border p-5 shadow-card sticky top-20 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-foreground text-sm">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}><X className="w-4 h-4" /></Button>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground mb-2 block">Category</label>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button key={cat} onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${selectedCategory === cat ? "bg-accent/10 text-accent font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground mb-2 block">Audience Size</label>
                  <Select defaultValue="any">
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any size</SelectItem>
                      <SelectItem value="1000">1,000+</SelectItem>
                      <SelectItem value="5000">5,000+</SelectItem>
                      <SelectItem value="10000">10,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground mb-2 block">Budget Range</label>
                  <Select defaultValue="any">
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any budget</SelectItem>
                      <SelectItem value="5k">Under $5K</SelectItem>
                      <SelectItem value="15k">$5K - $15K</SelectItem>
                      <SelectItem value="35k">$15K - $35K</SelectItem>
                      <SelectItem value="35k+">$35K+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox id="verified" checked={verifiedOnly} onCheckedChange={(v) => setVerifiedOnly(!!v)} />
                  <label htmlFor="verified" className="text-sm text-foreground flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-trust" /> Verified only
                  </label>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground mb-2 block">Audience Type</label>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-muted">B2C</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-muted">B2B</Badge>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">{filtered.length} creators found</div>
              <div className="flex items-center gap-2">
                {!showFilters && <Button variant="outline" size="sm" onClick={() => setShowFilters(true)} className="lg:flex hidden"><SlidersHorizontal className="w-4 h-4 mr-1" /> Filters</Button>}
                <Select defaultValue="relevant">
                  <SelectTrigger className="h-8 text-xs w-40"><ArrowUpDown className="w-3 h-3 mr-1" /><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevant">Most Relevant</SelectItem>
                    <SelectItem value="audience">Highest Audience</SelectItem>
                    <SelectItem value="cpm">Lowest CPM</SelectItem>
                    <SelectItem value="updated">Recently Updated</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border border-border rounded-lg overflow-hidden">
                  <button onClick={() => setViewMode("grid")} className={`p-1.5 ${viewMode === "grid" ? "bg-muted" : ""}`}><Grid3X3 className="w-4 h-4" /></button>
                  <button onClick={() => setViewMode("list")} className={`p-1.5 ${viewMode === "list" ? "bg-muted" : ""}`}><List className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            {/* Recommended */}
            {!query && selectedCategory === "All" && (
              <div className="mb-6">
                <h3 className="font-display font-semibold text-foreground text-sm mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-accent" /> Recommended for you</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {creators.slice(0, 3).map((c) => (
                    <Link key={c.id} to={`/sponsor/creator/${c.id}`} className="shrink-0 w-48 bg-card rounded-xl border border-border p-4 shadow-card hover:shadow-card-hover transition-shadow">
                      <div className="text-2xl mb-2">{c.logo}</div>
                      <div className="font-medium text-foreground text-sm truncate">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.location}</div>
                      {c.matchScore && <Badge className="mt-2 bg-accent/10 text-accent border-accent/20 text-xs">{c.matchScore}% match</Badge>}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Grid */}
            <div className={viewMode === "grid" ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}>
              {filtered.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  {viewMode === "grid" ? (
                    <div className="bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all group relative">
                      <button onClick={() => toggleSave(c.id)} className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-card/80 backdrop-blur-sm border border-border hover:border-accent transition-colors">
                        <Heart className={`w-4 h-4 ${savedCreators.includes(c.id) ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                      </button>
                      <div className="h-20 bg-gradient-hero rounded-t-xl" />
                      <div className="p-5 -mt-6">
                        <div className="w-12 h-12 rounded-xl bg-card border-2 border-card shadow-md flex items-center justify-center text-2xl mb-3">{c.logo}</div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display font-semibold text-foreground text-sm group-hover:text-accent transition-colors">{c.name}</h3>
                          {c.verified && <Shield className="w-3.5 h-3.5 text-trust" />}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <MapPin className="w-3 h-3" />{c.location}
                          <Badge variant="outline" className="text-[10px] h-5">{c.category}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs mb-3">
                          <span className="text-muted-foreground"><Users className="w-3 h-3 inline mr-1" />{c.audienceSize.toLocaleString()}</span>
                          {c.matchScore && <Badge className="bg-accent/10 text-accent border-accent/20 text-[10px]">{c.matchScore}% match</Badge>}
                        </div>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {c.demographics.interests.slice(0, 3).map((int) => (
                            <span key={int} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{int}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">From ${c.packages[0].price.toLocaleString()}</span>
                          <Link to={`/sponsor/creator/${c.id}`}>
                            <Button size="sm" className="h-8 text-xs bg-gradient-accent text-accent-foreground hover:opacity-90 border-0">View Profile</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-card rounded-xl border border-border shadow-card p-5 flex items-center gap-5 hover:shadow-card-hover transition-shadow">
                      <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-3xl shrink-0">{c.logo}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display font-semibold text-foreground text-sm">{c.name}</h3>
                          {c.verified && <Shield className="w-3.5 h-3.5 text-trust" />}
                          <Badge variant="outline" className="text-[10px] h-5">{c.category}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span><MapPin className="w-3 h-3 inline mr-1" />{c.location}</span>
                          <span><Users className="w-3 h-3 inline mr-1" />{c.audienceSize.toLocaleString()}</span>
                          <span>From ${c.packages[0].price.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {c.matchScore && <Badge className="bg-accent/10 text-accent border-accent/20">{c.matchScore}%</Badge>}
                        <button onClick={() => toggleSave(c.id)} className="p-1.5">
                          <Heart className={`w-4 h-4 ${savedCreators.includes(c.id) ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                        </button>
                        <Link to={`/sponsor/creator/${c.id}`}>
                          <Button size="sm" className="h-8 text-xs bg-gradient-accent text-accent-foreground hover:opacity-90 border-0">View</Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
