import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Shield, Zap, Users, TrendingUp, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "247+", label: "Active Creators" },
  { value: "1,840", label: "Sponsor Brands" },
  { value: "$4.2M", label: "Deals Closed" },
  { value: "93%", label: "Data Verified" },
];

const features = [
  {
    icon: Shield,
    title: "Verified Audience Data",
    description: "Every metric pulled directly from ticketing platforms. No guesswork, no inflated numbers.",
  },
  {
    icon: BarChart3,
    title: "Dynamic Media Kits",
    description: "Replace static PDFs with living, data-rich profiles that update automatically.",
  },
  {
    icon: Zap,
    title: "Smart Matching",
    description: "AI-powered discovery connects sponsors with creators that fit their target audience.",
  },
  {
    icon: Users,
    title: "Structured Workflows",
    description: "From discovery to deal, manage the entire sponsorship lifecycle in one place.",
  },
];

const testimonials = [
  {
    quote: "We closed 3 sponsorship deals in our first month. The verified data made brands trust us instantly.",
    author: "Maria Santos",
    role: "Founder, Urban Bites Festival",
    rating: 5,
  },
  {
    quote: "Finding niche events that match our audience used to take weeks. Now it takes minutes.",
    author: "David Kim",
    role: "Brand Partnerships, Spotify",
    rating: 5,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center text-accent-foreground font-bold text-sm">S</div>
            <span className="font-display font-bold text-lg text-foreground">SponsorHub</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="bg-gradient-accent text-accent-foreground hover:opacity-90 border-0">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-sm text-accent mb-6">
              <Zap className="w-3.5 h-3.5" />
              The sponsorship marketplace is here
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
              Where Brands Meet{" "}
              <span className="text-gradient-accent">Creators</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              The data-driven marketplace connecting event creators with sponsors.
              Verified audiences. Dynamic media kits. Faster deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?role=creator">
                <Button size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90 px-8 h-12 text-base border-0">
                  Build my media kit
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/auth?role=sponsor">
                <Button size="lg" variant="outline" className="px-8 h-12 text-base border-foreground/20">
                  Explore creators
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} className="text-center" custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="text-3xl md:text-4xl font-display font-extrabold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div className="text-center mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Built for modern sponsorships</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Everything creators and sponsors need to find each other, build trust, and close deals faster.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="bg-card rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow border border-border group">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-gradient-accent group-hover:text-accent-foreground transition-all">
                  <f.icon className="w-6 h-6 text-accent group-hover:text-accent-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-4 bg-card border-y border-border">
        <div className="container mx-auto max-w-4xl">
          <motion.div className="text-center mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">How it works</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Connect & Build", desc: "Creators connect their event platform and generate a dynamic media kit in minutes." },
              { step: "02", title: "Discover & Match", desc: "Sponsors search, filter, and find creators that match their campaign goals." },
              { step: "03", title: "Negotiate & Close", desc: "Start structured conversations and manage deals through a built-in CRM." },
            ].map((item, i) => (
              <motion.div key={item.step} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-accent text-accent-foreground font-display font-bold text-lg flex items-center justify-center mx-auto mb-5">{item.step}</div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div className="text-center mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Trusted by creators & brands</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="bg-card rounded-xl p-8 shadow-card border border-border">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed italic">"{t.quote}"</p>
                <div>
                  <div className="font-semibold text-foreground text-sm">{t.author}</div>
                  <div className="text-muted-foreground text-sm">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="bg-gradient-hero rounded-2xl p-12 md:p-16 text-center text-primary-foreground">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Ready to transform your sponsorship game?</h2>
            <p className="text-primary-foreground/70 text-lg mb-8 max-w-lg mx-auto">Join hundreds of creators and brands already using SponsorHub to close better deals, faster.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?role=creator">
                <Button size="lg" className="bg-gradient-accent text-accent-foreground hover:opacity-90 px-8 h-12 border-0">
                  I'm a Creator
                </Button>
              </Link>
              <Link to="/auth?role=sponsor">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 h-12">
                  I'm a Sponsor
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-card">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-accent flex items-center justify-center text-accent-foreground font-bold text-xs">S</div>
            <span className="font-display font-bold text-foreground">SponsorHub</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 SponsorHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
