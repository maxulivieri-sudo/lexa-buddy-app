import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/mobile/AppShell";
import { OnboardingGate } from "@/components/mobile/OnboardingGate";
import LeggiPage from "./pages/LeggiPage";
import NovitaPage from "./pages/NovitaPage";
import ChatPage from "./pages/ChatPage";
import PreferitiPage from "./pages/PreferitiPage";
import ProfiloPage from "./pages/ProfiloPage";
import LawDetailPage from "./pages/LawDetailPage";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <OnboardingGate />
        <Routes>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/legge/:id" element={<LawDetailPage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route element={<AppShell />}>
            <Route path="/" element={<LeggiPage />} />
            <Route path="/novita" element={<NovitaPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/preferiti" element={<PreferitiPage />} />
            <Route path="/profilo" element={<ProfiloPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
