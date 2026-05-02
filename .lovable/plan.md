## Problema

Nello screenshot il titolo **Lex*Abilis*** viene tagliato in alto: la "L" maiuscola e l'ascendente del corsivo "A" toccano/superano il bordo superiore del contenitore. Causa: in `AppHeader.tsx` (variante `large`) il titolo ha `text-[34px] leading-[1.05]` dentro un `<h1>` con `pt-1` — troppo stretto per un serif display come Instrument Serif, soprattutto con il glifo italico.

## Soluzione

Modifiche mirate, niente refactor.

### 1. `src/components/mobile/AppHeader.tsx`
- Aumentare il line-height del titolo grande da `leading-[1.05]` a `leading-[1.15]` per dare respiro ad ascendenti/discendenti del serif.
- Sostituire `pt-1` con `pt-2` sul wrapper della sezione `large` per evitare contatto con il bordo del safe-area.
- Aggiungere `pb-0.5` al titolo per evitare clipping in basso (corsivo "s" di *Abilis*).
- Aggiungere `overflow-visible` al container per sicurezza (nessun clip da bordi arrotondati o blur).

### 2. `src/pages/LeggiPage.tsx`
- Aggiungere un piccolo margine superiore alla riga dei chip area (`pt-1`) così non si "appiccicano" al subtitle dopo l'aumento di altezza header.
- (Opzionale) mostrare il bottone "X" per resettare il filtro area quando diverso da `tutti`, ma fuori scope di questo fix se preferisci minimal.

### Nessuna modifica
- Tab bar, palette, struttura dati: invariate.
- Nessun cambio al sistema di colori o ai font.

## Risultato atteso

Il titolo "Lex*Abilis*" sarà completamente visibile senza clipping su tutti i dispositivi iOS (incluso il viewport corrente 393×697), mantenendo lo stile editoriale premium.
