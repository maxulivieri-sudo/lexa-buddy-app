import { NavLink } from "react-router-dom";
import { BookMarked, Bell, Sparkles, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Leggi", icon: BookMarked },
  { to: "/novita", label: "Novità", icon: Bell },
  { to: "/chat", label: "Assistente", icon: Sparkles, primary: true },
  { to: "/preferiti", label: "Preferiti", icon: Heart },
  { to: "/profilo", label: "Profilo", icon: User },
];

export function TabBar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 glass border-t hairline"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Navigazione principale"
    >
      <ul className="flex items-stretch justify-around max-w-md mx-auto px-1">
        {tabs.map(({ to, label, icon: Icon, primary }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium tracking-wide uppercase transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground active:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "flex items-center justify-center transition-all",
                      primary
                        ? cn(
                            "h-11 w-11 rounded-full -mt-3 shadow-lg shadow-primary/30",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-foreground"
                          )
                        : cn(
                            "h-7 w-7 rounded-md",
                            isActive && "bg-primary/10"
                          )
                    )}
                  >
                    <Icon className={cn(primary ? "h-5 w-5" : "h-[18px] w-[18px]")} strokeWidth={isActive ? 2.4 : 2} />
                  </span>
                  <span className={cn(primary && "mt-0.5")}>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
