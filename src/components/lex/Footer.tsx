export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="font-serif text-2xl">
            Lex<span className="italic text-accent">Abilis</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 max-w-md">
            Strumento informativo. Non sostituisce la consulenza di un legale o
            il parere dell'ente competente. Verifica sempre il testo ufficiale.
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          Dati aggiornati al {new Date().getFullYear()} · Fonti pubbliche
        </div>
      </div>
    </footer>
  );
}
