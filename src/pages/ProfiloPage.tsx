import { useNavigate } from "react-router-dom";
import { Bell, LogOut, ChevronRight, User as UserIcon, Heart, Info, ExternalLink, type LucideIcon } from "lucide-react";
import { AppHeader } from "@/components/mobile/AppHeader";
import { IconPill, type PillTone } from "@/components/mobile/IconPill";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function ProfiloPage() {
  const nav = useNavigate();
  const { user, profile, refreshProfile, signOut } = useAuth();

  async function toggleNotif(value: boolean) {
    if (!user) return;
    await supabase.from("profiles").update({ notifications_enabled: value }).eq("user_id", user.id);
    await refreshProfile();
    toast.success(value ? "Notifiche attivate" : "Notifiche disattivate");
  }

  if (!user) {
    return (
      <div>
        <AppHeader large title="Profilo" subtitle="Personalizza la tua esperienza" />
        <div className="px-6 py-10 text-center">
          <div className="mx-auto h-16 w-16 rounded-full surface grid place-items-center mb-4">
            <UserIcon className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            Accedi per salvare leggi, ricevere aggiornamenti e personalizzare l'app.
          </p>
          <button
            onClick={() => nav("/auth")}
            className="h-12 px-6 rounded-2xl bg-primary text-primary-foreground font-medium text-sm"
          >
            Accedi o registrati
          </button>
        </div>
      </div>
    );
  }

  const initials = (profile?.display_name ?? user.email ?? "U").trim().charAt(0).toUpperCase();

  return (
    <div>
      <AppHeader large title="Profilo" />

      {/* User card with playful gradient */}
      <div className="px-4 mb-5">
        <div className="relative surface rounded-2xl p-4 flex items-center gap-4 overflow-hidden">
          <span
            className="absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-30 blur-2xl pointer-events-none"
            style={{ background: "linear-gradient(135deg, hsl(var(--c-violet)), hsl(var(--c-pink)))" }}
          />
          <div
            className="relative h-14 w-14 rounded-2xl grid place-items-center font-serif text-2xl text-background shadow-lg"
            style={{ background: "linear-gradient(135deg, hsl(var(--c-violet)), hsl(var(--c-cyan)))" }}
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-full w-full rounded-2xl object-cover" />
            ) : initials}
          </div>
          <div className="relative flex-1 min-w-0">
            <div className="font-medium truncate">{profile?.display_name ?? "Utente"}</div>
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          </div>
        </div>
      </div>

      <Section title="Preferenze">
        <Row icon={Bell} tone="cyan" label="Notifiche aggiornamenti">
          <Switch
            checked={profile?.notifications_enabled ?? true}
            onCheckedChange={toggleNotif}
          />
        </Row>
      </Section>

      <Section title="Attività">
        <NavRow icon={Heart} tone="pink" label="Le mie leggi salvate" onClick={() => nav("/preferiti")} />
      </Section>

      <Section title="Informazioni">
        <NavRow icon={Info} tone="violet" label="Su LexAbilis" onClick={() => nav("/about")} />
        <NavRow icon={ExternalLink} tone="amber" label="Sito web originale" onClick={() => window.open("https://lexabilis.it", "_blank")} />
      </Section>

      <div className="px-4 mt-6 mb-10">
        <button
          onClick={async () => { await signOut(); nav("/"); }}
          className="w-full h-12 rounded-2xl surface text-destructive font-medium text-sm flex items-center justify-center gap-2"
        >
          <LogOut className="h-4 w-4" /> Esci
        </button>
        <p className="text-center text-[11px] text-muted-foreground mt-6">
          LexAbilis · v1.0
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="px-5 pb-2 text-[11px] uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="mx-4 surface rounded-2xl overflow-hidden divide-y divide-[hsl(var(--hairline))]">
        {children}
      </div>
    </div>
  );
}

function Row({ icon, tone = "gold", label, children }: { icon: LucideIcon; tone?: PillTone; label: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <IconPill icon={icon} tone={tone} size="sm" />
      <span className="flex-1 text-[15px]">{label}</span>
      {children}
    </div>
  );
}

function NavRow({ icon, tone = "gold", label, onClick }: { icon: LucideIcon; tone?: PillTone; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3 active:bg-muted/40 transition">
      <IconPill icon={icon} tone={tone} size="sm" />
      <span className="flex-1 text-left text-[15px]">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
    </button>
  );
}
