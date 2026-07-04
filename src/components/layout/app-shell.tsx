"use client";

import { mainNav } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

type Props = {
  children: React.ReactNode;
};

export function AppShell({ children }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const meta = useMemo(() => {
    const byPrefix = [...mainNav].sort((a, b) => b.href.length - a.href.length);
    const hit =
      byPrefix.find((n) => pathname === n.href) ??
      byPrefix.find((n) => pathname.startsWith(`${n.href}/`));

    return {
      moduleLabel: hit?.title ?? "Dashboard",
      moduleDescription: hit?.description,
    };
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="hidden md:block">
        <AppSidebar className="sticky top-0 h-screen border-r bg-card/80 backdrop-blur-sm" />
      </div>

      <div
        aria-hidden={!mobileOpen}
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition md:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 max-w-[88vw] transform border-r border-border bg-card shadow-xl transition-transform duration-200 ease-out md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <AppSidebar onNavigate={() => setMobileOpen(false)} />
      </div>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AppHeader
          currentModuleLabel={meta.moduleLabel}
          currentModuleDescription={meta.moduleDescription}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="relative flex-1 bg-gradient-to-b from-muted/30 to-background px-4 py-6 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
