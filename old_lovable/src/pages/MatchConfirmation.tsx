import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PartyPopper, MessageSquare, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MatchConfirmation() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, type: "spring" }}
        className="max-w-md w-full text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-gradient-accent flex items-center justify-center mx-auto mb-6 shadow-elevated">
          <PartyPopper className="w-10 h-10 text-accent-foreground" />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="font-display text-3xl font-bold text-foreground mb-3">
          It's a Match! 🎉
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="text-muted-foreground mb-8">
          Your sponsorship inquiry has been sent to <span className="text-foreground font-medium">Neon Nights Festival</span>. They'll review your proposal and respond within 48 hours.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-card rounded-xl border border-border p-6 shadow-card mb-8 text-left">
          <h3 className="font-display font-semibold text-foreground text-sm mb-4">What happens next?</h3>
          <div className="space-y-4">
            {[
              { step: "1", text: "Creator reviews your inquiry", sub: "Usually within 24-48 hours" },
              { step: "2", text: "Start a conversation", sub: "Discuss details and negotiate terms" },
              { step: "3", text: "Close the deal", sub: "Finalize package and sponsorship agreement" },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-xs font-semibold text-accent shrink-0">{s.step}</div>
                <div>
                  <div className="text-sm font-medium text-foreground">{s.text}</div>
                  <div className="text-xs text-muted-foreground">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-card rounded-xl border border-trust/20 p-5 shadow-card mb-8">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎵</div>
            <div className="text-left">
              <div className="font-medium text-foreground text-sm">Neon Nights Festival</div>
              <div className="text-xs text-muted-foreground">Gold Package · $30K-$50K · Brand Awareness</div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-trust ml-auto" />
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/sponsor/discover">
            <Button variant="outline" className="w-full sm:w-auto">
              Explore more creators
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link to="/sponsor/discover">
            <Button className="w-full sm:w-auto bg-gradient-accent text-accent-foreground hover:opacity-90 border-0">
              <MessageSquare className="mr-2 w-4 h-4" />
              View conversation
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
