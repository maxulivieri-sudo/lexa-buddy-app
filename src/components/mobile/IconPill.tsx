import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type PillTone =
  | "gold"
  | "violet"
  | "cyan"
  | "pink"
  | "mint"
  | "amber"
  | "coral";

const TONE: Record<PillTone, { bg: string; fg: string; ring: string }> = {
  gold:   { bg: "bg-[hsl(var(--accent-soft))]",       fg: "text-primary",                ring: "ring-primary/20" },
  violet: { bg: "bg-[hsl(var(--c-violet-bg))]",       fg: "text-[hsl(var(--c-violet))]", ring: "ring-[hsl(var(--c-violet))]/20" },
  cyan:   { bg: "bg-[hsl(var(--c-cyan-bg))]",         fg: "text-[hsl(var(--c-cyan))]",   ring: "ring-[hsl(var(--c-cyan))]/20" },
  pink:   { bg: "bg-[hsl(var(--c-pink-bg))]",         fg: "text-[hsl(var(--c-pink))]",   ring: "ring-[hsl(var(--c-pink))]/20" },
  mint:   { bg: "bg-[hsl(var(--c-mint-bg))]",         fg: "text-[hsl(var(--c-mint))]",   ring: "ring-[hsl(var(--c-mint))]/20" },
  amber:  { bg: "bg-[hsl(var(--c-amber-bg))]",        fg: "text-[hsl(var(--c-amber))]",  ring: "ring-[hsl(var(--c-amber))]/20" },
  coral:  { bg: "bg-[hsl(var(--c-coral-bg))]",        fg: "text-[hsl(var(--c-coral))]",  ring: "ring-[hsl(var(--c-coral))]/20" },
};

const SIZE = {
  sm: { box: "h-8 w-8 rounded-lg",  icon: "h-4 w-4" },
  md: { box: "h-10 w-10 rounded-xl", icon: "h-5 w-5" },
  lg: { box: "h-14 w-14 rounded-2xl", icon: "h-6 w-6" },
  xl: { box: "h-20 w-20 rounded-[1.75rem]", icon: "h-9 w-9" },
};

interface Props {
  icon: LucideIcon;
  tone?: PillTone;
  size?: keyof typeof SIZE;
  className?: string;
  ring?: boolean;
}

export function IconPill({ icon: Icon, tone = "gold", size = "md", className, ring }: Props) {
  const t = TONE[tone];
  const s = SIZE[size];
  return (
    <span
      className={cn(
        "inline-grid place-items-center shrink-0",
        s.box,
        t.bg,
        t.fg,
        ring && cn("ring-1", t.ring),
        className
      )}
    >
      <Icon className={s.icon} strokeWidth={2} />
    </span>
  );
}

/** Maps a law area key to a consistent tone so each category has its own color */
export function toneForArea(area?: string): PillTone {
  const key = (area ?? "").toLowerCase();
  if (/lavoro|occupaz/.test(key)) return "violet";
  if (/scuola|istruz|educaz/.test(key)) return "cyan";
  if (/sanit|salute|ssn/.test(key)) return "mint";
  if (/famigl|caregiver/.test(key)) return "pink";
  if (/access|barrier|mobilit/.test(key)) return "amber";
  if (/diritti|civil|inclusi/.test(key)) return "coral";
  return "gold";
}
