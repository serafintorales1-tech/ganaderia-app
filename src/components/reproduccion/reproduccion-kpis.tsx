"use client";

import type { EventoReproductivoRegistro } from "@/domain/reproduccion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatFechaCortaEs } from "@/lib/format-es";
import { Baby, CalendarHeart, Percent } from "lucide-react";
import { useMemo } from "react";

function fechaHoyIso() {
  const d = new Date();
  const p = (n: number) => `${n}`.padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function mismoMesActual(isoFecha: string): boolean {
  const d = new Date();
  const [y, m] = isoFecha.split("-").map(Number);
  return y === d.getFullYear() && m === d.getMonth() + 1;
}

/** Índice demo: diagnósticos positivos / diagnósticos con resultado definido. */
function calcularIndicePrenez(eventos: EventoReproductivoRegistro[]): number | null {
  const diag = eventos.filter((e) => e.tipo === "diagnostico_prenez");
  const definidos = diag.filter((e) => e.resultado !== "pendiente");
  if (definidos.length === 0) return null;
  const pos = definidos.filter((e) => e.resultado === "positivo").length;
  return Math.round((100 * pos) / definidos.length);
}

export function ReproduccionKpis({
  eventos,
}: {
  eventos: EventoReproductivoRegistro[];
}) {
  const hoy = fechaHoyIso();

  const indice = useMemo(() => calcularIndicePrenez(eventos), [eventos]);

  const partosMes = useMemo(
    () =>
      eventos.filter(
        (e) => e.tipo === "parto" && mismoMesActual(e.fecha)
      ).length,
    [eventos]
  );

  const proximosPartos = useMemo(() => {
    const conFpp = eventos.filter(
      (e) =>
        e.fechaProbableParto &&
        e.fechaProbableParto >= hoy &&
        e.tipo !== "parto"
    );
    const ordenados = [...conFpp].sort((a, b) =>
      (a.fechaProbableParto ?? "").localeCompare(b.fechaProbableParto ?? "")
    );
    const visto = new Set<string>();
    const lista: EventoReproductivoRegistro[] = [];
    for (const ev of ordenados) {
      if (visto.has(ev.caravanaHembra)) continue;
      visto.add(ev.caravanaHembra);
      lista.push(ev);
    }
    return lista;
  }, [eventos, hoy]);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="border-border/80 shadow-sm shadow-primary/5">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Índice de preñez
          </CardTitle>
          <Percent className="h-4 w-4 text-primary" aria-hidden />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold tabular-nums">
            {indice !== null ? `${indice} %` : "—"}
          </p>
          <CardDescription className="mt-2">
            Diagnósticos positivos sobre diagnósticos con resultado definido
            (demo).
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm shadow-primary/5">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Partos del mes
          </CardTitle>
          <Baby className="h-4 w-4 text-primary" aria-hidden />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold tabular-nums">{partosMes}</p>
          <CardDescription className="mt-2">
            Eventos tipo parto registrados en el mes calendario actual del
            navegador.
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm shadow-primary/5 lg:col-span-1">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Próximos partos esperados
          </CardTitle>
          <CalendarHeart className="h-4 w-4 text-primary" aria-hidden />
        </CardHeader>
        <CardContent className="space-y-2">
          {proximosPartos.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Sin fechas proyectadas futuras en el dataset actual.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {proximosPartos.slice(0, 5).map((e) => (
                <li
                  key={`${e.id}-${e.fechaProbableParto}`}
                  className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-border/70 bg-muted/20 px-3 py-2"
                >
                  <span className="font-medium text-foreground">
                    {e.caravanaHembra}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {e.fechaProbableParto
                      ? formatFechaCortaEs(e.fechaProbableParto)
                      : "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {proximosPartos.length > 5 ? (
            <p className="text-xs text-muted-foreground">
              +{proximosPartos.length - 5} más en el listado completo (por FPP).
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
