"use client";

import { ReproduccionKpis } from "@/components/reproduccion/reproduccion-kpis";
import { ReproduccionListPanel } from "@/components/reproduccion/reproduccion-list-panel";
import { useReproduccion } from "@/components/reproduccion/reproduccion-provider";

export function ReproduccionDashboard() {
  const { eventos } = useReproduccion();

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Reproducción
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
          Seguimiento del rodeo materno: coberturas, diagnósticos y calendario de
          partos esperados. Datos de muestra en memoria hasta integrar backend.
        </p>
      </header>

      <ReproduccionKpis eventos={eventos} />

      <ReproduccionListPanel />
    </div>
  );
}
