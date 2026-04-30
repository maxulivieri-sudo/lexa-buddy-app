import { Scale } from "lucide-react";

interface HeroProps {
  totalLaws: number;
}

const SOURCES = [
  { label: "normattiva.it", href: "https://www.normattiva.it" },
  { label: "gazzettaufficiale.it", href: "https://www.gazzettaufficiale.it" },
  { label: "parlamento.it", href: "https://www.parlamento.it" },
  { label: "eur-lex.europa.eu", href: "https://eur-lex.europa.eu" },
];

export function Hero({ totalLaws }: HeroProps) {
  const year = new Date().getFullYear();
  return (
    <header className="relative overflow-hidden bg-hero text-hero-fg">
      <div className="absolute inset-0 hero-grid opacity-60" aria-hidden />
      <div className="absolute inset-0 hero-glow" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-hero-muted">
          <span className="inline-block w-8 h-px bg-hero-accent" />
          Repubblica Italiana · Normativa Vigente
        </div>

        <div className="mt-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          <div className="max-w-2xl">
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.95]">
              Lex<span className="italic text-hero-accent">Abilis</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-hero-muted max-w-xl leading-relaxed">
              Archivio ragionato delle leggi italiane in materia di disabilità,
              con link diretti ai testi ufficiali e un assistente che risponde
              alle tue domande.
            </p>
          </div>

          <div className="flex items-stretch divide-x divide-hero-fg/10 rounded-lg border border-hero-fg/10 bg-hero-fg/5 backdrop-blur-sm">
            <Stat value={totalLaws || "—"} label="Leggi" />
            <Stat value={8} label="Aree" />
            <Stat value={year} label="Agg." />
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-hero-fg/10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <span className="text-[11px] uppercase tracking-[0.2em] text-hero-muted flex items-center gap-2">
            <Scale className="w-3.5 h-3.5" /> Fonti ufficiali
          </span>
          <div className="flex flex-wrap gap-2">
            {SOURCES.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-xs px-3 py-1.5 rounded-full border border-hero-fg/15 text-hero-fg/85 hover:border-hero-accent hover:text-hero-accent transition-colors"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-hero-accent mr-2 align-middle" />
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="px-5 py-4 sm:px-6 sm:py-5 text-center min-w-[80px]">
      <div className="font-serif text-3xl sm:text-4xl text-hero-accent leading-none">
        {value}
      </div>
      <div className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-hero-muted">
        {label}
      </div>
    </div>
  );
}
