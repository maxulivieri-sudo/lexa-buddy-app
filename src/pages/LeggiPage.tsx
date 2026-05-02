import { useMemo, useState } from "react";
import { Search, Filter as FilterIcon, X } from "lucide-react";
import { AppHeader } from "@/components/mobile/AppHeader";
import { LawListItem } from "@/components/mobile/LawListItem";
import { useLaws } from "@/hooks/useLaws";
import { useFavorites } from "@/hooks/useFavorites";
import { AREAS } from "@/components/lex/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeggiPage() {
  const laws = useLaws();
  const { isFavorite, toggle } = useFavorites();
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("tutti");
  const [searchOpen, setSearchOpen] = useState(false);

  const visible = useMemo(() => {
    if (!laws) return [];
    return laws.filter((l) => {
      if (area !== "tutti" && !l.areas.includes(area)) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = `${l.identifier} ${l.title} ${l.description} ${l.areas.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [laws, area, query]);

  return (
    <div>
      <AppHeader
        large
        title={<>Lex<span className="italic gold-text">Abilis</span></>}
        subtitle={`${laws?.length ?? "—"} leggi italiane sulla disabilità`}
        right={
          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="h-9 w-9 rounded-full surface flex items-center justify-center active:scale-95 transition"
            aria-label="Cerca"
          >
            {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </button>
        }
      />

      {searchOpen && (
        <div className="px-4 pb-3 animate-fade-up">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Numero, titolo, parola chiave…"
              className="w-full h-11 rounded-xl surface pl-10 pr-4 text-[15px] outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>
      )}

      {/* Area chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-3 pt-1">
        {AREAS.map((a) => (
          <button
            key={a.value}
            onClick={() => setArea(a.value)}
            className={cn(
              "shrink-0 h-8 px-3.5 rounded-full text-[12.5px] font-medium transition-colors",
              area === a.value
                ? "bg-primary text-primary-foreground"
                : "surface text-muted-foreground active:text-foreground"
            )}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between px-4 py-2 text-[11px] uppercase tracking-wider text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <FilterIcon className="h-3 w-3" />
          {visible.length} risultati
        </span>
      </div>

      <section>
        {!laws ? (
          <div className="px-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm px-8">
            Nessuna legge corrisponde ai filtri.
          </div>
        ) : (
          visible.map((l) => (
            <LawListItem
              key={l.id}
              law={l}
              isFavorite={isFavorite(l.id)}
              onToggleFavorite={toggle}
            />
          ))
        )}
      </section>
    </div>
  );
}
