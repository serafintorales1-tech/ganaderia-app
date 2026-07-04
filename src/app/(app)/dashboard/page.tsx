import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10">
      <section className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Dashboard principal
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground md:text-base">
              Operación de ciclo completo — cría, recría y terminación —
              vista resumida con datos de muestra hasta conectar tus fuentes.
            </p>
          </div>
        </div>
      </section>

      <KpiGrid />
      <AlertsPanel />
    </div>
  );
}
