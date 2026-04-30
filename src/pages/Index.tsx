import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Hero } from "@/components/lex/Hero";
import { Filters } from "@/components/lex/Filters";
import { LawCard } from "@/components/lex/LawCard";
import { ChatWidget } from "@/components/lex/ChatWidget";
import { Footer } from "@/components/lex/Footer";
import type { Law } from "@/components/lex/types";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [laws, setLaws] = useState<Law[] | null>(null);
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<string>("tutti");
  const [tab, setTab] = useState<"archivio" | "novita">("archivio");

  useEffect(() => {
    document.title = "LexAbilis · Archivio leggi italiane sulla disabilità";
    const meta = document.querySelector('meta[name="description"]');
    const desc =
      "Archivio ragionato delle leggi italiane sulla disabilità con assistente AI: cerca, leggi e chiedi spiegazioni in linguaggio chiaro.";
    if (meta) meta.setAttribute("content", desc);
    else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = desc;
      document.head.appendChild(m);
    }
  }, []);

  useEffect(() => {
    supabase
      .from("laws")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error(error);
        setLaws((data ?? []) as Law[]);
      });
  }, []);

  const visible = (laws ?? []).filter((l) => {
    if (area !== "tutti" && !l.areas.includes(area)) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      const hay = `${l.identifier} ${l.title} ${l.description} ${l.nota_operativa ?? ""} ${l.areas.join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (tab === "novita") return l.year >= 2020;
    return true;
  });

  const sorted = tab === "novita"
    ? [...visible].sort((a, b) => b.year - a.year)
    : visible;

  return (
    <div className="min-h-screen flex flex-col">
      <Hero totalLaws={laws?.length ?? 0} />

      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <Filters
            query={query}
            onQuery={setQuery}
            area={area}
            onArea={setArea}
            tab={tab}
            onTab={setTab}
            count={sorted.length}
          />

          <section className="mt-8">
            {laws === null ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 rounded-xl" />
                ))}
              </div>
            ) : sorted.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                Nessuna legge corrisponde ai filtri selezionati.
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {sorted.map((l) => (
                  <LawCard key={l.id} law={l} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
