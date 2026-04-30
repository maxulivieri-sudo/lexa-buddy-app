import { useState } from "react";
import { ExternalLink, FileDown, Newspaper, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { AREA_LABEL, type Law } from "./types";
import { toast } from "@/hooks/use-toast";

const STATUS_STYLE: Record<Law["status"], string> = {
  "Vigente": "bg-status-vigente-bg text-status-vigente",
  "Parz. modificata": "bg-status-modificata-bg text-status-modificata",
  "In attuazione": "bg-status-attuazione-bg text-status-attuazione",
};

const STATUS_TOP: Record<Law["status"], string> = {
  "Vigente": "bg-status-vigente",
  "Parz. modificata": "bg-status-modificata",
  "In attuazione": "bg-status-attuazione",
};

export function LawCard({ law }: { law: Law }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const explain = async () => {
    setOpen(true);
    if (summary || loading) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("summarize-law", {
        body: { law_id: law.id },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setSummary(data.summary_md as string);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Errore generazione riassunto";
      toast({ title: "Impossibile generare il riassunto", description: msg, variant: "destructive" });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article
      id={`law-${law.id}`}
      className="group relative flex flex-col bg-card border border-border rounded-xl overflow-hidden transition-shadow hover:shadow-lg hover:shadow-foreground/5"
    >
      <div className={cn("h-1 w-full", STATUS_TOP[law.status])} />

      <div className="p-6 flex-1 flex flex-col">
        <header className="flex items-start justify-between gap-3">
          <div>
            <div className="font-mono text-xs text-muted-foreground">{law.year}</div>
            <h3 className="font-serif text-2xl leading-tight mt-1">{law.identifier}</h3>
          </div>
          <span className={cn(
            "shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full",
            STATUS_STYLE[law.status],
          )}>
            {law.status}
          </span>
        </header>

        {law.situazione && (
          <p className="mt-4 text-xs text-muted-foreground italic leading-relaxed">
            {law.situazione}
          </p>
        )}

        <h4 className="mt-4 text-[15px] font-semibold leading-snug text-foreground">
          {law.title}
        </h4>

        <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-4">
          {law.description}
        </p>

        {law.nota_operativa && (
          <div className="mt-4 border-l-2 border-accent/60 pl-3 py-1">
            <div className="text-[10px] uppercase tracking-wider text-accent font-semibold">
              Nota operativa
            </div>
            <p className="text-xs text-foreground/80 mt-1 leading-relaxed line-clamp-3">
              {law.nota_operativa}
            </p>
          </div>
        )}

        {open && (
          <div className="mt-4 rounded-lg border border-accent/30 bg-accent-soft/40 p-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-accent font-semibold">
              <Sparkles className="w-3 h-3" /> Spiegamelo semplice
            </div>
            {loading ? (
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> Sto leggendo la legge…
              </div>
            ) : summary ? (
              <div className="prose-lex text-sm mt-2">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
              </div>
            ) : null}
          </div>
        )}

        {law.areas.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {law.areas.map((a) => (
              <span
                key={a}
                className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-secondary text-secondary-foreground"
              >
                {AREA_LABEL[a] ?? a}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 pt-5 border-t border-border flex flex-col gap-2">
          {!open && (
            <button
              onClick={explain}
              className="text-xs flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-foreground text-background hover:bg-foreground/90 transition-colors font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" /> Spiegamelo semplice
            </button>
          )}
          <div className="flex flex-wrap gap-1.5">
            {law.link_normattiva && (
              <LinkBtn href={law.link_normattiva} icon={<ExternalLink className="w-3 h-3" />}>
                {law.link_normattiva_label ?? "Testo ufficiale"}
              </LinkBtn>
            )}
            {law.link_gazzetta && (
              <LinkBtn href={law.link_gazzetta} icon={<Newspaper className="w-3 h-3" />}>
                Gazzetta Uff.
              </LinkBtn>
            )}
            {law.link_pdf && (
              <LinkBtn href={law.link_pdf} icon={<FileDown className="w-3 h-3" />}>
                PDF
              </LinkBtn>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function LinkBtn({
  href, icon, children,
}: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-[11px] flex items-center gap-1 px-2.5 py-1.5 rounded border border-border text-foreground/80 hover:border-foreground hover:text-foreground transition-colors"
    >
      {icon}
      {children}
    </a>
  );
}
