"use client";

import { ReproduccionEventoDialog } from "@/components/reproduccion/reproduccion-evento-dialog";
import { useReproduccion } from "@/components/reproduccion/reproduccion-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  EventoReproductivoRegistro,
  EventoReproductivoTipo,
} from "@/domain/reproduccion";
import {
  labelResultadoRepro,
  labelTipoEventoRepro,
  TIPOS_EVENTO_REPRO,
} from "@/domain/reproduccion";
import { formatFechaCortaEs } from "@/lib/format-es";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

const ALL = "__all__";

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, "");
}

function badgeTipoRow(ev: EventoReproductivoRegistro): string {
  const m: Record<EventoReproductivoTipo, string> = {
    servicio:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100",
    inseminacion:
      "border-sky-500/40 bg-sky-500/10 text-sky-900 dark:text-sky-100",
    diagnostico_prenez:
      "border-violet-500/40 bg-violet-500/10 text-violet-900 dark:text-violet-100",
    parto:
      "border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-50",
    aborto: "border-red-500/40 bg-red-500/10 text-red-900 dark:text-red-100",
  };
  return m[ev.tipo];
}

function badgeResultado(ev: EventoReproductivoRegistro): string {
  const m = {
    positivo:
      "border-emerald-600/45 bg-emerald-600/15 text-emerald-900 dark:text-emerald-100",
    negativo:
      "border-red-600/45 bg-red-600/15 text-red-900 dark:text-red-100",
    pendiente:
      "border-muted-foreground/40 bg-muted text-muted-foreground",
  };
  return m[ev.resultado];
}

export function ReproduccionListPanel() {
  const { eventos } = useReproduccion();

  const [busqueda, setBusqueda] = useState("");
  const [tipo, setTipo] = useState<"all" | EventoReproductivoTipo>("all");
  const [filtroLote, setFiltroLote] = useState<"all" | string>("all");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const lotesUnicos = useMemo(() => {
    const set = new Set<string>();
    eventos.forEach((e) => set.add(e.lotePotrero.trim()));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [eventos]);

  const resultado = useMemo(() => {
    const q = normalize(busqueda);
    return eventos.filter((ev) => {
      if (tipo !== "all" && ev.tipo !== tipo) return false;
      if (filtroLote !== "all" && ev.lotePotrero !== filtroLote) return false;
      if (fechaDesde && ev.fecha < fechaDesde) return false;
      if (fechaHasta && ev.fecha > fechaHasta) return false;
      if (q && !normalize(ev.caravanaHembra).includes(q)) return false;
      return true;
    });
  }, [eventos, tipo, filtroLote, fechaDesde, fechaHasta, busqueda]);

  const ordenados = useMemo(
    () => [...resultado].sort((a, b) => b.fecha.localeCompare(a.fecha)),
    [resultado]
  );

  function limpiar() {
    setBusqueda("");
    setTipo("all");
    setFiltroLote("all");
    setFechaDesde("");
    setFechaHasta("");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Eventos reproductivos
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Servicios, IA, diagnósticos, partos y abortos con trazabilidad por lote.
          </p>
        </div>
        <ReproduccionEventoDialog />
      </div>

      <Input
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por caravana hembra…"
        aria-label="Filtrar por caravana"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <FilterBlock label="Tipo">
          <Select
            value={tipo === "all" ? ALL : tipo}
            onValueChange={(v) =>
              setTipo(v === ALL ? "all" : (v as EventoReproductivoTipo))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos los tipos</SelectItem>
              {TIPOS_EVENTO_REPRO.map((t) => (
                <SelectItem key={t} value={t}>
                  {labelTipoEventoRepro(t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterBlock>

        <FilterBlock label="Lote / potrero">
          <Select
            value={filtroLote === "all" ? ALL : filtroLote}
            onValueChange={(v) => setFiltroLote(v === ALL ? "all" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos los lotes</SelectItem>
              {lotesUnicos.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterBlock>

        <FilterBlock label="Desde">
          <Input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
        </FilterBlock>

        <FilterBlock label="Hasta">
          <Input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
        </FilterBlock>

        <div className="flex flex-col justify-end gap-2 sm:col-span-2 xl:col-span-1">
          <Button type="button" variant="outline" onClick={limpiar}>
            Limpiar filtros
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span>
          Coincidencias:{" "}
          <strong className="text-foreground">{resultado.length}</strong>
        </span>
        <span className="hidden sm:inline">·</span>
        <span>
          Total cargado:{" "}
          <strong className="text-foreground">{eventos.length}</strong>
        </span>
      </div>

      <Separator />

      {ordenados.length === 0 ? (
        <Card className="border-dashed shadow-sm">
          <CardHeader>
            <CardTitle>Sin registros</CardTitle>
            <CardDescription>
              Ajustá filtros o cargá un nuevo evento reproductivo.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/80 bg-card shadow-sm shadow-primary/5">
          <table className="w-full min-w-[1080px] text-left text-sm">
            <thead className="border-b bg-muted/50 text-muted-foreground">
              <tr>
                <Th>Fecha</Th>
                <Th>Tipo</Th>
                <Th>Hembra</Th>
                <Th>Toro / semen</Th>
                <Th>Resultado</Th>
                <Th className="hidden lg:table-cell">FPP</Th>
                <Th className="hidden xl:table-cell">Lote</Th>
                <Th className="hidden xl:table-cell">Observaciones</Th>
              </tr>
            </thead>
            <tbody>
              {ordenados.map((ev) => (
                <tr
                  key={ev.id}
                  className="border-t border-border/70 transition-colors hover:bg-muted/30"
                >
                  <Td className="whitespace-nowrap tabular-nums text-muted-foreground">
                    {formatFechaCortaEs(ev.fecha)}
                  </Td>
                  <Td>
                    <Badge
                      variant="outline"
                      className={`border font-medium ${badgeTipoRow(ev)}`}
                    >
                      {labelTipoEventoRepro(ev.tipo)}
                    </Badge>
                  </Td>
                  <Td className="font-semibold">{ev.caravanaHembra}</Td>
                  <Td className="max-w-[220px]">{ev.toroSemen}</Td>
                  <Td>
                    <Badge
                      variant="outline"
                      className={`font-medium ${badgeResultado(ev)}`}
                    >
                      {labelResultadoRepro(ev.resultado)}
                    </Badge>
                  </Td>
                  <Td className="hidden whitespace-nowrap tabular-nums lg:table-cell">
                    {ev.fechaProbableParto
                      ? formatFechaCortaEs(ev.fechaProbableParto)
                      : "—"}
                  </Td>
                  <Td className="hidden max-w-[220px] truncate xl:table-cell">
                    {ev.lotePotrero}
                  </Td>
                  <Td className="hidden max-w-[260px] truncate text-muted-foreground xl:table-cell">
                    {ev.observaciones ?? "—"}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FilterBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function Th({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-4 py-3 text-[0.6875rem] font-semibold uppercase tracking-wide ${className ?? ""}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-4 py-3 align-middle ${className ?? ""}`}>{children}</td>
  );
}
