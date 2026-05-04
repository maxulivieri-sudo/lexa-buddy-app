import { NavLink } from "react-router-dom";
import { BookMarked, Bell, Sparkles, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = {
  to: string;
  label: string;
  icon: typeof BookMarked;
  color: "violet" | "cyan" | "amber" | "pink" | "mint";
  primary?: boolean;
};

const tabs: Tab[] = [
  { to: "/",          label: "Leggi",      icon: BookMarked, color: "violet" },
  { to: "/novita",    label: "Novità",     icon: Bell,       color: "cyan" },
  { to: "/chat",      label: "Assistente", icon: Sparkles,   color: "amber", primary: true },
  { to: "/preferiti", label: "Preferiti",  icon: Heart,      color: "pink" },
  { to: "/profilo",   label: "Profilo",    icon: User,       color: "mint" },
];

const COLOR_VAR: Record<string, string> = {
  violet: "var(--c-violet)",
  cyan:   "var(--c-cyan)",
  amber:  "var(--c-amber)",
  pink:   "var(--c-pink)",
  mint:   "var(--c-mint)",
};

export function TabBar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 glass border-t hairline"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Navigazione principale"
    >
      <ul className="flex items-stretch justify-around max-w-md mx-auto px-1">
        {tabs.map(({ to, label, icon: Icon, primary, color }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium tracking-wide transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground active:text-foreground"
                )
              }
              style={({ isActive }) =>
                isActive && !primary ? { color: `hsl(${COLOR_VAR[color]})` } : undefined
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "flex items-center justify-center transition-all",
                      primary
                        ? "h-12 w-12 rounded-2xl -mt-4"
                        : "h-7 w-7 rounded-lg"
                    )}
                    style={
                      primary
                        ? {
                            background: isActive
                              ? `linear-gradient(135deg, hsl(${COLOR_VAR.amber}), hsl(${COLOR_VAR.pink}))`
                              : `linear-gradient(135deg, hsl(${COLOR_VAR.violet} / 0.9), hsl(${COLOR_VAR.cyan} / 0.9))`,
                            color: "hsl(220 30% 7%)",
                            boxShadow: `0 8px 24px -6px hsl(${COLOR_VAR.amber} / 0.5)`,
                          }
                        : isActive
                        ? { background: `hsl(${COLOR_VAR[color]} / 0.15)` }
                        : undefined
                    }
                  >
                    <Icon className={cn(primary ? "h-5 w-5" : "h-[18px] w-[18px]")} strokeWidth={isActive ? 2.4 : 2} />
                  </span>
                  <span className={cn("mt-0.5", primary && "mt-1")}>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
