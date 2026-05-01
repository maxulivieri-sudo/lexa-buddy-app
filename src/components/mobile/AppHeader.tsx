import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title?: ReactNode;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
  large?: boolean;
  transparent?: boolean;
  className?: string;
}

export function AppHeader({ title, subtitle, left, right, large, transparent, className }: AppHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30",
        transparent ? "bg-transparent" : "glass border-b hairline",
        className
      )}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex items-center justify-between min-h-[44px] px-4">
        <div className="w-10 flex items-center">{left}</div>
        {!large && (
          <div className="flex-1 text-center font-semibold text-[15px] tracking-tight truncate px-2">
            {title}
          </div>
        )}
        {large && <div className="flex-1" />}
        <div className="w-10 flex items-center justify-end">{right}</div>
      </div>
      {large && (
        <div className="px-5 pb-3 pt-1">
          <h1 className="font-serif text-[34px] leading-[1.05] tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1.5">{subtitle}</p>
          )}
        </div>
      )}
    </header>
  );
}
