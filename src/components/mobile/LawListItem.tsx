import { Link } from "react-router-dom";
import { ChevronRight, Heart, Scale, Briefcase, GraduationCap, HeartPulse, Users, Accessibility, Sparkles } from "lucide-react";
import type { Law } from "@/components/lex/types";
import { AREA_LABEL } from "@/components/lex/types";
import { cn } from "@/lib/utils";
import { IconPill, toneForArea } from "@/components/mobile/IconPill";

const STATUS_CLASSES: Record<string, string> = {
  Vigente: "bg-status-vigente-bg text-status-vigente",
  "Parz. modificata": "bg-status-modificata-bg text-status-modificata",
  "In attuazione": "bg-status-attuazione-bg text-status-attuazione",
};

function iconForArea(area?: string) {
  const key = (area ?? "").toLowerCase();
  if (/lavoro|occupaz/.test(key)) return Briefcase;
  if (/scuola|istruz|educaz/.test(key)) return GraduationCap;
  if (/sanit|salute|ssn/.test(key)) return HeartPulse;
  if (/famigl|caregiver/.test(key)) return Users;
  if (/access|barrier|mobilit/.test(key)) return Accessibility;
  if (/diritti|civil|inclusi/.test(key)) return Sparkles;
  return Scale;
}

interface Props {
  law: Law;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function LawListItem({ law, isFavorite, onToggleFavorite }: Props) {
  const primaryArea = law.areas[0];
  const Icon = iconForArea(primaryArea);
  const tone = toneForArea(primaryArea);

  return (
    <Link
      to={`/legge/${law.id}`}
      className="group flex items-start gap-3 px-4 py-3.5 active:bg-muted/40 transition-colors border-b hairline"
    >
      <IconPill icon={Icon} tone={tone} size="md" className="mt-0.5" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="font-mono text-[10.5px] text-muted-foreground tracking-wide uppercase">
            {law.identifier}
          </span>
          <span
            className={cn(
              "text-[10px] font-medium px-1.5 py-0.5 rounded-md",
              STATUS_CLASSES[law.status] ?? "bg-muted text-muted-foreground"
            )}
          >
            {law.status}
          </span>
        </div>
        <h3 className="font-serif text-[18px] leading-tight text-foreground line-clamp-2 mb-1">
          {law.title}
        </h3>
        <p className="text-[13px] text-muted-foreground line-clamp-2">
          {law.description}
        </p>
        {law.areas.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {law.areas.slice(0, 3).map((a) => (
              <span key={a} className="text-[10px] text-muted-foreground">
                · {AREA_LABEL[a] ?? a}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-between py-1 self-stretch">
        {onToggleFavorite ? (
          <button
            onClick={(e) => { e.preventDefault(); onToggleFavorite(law.id); }}
            className="p-1.5 -m-1.5 rounded-full active:bg-muted"
            aria-label={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
          >
            <Heart
              className={cn(
                "h-[18px] w-[18px] transition-all",
                isFavorite
                  ? "fill-[hsl(var(--c-pink))] text-[hsl(var(--c-pink))] scale-110"
                  : "text-muted-foreground"
              )}
            />
          </button>
        ) : <span />}
        <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
      </div>
    </Link>
  );
}
