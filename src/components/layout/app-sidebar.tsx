"use client";

import { cn } from "@/lib/utils";
import { mainNav } from "@/config/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Beef } from "lucide-react";

type Props = {
  className?: string;
  onNavigate?: () => void;
};

export function AppSidebar({ className, onNavigate }: Props) {
  const pathname = usePathname();

  const activeHref = useMemo(() => {
    const sorted = [...mainNav].sort((a, b) => b.href.length - a.href.length);
    const hit =
      sorted.find((n) => pathname === n.href) ??
      sorted.find((n) => pathname.startsWith(`${n.href}/`));
    return hit?.href ?? null;
  }, [pathname]);

  return (
    <aside
      className={cn(
        "flex h-full w-72 shrink-0 flex-col border-border bg-card",
        className
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Beef className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-tight text-foreground">
            Ciclo completo
          </p>
          <p className="truncate text-xs text-muted-foreground">
            Gestión ganadera
          </p>
        </div>
      </div>

      <nav
        className="flex-1 space-y-0.5 overflow-y-auto p-3"
        aria-label="Módulos"
      >
        {mainNav.map((item) => {
          const Icon = item.icon;
          const active = activeHref === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-[1.125rem] w-[1.125rem] shrink-0 opacity-90" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <p className="text-xs leading-snug text-muted-foreground">
          Ciclo completo · cría · recría · terminación
        </p>
      </div>
    </aside>
  );
}
