import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { AppHeader } from "@/components/mobile/AppHeader";
import { LawListItem } from "@/components/mobile/LawListItem";
import { useLaws } from "@/hooks/useLaws";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";

export default function PreferitiPage() {
  const { user } = useAuth();
  const laws = useLaws();
  const { ids, toggle, isFavorite } = useFavorites();

  const items = useMemo(() => (laws ?? []).filter((l) => ids.has(l.id)), [laws, ids]);

  return (
    <div>
      <AppHeader large title="Preferiti" subtitle={user ? `${items.length} salvate` : "Accedi per salvare"} />

      {!user ? (
        <EmptyState
          message="Accedi per salvare le leggi che ti interessano."
          cta={{ to: "/auth", label: "Accedi" }}
        />
      ) : items.length === 0 ? (
        <EmptyState
          message="Non hai ancora leggi salvate. Tocca il cuore su una legge per aggiungerla qui."
          cta={{ to: "/", label: "Esplora archivio" }}
        />
      ) : (
        items.map((l) => (
          <LawListItem key={l.id} law={l} isFavorite={isFavorite(l.id)} onToggleFavorite={toggle} />
        ))
      )}
    </div>
  );
}

function EmptyState({ message, cta }: { message: string; cta: { to: string; label: string } }) {
  return (
    <div className="px-8 py-16 text-center">
      <div className="mx-auto h-14 w-14 rounded-full surface grid place-items-center mb-4">
        <Heart className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground mb-5">{message}</p>
      <Link to={cta.to} className="inline-flex h-11 px-5 rounded-2xl bg-primary text-primary-foreground text-sm font-medium items-center">
        {cta.label}
      </Link>
    </div>
  );
}
