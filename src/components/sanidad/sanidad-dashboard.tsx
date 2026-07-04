"use client";

import type { ReactNode } from "react";
import { SanidadAlertasPanel } from "@/components/sanidad/sanidad-alertas-panel";
import { SanidadCalendarioPanel } from "@/components/sanidad/sanidad-calendario-panel";
import { SanidadHistorialPanel } from "@/components/sanidad/sanidad-historial-panel";
import { Button } from "@/components/ui/button";
import {
  AlarmClock,
  CalendarDays,
  ClipboardList,
} from "lucide-react";
import { useMemo, useState } from "react";

type Pestana = "historial" | "calendario" | "alertas";

export function SanidadDashboard() {
  const [pestana, setPestana] = useState<Pestana>("historial");

  const titulos = useMemo(
    () =>
      ({
        historial:
          "Registro sanitario puntual por animal y tratamientos de campo.",
        calendario:
          "Agenda recomendada con próximas aplicaciones cohorte/lotes (demo planificada).",
        alertas:
          "Vencimientos de retiros, planes y otros hitos sanitarios‑administrativos.",
      }) satisfies Record<Pestana, string>,
    []
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Sanidad
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
            {titulos[pestana]}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-muted/25 p-1.5">
          <PestanaBtn
            activa={pestana === "historial"}
            onClick={() => setPestana("historial")}
            icon={<ClipboardList className="h-4 w-4" />}
            label="Historial"
          />
          <PestanaBtn
            activa={pestana === "calendario"}
            onClick={() => setPestana("calendario")}
            icon={<CalendarDays className="h-4 w-4" />}
            label="Calendario"
          />
          <PestanaBtn
            activa={pestana === "alertas"}
            onClick={() => setPestana("alertas")}
            icon={<AlarmClock className="h-4 w-4" />}
            label="Alertas"
          />
        </div>
      </div>

      <div className="min-h-[24rem]">
        {pestana === "historial" ? (
          <SanidadHistorialPanel />
        ) : pestana === "calendario" ? (
          <SanidadCalendarioPanel />
        ) : (
          <SanidadAlertasPanel />
        )}
      </div>
    </div>
  );
}

function PestanaBtn({
  activa,
  onClick,
  icon,
  label,
}: {
  activa: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant={activa ? "secondary" : "ghost"}
      className={`grow gap-2 sm:grow-0 ${activa ? "shadow-sm" : ""}`}
      onClick={onClick}
    >
      {icon}
      {label}
    </Button>
  );
}
