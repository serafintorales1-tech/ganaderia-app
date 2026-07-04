"use client";

import { useSanidad } from "@/components/sanidad/sanidad-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ProximaAplicacionSanitaria } from "@/domain/sanidad";
import { labelTipoEventoSanidad } from "@/domain/sanidad";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

function pad2(n: number) {
  return `${n}`.padStart(2, "0");
}

function isoFromYMD(y: number, mIdx: number, d: number) {
  return `${y}-${pad2(mIdx + 1)}-${pad2(d)}`;
}

function fechaHoyIso() {
  const n = new Date();
  return isoFromYMD(n.getFullYear(), n.getMonth(), n.getDate());
}

export function SanidadCalendarioPanel() {
  const { proximasAplicaciones } = useSanidad();
  const hoyIso = fechaHoyIso();

  const [cursor, setCursor] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);

  useEffect(() => {
    setDiaSeleccionado(null);
  }, [cursor]);

  const year = cursor.getFullYear();
  const monthIdx = cursor.getMonth();
  const monthKey = `${year}-${pad2(monthIdx + 1)}`;

  const tituloMes = useMemo(() => {
    const label = cursor.toLocaleDateString("es-AR", {
      month: "long",
      year: "numeric",
    });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }, [cursor]);

  const diasEnMes = useMemo(
    () => new Date(year, monthIdx + 1, 0).getDate(),
    [year, monthIdx]
  );

  const offsetLunes = useMemo(() => {
    const first = new Date(year, monthIdx, 1).getDay();
    return (first + 6) % 7;
  }, [year, monthIdx]);

  const proximasMes = useMemo(
    () =>
      [...proximasAplicaciones].filter((p) =>
        p.fechaProgramada.startsWith(monthKey)
      ),
    [proximasAplicaciones, monthKey]
  );

  const fechasProximas = useMemo(() => {
    const s = new Set<string>();
    proximasMes.forEach((p) => s.add(p.fechaProgramada));
    return s;
  }, [proximasMes]);

  const agenda = useMemo(() => {
    const base =
      diaSeleccionado === null
        ? proximasMes
        : proximasMes.filter((p) => p.fechaProgramada === diaSeleccionado);
    return [...base].sort((a, b) => {
      const c = a.fechaProgramada.localeCompare(b.fechaProgramada);
      return c !== 0 ? c : a.titulo.localeCompare(b.titulo, "es");
    });
  }, [proximasMes, diaSeleccionado]);

  const celdas = useMemo(() => {
    const out: ({ kind: "empty" } | { kind: "day"; day: number })[] = [];
    for (let i = 0; i < offsetLunes; i++) out.push({ kind: "empty" });
    for (let d = 1; d <= diasEnMes; d++) out.push({ kind: "day", day: d });
    while (out.length < 42) out.push({ kind: "empty" });
    return out;
  }, [diasEnMes, offsetLunes]);

  function prevMonth() {
    setCursor(new Date(year, monthIdx - 1, 1));
  }

  function nextMonth() {
    setCursor(new Date(year, monthIdx + 1, 1));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
      <Card className="overflow-hidden border-border/80 shadow-sm">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-lg">Mes en curso</CardTitle>
          <CardDescription>
            Días marcados tienen próximas aplicaciones en el programa demo (no se recalcula al cargar eventos puntualistas).
          </CardDescription>
        </CardHeader>
        <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-4">
          <Button
            type="button"
            size="icon"
            variant="outline"
            aria-label="Mes anterior"
            onClick={prevMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <p className="min-w-0 flex-1 text-center text-sm font-semibold capitalize text-foreground">
            {tituloMes}
          </p>
          <Button
            type="button"
            size="icon"
            variant="outline"
            aria-label="Mes siguiente"
            onClick={nextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-px border-b border-border/70 bg-muted/40 px-2 py-2 text-center text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
          {["lun", "mar", "mié", "jue", "vie", "sáb", "dom"].map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 px-3 py-4 sm:gap-2">
          {celdas.map((cell, idx) =>
            cell.kind === "empty" ? (
              <div key={`e-${idx}`} className="aspect-square" aria-hidden />
            ) : (
              <DiaCelda
                key={`d-${idx}`}
                fechaIso={isoFromYMD(year, monthIdx, cell.day)}
                day={cell.day}
                hoyIso={hoyIso}
                tieneProxima={fechasProximas.has(
                  isoFromYMD(year, monthIdx, cell.day)
                )}
                seleccionado={
                  diaSeleccionado !== null &&
                  diaSeleccionado === isoFromYMD(year, monthIdx, cell.day)
                }
                onSelect={() =>
                  setDiaSeleccionado(isoFromYMD(year, monthIdx, cell.day))
                }
              />
            )
          )}
        </div>

        <div className="border-t border-border/70 px-4 py-3 text-xs text-muted-foreground">
          <button
            type="button"
            className="font-medium text-primary underline-offset-4 hover:underline"
            onClick={() => setDiaSeleccionado(null)}
          >
            Ver todas las próximas del mes
          </button>
          {diaSeleccionado ? (
            <span className="ml-2 text-muted-foreground">
              Filtradas al día seleccionado:{" "}
              <strong className="text-foreground">{diaSeleccionado}</strong>.
            </span>
          ) : null}
        </div>
      </Card>

      <Card className="flex min-h-[28rem] flex-col border-border/80 shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg">Próximas aplicaciones</CardTitle>
          <CardDescription>
            Agrupamiento operativo recomendado; ideal para sala móvil o recorridos de campo.
          </CardDescription>
        </CardHeader>
        <ScrollArea className="min-h-[18rem] flex-1 px-4 py-4">
          {agenda.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay actividades cargadas para este período dentro del mock.
            </p>
          ) : (
            <ul className="space-y-3">
              {agenda.map((p) => (
                <ProximaCard key={p.id} proxima={p} />
              ))}
            </ul>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
}

function DiaCelda({
  fechaIso,
  day,
  hoyIso,
  tieneProxima,
  seleccionado,
  onSelect,
}: {
  fechaIso: string;
  day: number;
  hoyIso: string;
  tieneProxima: boolean;
  seleccionado: boolean;
  onSelect: () => void;
}) {
  const esHoy = fechaIso === hoyIso;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Abrir día ${fechaIso}`}
      className={`
        relative flex aspect-square flex-col items-center justify-center rounded-xl border text-sm font-semibold
        transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        ${seleccionado ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-card hover:border-primary/40"}
        ${esHoy && !seleccionado ? "ring-2 ring-primary/40 ring-offset-2 ring-offset-background" : ""}
      `}
    >
      {day}
      {tieneProxima ? (
        <span
          className={`mt-1 h-1 w-6 rounded-full ${
            seleccionado ? "bg-primary-foreground/80" : "bg-primary"
          }`}
          aria-hidden
        />
      ) : (
        <span className="mt-1 h-1 w-6" aria-hidden />
      )}
    </button>
  );
}

function ProximaCard({ proxima }: { proxima: ProximaAplicacionSanitaria }) {
  return (
    <li className="rounded-xl border border-border/80 bg-muted/15 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="tabular-nums">
          {formatFechaTitulo(proxima.fechaProgramada)}
        </Badge>
        <Badge variant="outline" className="font-medium">
          {labelTipoEventoSanidad(proxima.tipo)}
        </Badge>
      </div>
      <p className="mt-2 font-semibold leading-snug text-foreground">
        {proxima.titulo}
      </p>
      <dl className="mt-3 space-y-1 text-xs text-muted-foreground">
        {proxima.lotePotrero ? (
          <div>
            <dt className="inline font-semibold text-foreground/80">Lote: </dt>
            <dd className="inline">{proxima.lotePotrero}</dd>
          </div>
        ) : null}
        {proxima.caravana ? (
          <div>
            <dt className="inline font-semibold text-foreground/80">Animal: </dt>
            <dd className="inline">{proxima.caravana}</dd>
          </div>
        ) : null}
        {proxima.notas ? (
          <p className="pt-2 text-sm leading-relaxed text-muted-foreground">
            {proxima.notas}
          </p>
        ) : null}
      </dl>
    </li>
  );
}

function formatFechaTitulo(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
