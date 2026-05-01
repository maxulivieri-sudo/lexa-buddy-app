import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookMarked, Sparkles, Bell, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const STEPS = [
  {
    icon: BookMarked,
    title: "Le leggi italiane sulla disabilità,\nin un unico posto",
    body: "Archivio sempre aggiornato con link diretti a Normattiva, Gazzetta Ufficiale e parlamento.it.",
  },
  {
    icon: Sparkles,
    title: "Un assistente AI\nche parla chiaro",
    body: "Fai domande in italiano semplice. Ricevi risposte basate sulle leggi reali, non opinioni.",
  },
  {
    icon: Bell,
    title: "Salva, segui,\nnon perdere nulla",
    body: "Aggiungi leggi ai preferiti e ricevi una notifica quando arrivano novità o modifiche.",
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const nav = useNavigate();
  const { user, refreshProfile } = useAuth();
  const Step = STEPS[step];

  async function finish() {
    if (user) {
      await supabase.from("profiles").update({ onboarding_completed: true }).eq("user_id", user.id);
      await refreshProfile();
    }
    localStorage.setItem("lex.onboarded", "1");
    nav("/");
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="flex justify-between items-center px-5 pt-3">
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all ${i === step ? "w-6 bg-primary" : "w-1.5 bg-border"}`}
            />
          ))}
        </div>
        <button onClick={finish} className="text-sm text-muted-foreground">Salta</button>
      </div>

      <div className="flex-1 flex items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="text-center"
          >
            <div className="mx-auto h-20 w-20 rounded-3xl bg-primary/10 grid place-items-center mb-8">
              <Step.icon className="h-9 w-9 text-primary" strokeWidth={1.5} />
            </div>
            <h1 className="font-serif text-[32px] leading-[1.1] tracking-tight whitespace-pre-line">
              {Step.title}
            </h1>
            <p className="text-[15px] text-muted-foreground mt-4 leading-relaxed max-w-sm mx-auto">
              {Step.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 pb-8" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}>
        <button
          onClick={() => step < STEPS.length - 1 ? setStep(step + 1) : finish()}
          className="w-full h-13 py-3.5 rounded-2xl bg-primary text-primary-foreground font-medium text-[15px] flex items-center justify-center gap-2 active:scale-[0.99] transition"
        >
          {step < STEPS.length - 1 ? "Avanti" : "Inizia"}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
