import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookMarked, Sparkles, Bell, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { IconPill, type PillTone } from "@/components/mobile/IconPill";

const STEPS: {
  icon: typeof BookMarked;
  tone: PillTone;
  title: string;
  body: string;
  blobs: { color: string; cls: string }[];
}[] = [
  {
    icon: BookMarked,
    tone: "violet",
    title: "Le leggi italiane sulla disabilità,\nin un unico posto",
    body: "Archivio sempre aggiornato con link diretti a Normattiva, Gazzetta Ufficiale e parlamento.it.",
    blobs: [
      { color: "hsl(var(--c-violet))", cls: "h-72 w-72 -top-20 -left-20" },
      { color: "hsl(var(--c-cyan))",   cls: "h-56 w-56 top-32 -right-16" },
    ],
  },
  {
    icon: Sparkles,
    tone: "cyan",
    title: "Un assistente AI\nche parla chiaro",
    body: "Fai domande in italiano semplice. Ricevi risposte basate sulle leggi reali, non opinioni.",
    blobs: [
      { color: "hsl(var(--c-cyan))",   cls: "h-72 w-72 -top-16 -right-20" },
      { color: "hsl(var(--c-amber))",  cls: "h-56 w-56 top-40 -left-16" },
    ],
  },
  {
    icon: Bell,
    tone: "pink",
    title: "Salva, segui,\nnon perdere nulla",
    body: "Aggiungi leggi ai preferiti e ricevi una notifica quando arrivano novità o modifiche.",
    blobs: [
      { color: "hsl(var(--c-pink))",   cls: "h-72 w-72 -top-20 left-1/2 -translate-x-1/2" },
      { color: "hsl(var(--c-violet))", cls: "h-56 w-56 top-48 -right-12" },
    ],
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
    <div className="relative min-h-screen flex flex-col overflow-hidden" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      {/* Animated colored blobs */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`blobs-${step}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 pointer-events-none"
        >
          {Step.blobs.map((b, i) => (
            <span
              key={i}
              className={`blob ${b.cls}`}
              style={{ background: b.color }}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex justify-between items-center px-5 pt-3">
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === step ? "w-6 bg-foreground" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
        <button onClick={finish} className="text-sm text-muted-foreground">Salta</button>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.05 }}
              className="mx-auto mb-8 inline-block"
            >
              <IconPill icon={Step.icon} tone={Step.tone} size="xl" ring />
            </motion.div>
            <h1 className="font-serif text-[32px] leading-[1.1] tracking-tight whitespace-pre-line">
              {Step.title}
            </h1>
            <p className="text-[15px] text-muted-foreground mt-4 leading-relaxed max-w-sm mx-auto">
              {Step.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 px-6 pb-8" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}>
        <button
          onClick={() => step < STEPS.length - 1 ? setStep(step + 1) : finish()}
          className="w-full h-13 py-3.5 rounded-2xl bg-foreground text-background font-medium text-[15px] flex items-center justify-center gap-2 active:scale-[0.99] transition shadow-lg shadow-foreground/10"
        >
          {step < STEPS.length - 1 ? "Avanti" : "Inizia"}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
