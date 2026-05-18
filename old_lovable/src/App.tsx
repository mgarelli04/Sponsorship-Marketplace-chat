import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import CreatorOnboarding from "./pages/CreatorOnboarding";
import CreatorDashboard from "./pages/CreatorDashboard";
import MediaKit from "./pages/MediaKit";
import SponsorDiscovery from "./pages/SponsorDiscovery";
import CreatorProfile from "./pages/CreatorProfile";
import CreatorCRM from "./pages/CreatorCRM";
import AdminDashboard from "./pages/AdminDashboard";
import MatchConfirmation from "./pages/MatchConfirmation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<CreatorOnboarding />} />
          <Route path="/creator/dashboard" element={<CreatorDashboard />} />
          <Route path="/creator/media-kit" element={<MediaKit />} />
          <Route path="/creator/crm" element={<CreatorCRM />} />
          <Route path="/sponsor/discover" element={<SponsorDiscovery />} />
          <Route path="/sponsor/creator/:id" element={<CreatorProfile />} />
          <Route path="/sponsor/match" element={<MatchConfirmation />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
