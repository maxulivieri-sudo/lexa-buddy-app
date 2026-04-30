import { Search, FileText, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AREAS } from "./types";
import { cn } from "@/lib/utils";

interface FiltersProps {
  query: string;
  onQuery: (q: string) => void;
  area: string;
  onArea: (a: string) => void;
  tab: "archivio" | "novita";
  onTab: (t: "archivio" | "novita") => void;
  count: number;
}

const STATUS_LEGEND = [
  { label: "Vigente", cls: "bg-status-vigente" },
  { label: "Parz. modificata", cls: "bg-status-modificata" },
  { label: "In attuazione", cls: "bg-status-attuazione" },
];

export function Filters({
  query, onQuery, area, onArea, tab, onTab, count,
}: FiltersProps) {
  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border">
        <div className="flex">
          <TabBtn
            active={tab === "archivio"}
            onClick={() => onTab("archivio")}
            icon={<FileText className="w-4 h-4" />}
            label="Archivio leggi"
          />
          <TabBtn
            active={tab === "novita"}
            onClick={() => onTab("novita")}
            icon={<Sparkles className="w-4 h-4" />}
            label="Novità"
          />
        </div>
        <span className="text-sm text-muted-foreground">
          <span className="font-mono text-foreground">{count}</span>{" "}
          {count === 1 ? "legge trovata" : "leggi trovate"}
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Cerca per numero, titolo, parola chiave…"
          className="pl-11 h-12 bg-card border-border text-base"
        />
      </div>

      {/* Areas */}
      <div className="flex flex-wrap gap-2">
        {AREAS.map((a) => {
          const active = area === a.value;
          return (
            <button
              key={a.value}
              onClick={() => onArea(a.value)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-sm border transition-colors",
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-foreground/40",
              )}
            >
              {a.label}
            </button>
          );
        })}
      </div>

      {/* Legenda stato */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        {STATUS_LEGEND.map((s) => (
          <span key={s.label} className="flex items-center gap-2">
            <span className={cn("w-2 h-2 rounded-full", s.cls)} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function TabBtn({
  active, onClick, icon, label,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-3 -mb-px border-b-2 text-sm font-medium transition-colors",
        active
          ? "border-accent text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
