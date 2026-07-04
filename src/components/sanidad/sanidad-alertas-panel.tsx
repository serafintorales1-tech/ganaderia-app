"use client";

import { useSanidad } from "@/components/sanidad/sanidad-provider";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AlertaVencimientoSanidad } from "@/domain/sanidad";
import { labelTipoAlertaVencimiento } from "@/domain/sanidad";
import { formatFechaCortaEs } from "@/lib/format-es";
import { AlertTriangle } from "lucide-react";
import { useMemo } from "react";

function pad2(n: number) {
  return `${n}`.padStart(2, "0");
}

function fechaHoyIso() {
  const n = new Date();
  return `${n.getFullYear()}-${pad2(n.getMonth() + 1)}-${pad2(n.getDate())}`;
}

export function SanidadAlertasPanel() {
  const { alertasVencimientos } = useSanidad();
  const hoy = fechaHoyIso();

  const ordenadas = useMemo(
    () =>
      [...alertasVencimientos].sort((a, b) =>
        a.fechaLimite.localeCompare(b.fechaLimite)
      ),
    [alertasVencimientos]
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Alertas y vencimientos
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Retiros sanitarios y fechas administrativas generadas desde el ejemplo;
          ordenadas cronológicamente relativo al día actual del navegador.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ordenadas.map((al) => (
          <TarjetaAlerta key={al.id} alerta={al} hoyIso={hoy} />
        ))}
      </div>
    </div>
  );
}

function TarjetaAlerta({
  alerta,
  hoyIso,
}: {
  alerta: AlertaVencimientoSanidad;
  hoyIso: string;
}) {
  const urgency = urgenciaBadge(alerta.fechaLimite, hoyIso);
  const estiloCard = urgency.cardClass;

  return (
    <Card
      className={`flex flex-col border shadow-sm transition hover:shadow-md ${estiloCard}`}
    >
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-4">
        <div className="mt-0.5 rounded-lg bg-background/80 p-2 text-muted-foreground">
          <AlertTriangle className="h-4 w-4" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <SeveridadBadge severidad={alerta.severidad} />
            {urgency.label ? (
              <Badge variant="outline">{urgency.label}</Badge>
            ) : null}
          </div>
          <CardTitle className="text-base leading-snug">{alerta.titulo}</CardTitle>
          <CardDescription>{alerta.detalle}</CardDescription>
        </div>
      </CardHeader>
      <Separator />
      <CardFooter className="flex flex-wrap gap-4 pt-4 text-xs text-muted-foreground">
        <div>
          <p className="font-semibold text-foreground/80">
            Fecha límite / referencia
          </p>
          <p className="tabular-nums font-medium">
            {formatFechaCortaEs(alerta.fechaLimite)}
          </p>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground/80">Categoría</p>
          <p>{labelTipoAlertaVencimiento(alerta.tipo)}</p>
        </div>
        {(alerta.referenciaCaravana || alerta.referenciaLote) && (
          <div className="min-w-0">
            <p className="font-semibold text-foreground/80">Referencia</p>
            <p className="truncate">
              {alerta.referenciaCaravana ?? alerta.referenciaLote}
            </p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

function SeveridadBadge({
  severidad,
}: {
  severidad: AlertaVencimientoSanidad["severidad"];
}) {
  const palette: Record<AlertaVencimientoSanidad["severidad"], string> = {
    critical: "border-red-600/55 bg-red-600/90 text-white hover:bg-red-600",
    warning: "border-amber-600/50 bg-amber-500/15 text-amber-950 dark:text-amber-100",
    info: "border-primary/35 bg-primary/10 text-primary",
  };
  const label =
    severidad === "critical"
      ? "Crítico"
      : severidad === "warning"
        ? "Atención"
        : "Informativa";

  return (
    <Badge variant="outline" className={`${palette[severidad]} border`}>
      {label}
    </Badge>
  );
}

function urgenciaBadge(isoLimite: string, hoyIso: string): {
  label: string | null;
  cardClass: string;
} {
  if (isoLimite < hoyIso) {
    return {
      label: "Vencido",
      cardClass: "border-red-900/35 bg-red-950/25 dark:border-red-500/35",
    };
  }
  if (isoLimite === hoyIso) {
    return {
      label: "Último día",
      cardClass: "border-amber-900/35 bg-amber-500/10 dark:border-amber-500/35",
    };
  }
  const dias = diasEntreIso(hoyIso, isoLimite);
  if (dias !== null && dias <= 14) {
    return {
      label: `≤ ${dias} días`,
      cardClass:
        "border-primary/35 bg-primary/10 dark:bg-primary/5 dark:border-primary/40",
    };
  }
  return {
    label: null,
    cardClass:
      "border-border/80 bg-card shadow-primary/5 dark:border-border/80 dark:bg-card/80",
  };
}

/** Días completos hasta la fecha ISO (fecha fin incluida aprox.). */
function diasEntreIso(inicioIso: string, finIso: string): number | null {
  try {
    const [y1, m1, d1] = inicioIso.split("-").map(Number);
    const [y2, m2, d2] = finIso.split("-").map(Number);
    const i = new Date(y1, m1 - 1, d1).getTime();
    const f = new Date(y2, m2 - 1, d2).getTime();
    const diffMs = f - i;
    return Math.max(0, Math.round(diffMs / 86400000));
  } catch {
    return null;
  }
}
