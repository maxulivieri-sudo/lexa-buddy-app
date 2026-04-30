
# LexAbilis AI – Archivio leggi sulla disabilità con assistente intelligente

Replica del sito lexabilis.it con un'estensione AI: oltre a sfogliare le 32 leggi italiane sulla disabilità, l'utente può fare domande in linguaggio naturale ("Quali aiuti spettano a un caregiver convivente con ISEE 12.000?") e ricevere risposte sintetiche con citazione delle leggi pertinenti.

## Cosa costruiamo

### 1. Homepage – Archivio leggi (clone funzionale)
- Header con logo "LexAbilis", sottotitolo "Repubblica Italiana · Normativa Vigente" e tre contatori (numero leggi, numero aree, anno aggiornamento).
- Strip "Fonti ufficiali" con badge cliccabili (normattiva.it, gazzettaufficiale.it, parlamento.it, eur-lex.europa.eu).
- Due tab: **Archivio leggi** e **Novità**.
- Barra di ricerca testuale + filtri per area tematica (Tutti, Lavoro, Salute, Accessibilità, Welfare, Istruzione, Internazionale, Previdenza, Trasporti).
- Legenda di stato: Vigente (verde), Parz. modificata (arancio), In attuazione (blu).
- Griglia di card per ogni legge con: identificativo (es. "D.Lgs. 62/2024"), anno, stato, descrizione breve, descrizione estesa, riquadro "Nota operativa", tag aree, e bottoni link a Testo ufficiale / Gazzetta Uff. / PDF.

### 2. Estensioni AI (la novità rispetto al sito originale)

**a) Ricerca semantica**
La barra di ricerca non fa solo match testuale: se l'utente scrive "lavoro per persone sorde" trova anche leggi che non contengono quelle parole esatte ma trattano il tema.

**b) "Spiegamelo semplice" su ogni card**
Pulsante che apre un pannello con riassunto in linguaggio chiaro della legge (cosa cambia, chi ne beneficia, quando entra in vigore, cosa fare in pratica). Generato al momento e poi messo in cache.

**c) Assistente "Chiedi a LexAbilis"**
Pulsante flottante in basso a destra che apre un chat panel. L'utente fa domande sui diritti delle persone con disabilità; l'assistente risponde basandosi **solo** sulle leggi presenti in archivio e cita le card di riferimento (cliccabili per saltare alla legge). Risponde "non lo so / non è coperto dall'archivio" quando appropriato, per evitare risposte inventate su materia legale.

### 3. Pagina Novità
Lista cronologica delle leggi più recenti o in iter, con la stessa struttura a card ma ordinata per data.

## Dati
Per partire estraggo io l'elenco completo dal sito lexabilis.it (tutte e 32 le leggi con le loro aree, stato, descrizioni, note operative e link ufficiali) e li inserisco come seed nel database. Resta facile aggiungerne/modificarne in seguito.

## Design – ispirato ma rivisitato

Header e hero in tono istituzionale scuro, ma più contemporaneo dell'originale (meno "documentale", più editoriale). Sotto la fold passiamo a un'area chiara per la lista leggi, per massima leggibilità.

Per scegliere insieme la direzione visiva ti farò vedere proposte di palette, tipografia e layout subito dopo l'approvazione del piano (se preferisci posso anche partire con una proposta mia).

## Dettagli tecnici

- **Stack**: React + Vite + Tailwind + shadcn/ui (già nel progetto).
- **Backend**: Lovable Cloud (Supabase) per database `laws` (numero, anno, titolo, descrizione_breve, descrizione_estesa, nota_operativa, stato, aree[], link_normattiva, link_gazzetta, link_pdf), tabella `law_summaries` per la cache dei riassunti AI, tabella `chat_sessions`/`chat_messages` per l'assistente.
- **AI**: Lovable AI Gateway con `google/gemini-3-flash-preview` (default) tramite edge functions:
  - `search-laws`: ricerca semantica (rerank dei risultati).
  - `summarize-law`: riassunto "spiegamelo semplice" di una singola legge, con cache.
  - `ask-lexabilis`: assistente chat in streaming con contesto = elenco leggi pertinenti recuperate via search-laws (RAG), risposte con citazioni.
- **Dati**: scraping una tantum di lexabilis.it per popolare la tabella `laws` come seed migration.
- **Disclaimer**: nota in footer "Strumento informativo, non sostituisce consulenza legale".

## Cosa NON facciamo in questa prima versione
- Niente account utente / login (può arrivare dopo se vuoi salvare preferiti o cronologia chat per utente).
- Niente pannello admin con UI: per modificare leggi si aggiorna direttamente la tabella su Lovable Cloud.
- Niente notifiche su nuove normative.

Prossimo passo dopo l'approvazione: ti mostro 3-4 opzioni di palette/tipografia/layout, poi partiamo con setup database, scraping dati e UI.
