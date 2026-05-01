import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

type Mode = "signin" | "signup";

export default function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account creato!");
        nav("/onboarding");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bentornato");
        nav("/");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Accesso Google non riuscito");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="px-2 py-2">
        <button onClick={() => nav("/")} className="h-10 w-10 grid place-items-center rounded-full active:bg-muted" aria-label="Indietro">
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 px-6 pt-6 pb-10 flex flex-col">
        <h1 className="font-serif text-[34px] leading-tight tracking-tight">
          {mode === "signin" ? "Bentornato" : "Crea il tuo account"}
        </h1>
        <p className="text-sm text-muted-foreground mt-2 mb-8">
          {mode === "signin" ? "Accedi per salvare leggi e ricevere aggiornamenti." : "Salva preferiti e ricevi notifiche sulle novità."}
        </p>

        <button
          onClick={google}
          disabled={loading}
          className="h-12 rounded-2xl surface flex items-center justify-center gap-2 font-medium text-sm active:scale-[0.99] transition disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.12-.84 2.07-1.79 2.71v2.26h2.9c1.7-1.56 2.69-3.86 2.69-6.61z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.9-2.26c-.81.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.34A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.95 10.7c-.18-.54-.28-1.12-.28-1.7s.1-1.16.28-1.7V4.96H.96A8.997 8.997 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.99-2.34z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A8.997 8.997 0 0 0 .96 4.96l2.99 2.34C4.66 5.17 6.65 3.58 9 3.58z"/>
          </svg>
          Continua con Google
        </button>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">oppure</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 rounded-2xl surface px-4 text-[15px] outline-none focus:ring-2 focus:ring-primary/40"
            />
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="email" required autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full h-12 rounded-2xl surface pl-11 pr-4 text-[15px] outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="password" required autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password} minLength={6}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full h-12 rounded-2xl surface pl-11 pr-4 text-[15px] outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 active:scale-[0.99] transition disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Accedi" : "Crea account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 text-sm text-muted-foreground"
        >
          {mode === "signin" ? "Non hai un account? " : "Hai già un account? "}
          <span className="text-primary font-medium">
            {mode === "signin" ? "Registrati" : "Accedi"}
          </span>
        </button>
      </div>
    </div>
  );
}
