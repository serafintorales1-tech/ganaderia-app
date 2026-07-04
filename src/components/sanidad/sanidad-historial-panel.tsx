"use client";

import { SanidadEventoDialog } from "@/components/sanidad/sanidad-evento-dialog";
import { useSanidad } from "@/components/sanidad/sanidad-provider";
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
  EventoSanitarioRegistro,
  EventoSanitarioTipo,
} from "@/domain/sanidad";
import { labelTipoEventoSanidad, TIPOS_EVENTO } from "@/domain/sanidad";
import { formatFechaCortaEs } from "@/lib/format-es";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

const ALL = "__all__";

function normalizeCaravan(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, "");
}

function badgeTipo(ev: EventoSanitarioRegistro): string {
  const map: Record<EventoSanitarioTipo, string> = {
    vacuna:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100",
    antiparasitario:
      "border-sky-500/40 bg-sky-500/10 text-sky-900 dark:text-sky-100",
    tratamiento:
      "border-violet-500/40 bg-violet-500/10 text-violet-900 dark:text-violet-100",
    enfermedad:
      "border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-50",
  };
  return map[ev.tipo];
}

export function SanidadHistorialPanel() {
  const { eventos } = useSanidad();

  const [busqueda, setBusqueda] = useState("");
  const [tipo, setTipo] = useState<"all" | EventoSanitarioTipo>("all");
  const [filtroLote, setFiltroLote] = useState<"all" | string>("all");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const lotesUnicos = useMemo(() => {
    const set = new Set<string>();
    eventos.forEach((e) => set.add(e.lotePotrero.trim()));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [eventos]);

  const resultado = useMemo(() => {
    const bq = normalizeCaravan(busqueda);
    return eventos.filter((ev) => {
      if (tipo !== "all" && ev.tipo !== tipo) return false;
      if (filtroLote !== "all" && ev.lotePotrero !== filtroLote) return false;
      if (fechaDesde && ev.fecha < fechaDesde) return false;
      if (fechaHasta && ev.fecha > fechaHasta) return false;
      if (bq && !normalizeCaravan(ev.caravana).includes(bq)) return false;
      return true;
    });
  }, [eventos, tipo, filtroLote, fechaDesde, fechaHasta, busqueda]);

  const ordenados = useMemo(
    () => [...resultado].sort((a, b) => b.fecha.localeCompare(a.fecha)),
    [resultado]
  );

  function limpiarFiltros() {
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
            Histórico de eventos sanitarios
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Aplicaciones por animal productivo y control de tratamientos.
          </p>
        </div>
        <SanidadEventoDialog />
      </div>

      <div className="space-y-4">
        <Input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por caravana…"
          aria-label="Filtrar por caravana"
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <FilterBlock label="Tipo">
            <Select
              value={tipo === "all" ? ALL : tipo}
              onValueChange={(v) =>
                setTipo(v === ALL ? "all" : (v as EventoSanitarioTipo))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todos los tipos</SelectItem>
                {TIPOS_EVENTO.map((t) => (
                  <SelectItem key={t} value={t}>
                    {labelTipoEventoSanidad(t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterBlock>

          <FilterBlock label="Lote / potrero">
            <Select
              value={filtroLote === "all" ? ALL : filtroLote}
              onValueChange={(v) =>
                setFiltroLote(v === ALL ? "all" : v)
              }
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
            <Button type="button" variant="outline" onClick={limpiarFiltros}>
              Limpiar filtros
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>
            Coincidencias: <strong className="text-foreground">{resultado.length}</strong>
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
              <CardTitle>Sin registros para esta selección</CardTitle>
              <CardDescription>
                Ajustá los filtros de fecha o cargá un nuevo evento sanitario.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border/80 bg-card shadow-sm shadow-primary/5">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="border-b bg-muted/50 text-muted-foreground">
                <tr>
                  <Th>Fecha</Th>
                  <Th>Tipo</Th>
                  <Th>Caravana</Th>
                  <Th>Producto</Th>
                  <Th>Dosis</Th>
                  <Th className="hidden lg:table-cell">Lote</Th>
                  <Th className="hidden xl:table-cell">Responsable</Th>
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
                        className={`border font-medium ${badgeTipo(ev)}`}
                      >
                        {labelTipoEventoSanidad(ev.tipo)}
                      </Badge>
                    </Td>
                    <Td className="font-semibold">{ev.caravana}</Td>
                    <Td className="max-w-[220px]">{ev.producto}</Td>
                    <Td className="max-w-[200px]">{ev.dosis}</Td>
                    <Td className="hidden max-w-[240px] truncate lg:table-cell">
                      {ev.lotePotrero}
                    </Td>
                    <Td className="hidden xl:table-cell">{ev.responsable}</Td>
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
