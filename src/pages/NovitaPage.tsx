import { useMemo } from "react";
import { AppHeader } from "@/components/mobile/AppHeader";
import { LawListItem } from "@/components/mobile/LawListItem";
import { useLaws } from "@/hooks/useLaws";
import { useFavorites } from "@/hooks/useFavorites";
import { Skeleton } from "@/components/ui/skeleton";

export default function NovitaPage() {
  const laws = useLaws();
  const { isFavorite, toggle } = useFavorites();

  const recent = useMemo(() => {
    if (!laws) return [];
    return [...laws].filter((l) => l.year >= 2020).sort((a, b) => b.year - a.year);
  }, [laws]);

  const grouped = useMemo(() => {
    const map = new Map<number, typeof recent>();
    recent.forEach((l) => {
      if (!map.has(l.year)) map.set(l.year, []);
      map.get(l.year)!.push(l);
    });
    return Array.from(map.entries());
  }, [recent]);

  return (
    <div>
      <AppHeader large title="Novità" subtitle="Leggi e atti più recenti" />

      {!laws ? (
        <div className="px-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        grouped.map(([year, items]) => (
          <section key={year}>
            <div className="px-4 py-2 text-[11px] uppercase tracking-wider text-muted-foreground bg-background sticky top-[calc(env(safe-area-inset-top)+44px)] z-10">
              {year}
            </div>
            {items.map((l) => (
              <LawListItem key={l.id} law={l} isFavorite={isFavorite(l.id)} onToggleFavorite={toggle} />
            ))}
          </section>
        ))
      )}
    </div>
  );
}
