import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Heart, Share2, ExternalLink, Sparkles, Loader2, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/integrations/supabase/client";
import type { Law } from "@/components/lex/types";
import { AREA_LABEL } from "@/components/lex/types";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_CLASSES: Record<string, string> = {
  Vigente: "bg-status-vigente-bg text-status-vigente",
  "Parz. modificata": "bg-status-modificata-bg text-status-modificata",
  "In attuazione": "bg-status-attuazione-bg text-status-attuazione",
};

export default function LawDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggle } = useFavorites();
  const [law, setLaw] = useState<Law | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from("laws").select("*").eq("id", id).maybeSingle()
      .then(({ data }) => setLaw(data as Law | null));
    supabase.from("law_summaries").select("summary_md").eq("law_id", id).maybeSingle()
      .then(({ data }) => { if (data) setSummary(data.summary_md); });
  }, [id]);

  async function generateSummary() {
    if (!law) return;
    setLoadingSummary(true);
    try {
      const { data, error } = await supabase.functions.invoke("summarize-law", { body: { law_id: law.id } });
      if (error) throw error;
      setSummary(data?.summary ?? "");
    } catch (e) {
      toast.error("Impossibile generare la spiegazione");
    } finally {
      setLoadingSummary(false);
    }
  }

  async function share() {
    const url = law?.link_normattiva ?? window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: law?.title, url }); } catch {}
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copiato");
    }
  }

  function handleFavorite() {
    if (!user) { toast("Accedi per salvare i preferiti"); navigate("/auth"); return; }
    if (law) toggle(law.id);
  }

  if (!law) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  const fav = isFavorite(law.id);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky header */}
      <header
        className="sticky top-0 z-30 glass border-b hairline"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="flex items-center justify-between min-h-[44px] px-2">
          <button
            onClick={() => navigate(-1)}
            className="h-10 w-10 flex items-center justify-center rounded-full active:bg-muted"
            aria-label="Indietro"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-mono text-[11px] text-muted-foreground truncate max-w-[60%]">
            {law.identifier}
          </span>
          <button
            onClick={share}
            className="h-10 w-10 flex items-center justify-center rounded-full active:bg-muted"
            aria-label="Condividi"
          >
            <Share2 className="h-[18px] w-[18px]" />
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="px-5 pt-5 pb-6 border-b hairline relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <span className={cn("text-[10.5px] font-medium px-2 py-0.5 rounded-md", STATUS_CLASSES[law.status])}>
            {law.status}
          </span>
          <span className="text-[10.5px] text-muted-foreground">{law.year}</span>
        </div>
        <h1 className="font-serif text-[28px] leading-[1.1] tracking-tight">{law.title}</h1>
        <p className="text-[15px] text-muted-foreground mt-3 leading-relaxed">
          {law.description}
        </p>
        {law.areas.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {law.areas.map((a) => (
              <span key={a} className="text-[11px] px-2 py-0.5 rounded-full surface text-muted-foreground">
                {AREA_LABEL[a] ?? a}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="px-5 py-6 space-y-6 pb-32">
        {law.situazione && (
          <section>
            <h2 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Situazione attuale</h2>
            <p className="text-[15px] leading-relaxed">{law.situazione}</p>
          </section>
        )}

        {law.nota_operativa && (
          <section>
            <h2 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Nota operativa</h2>
            <p className="text-[15px] leading-relaxed">{law.nota_operativa}</p>
          </section>
        )}

        <section className="surface rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="flex items-center gap-2 text-[12px] uppercase tracking-wider text-primary font-medium">
              <Sparkles className="h-3.5 w-3.5" /> Spiegazione AI
            </h2>
            {!summary && !loadingSummary && (
              <button
                onClick={generateSummary}
                className="text-[11px] uppercase tracking-wider text-primary font-medium"
              >
                Genera
              </button>
            )}
          </div>
          {loadingSummary ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Sto leggendo la legge…
            </div>
          ) : summary ? (
            <div className="prose-lex">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Tocca <em>Genera</em> per ricevere una spiegazione in linguaggio chiaro.
            </p>
          )}
        </section>

        <section>
          <h2 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Fonti ufficiali</h2>
          <div className="space-y-2">
            {law.link_normattiva && (
              <a href={law.link_normattiva} target="_blank" rel="noreferrer"
                className="flex items-center justify-between surface rounded-xl px-4 py-3 active:scale-[0.99] transition">
                <span className="text-sm">{law.link_normattiva_label || "Normattiva"}</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            )}
            {law.link_gazzetta && (
              <a href={law.link_gazzetta} target="_blank" rel="noreferrer"
                className="flex items-center justify-between surface rounded-xl px-4 py-3 active:scale-[0.99] transition">
                <span className="text-sm">Gazzetta Ufficiale</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            )}
            {law.link_pdf && (
              <a href={law.link_pdf} target="_blank" rel="noreferrer"
                className="flex items-center justify-between surface rounded-xl px-4 py-3 active:scale-[0.99] transition">
                <span className="text-sm flex items-center gap-2"><FileText className="h-4 w-4" /> Testo PDF</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            )}
          </div>
        </section>
      </div>

      {/* Bottom action bar */}
      <div
        className="fixed bottom-0 left-0 right-0 glass border-t hairline px-4 py-3"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
      >
        <div className="flex gap-3 max-w-md mx-auto">
          <button
            onClick={handleFavorite}
            className={cn(
              "h-12 px-5 rounded-2xl font-medium text-sm flex items-center gap-2 transition",
              fav ? "bg-primary/15 text-primary" : "surface text-foreground"
            )}
          >
            <Heart className={cn("h-[18px] w-[18px]", fav && "fill-primary")} />
            {fav ? "Salvata" : "Salva"}
          </button>
          <button
            onClick={() => navigate(`/chat?law=${law.id}`)}
            className="flex-1 h-12 rounded-2xl bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition"
          >
            <Sparkles className="h-[18px] w-[18px]" /> Chiedi all'assistente
          </button>
        </div>
      </div>
    </div>
  );
}
