import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="flex items-center px-2 py-2">
        <button onClick={() => nav(-1)} className="h-10 w-10 grid place-items-center rounded-full active:bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
      <div className="px-6 pb-12">
        <h1 className="font-serif text-3xl tracking-tight mb-4">Su LexAbilis</h1>
        <p className="text-[15px] text-muted-foreground leading-relaxed">
          LexAbilis è un archivio ragionato delle leggi italiane in materia di disabilità,
          con link diretti ai testi ufficiali e un assistente AI che risponde alle tue domande
          in linguaggio chiaro.
        </p>
        <p className="text-[15px] text-muted-foreground leading-relaxed mt-4">
          I contenuti hanno valore informativo. Per consulenza legale rivolgiti a un professionista.
        </p>
        <div className="mt-8 surface rounded-2xl p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Fonti</div>
          <ul className="text-sm space-y-1">
            <li>· normattiva.it</li>
            <li>· gazzettaufficiale.it</li>
            <li>· parlamento.it</li>
            <li>· eur-lex.europa.eu</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
