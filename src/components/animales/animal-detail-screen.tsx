"use client";

import { resumenEdad } from "@/components/animales/animal-utils";
import { useAnimalesStore } from "@/components/animales/animales-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AnimalEvento } from "@/domain/animal";
import {
  labelCategoria,
  labelEstadoReproductivo,
  labelEstadoSanitario,
  labelSexo,
} from "@/domain/animal";
import {
  formatFechaCortaEs,
  formatFechaEs,
  formatGdpKgDia,
  formatKgEs,
} from "@/lib/format-es";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export function AnimalDetailScreen({ id }: { id: string }) {
  const { animales } = useAnimalesStore();

  const animal = useMemo(
    () => animales.find((a) => a.id === decodeURIComponent(id)),
    [animales, id]
  );

  const eventos = useMemo(() => {
    if (!animal) return [];
    return [...animal.historial].sort((a, b) => b.fecha.localeCompare(a.fecha));
  }, [animal]);

  if (!animal) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Animal no encontrado</CardTitle>
            <CardDescription>
              Puede tratarse de un enlace viejo o de un alta que aún no se reflejó.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary">
              <Link href="/animales">Volver al listado</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-4">
          <Button asChild variant="ghost" className="-mx-3 gap-2 px-3 text-muted-foreground hover:text-foreground">
            <Link href="/animales">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Volver a animales
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {animal.caravana}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>{labelCategoria(animal.categoria)}</Badge>
              <Badge variant="outline">{labelSexo(animal.sexo)}</Badge>
              <Badge variant="outline">{animal.raza}</Badge>
              <Badge variant="secondary">{animal.lotePotrero}</Badge>
            </div>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-3 text-xs text-muted-foreground md:flex">
          <Sparkles className="h-4 w-4 text-primary" aria-hidden />
          <span>
            Esta ficha muestra KPIs sintéticos coherentes entre cría/recría/terminación para la demo UI.
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Datos básicos</CardTitle>
            <CardDescription>Identificación y origen racial del animal.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <Row k="Caravana" v={animal.caravana} />
            <Row k="Categoría" v={labelCategoria(animal.categoria)} />
            <Row k="Raza" v={animal.raza} />
            <Row k="Sexo" v={labelSexo(animal.sexo)} />
            <Row k="Fecha de nacimiento" v={`${formatFechaEs(animal.fechaNacimiento)} (${resumenEdad(animal.fechaNacimiento)})`} />
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Peso vivo y ganancia diaria</CardTitle>
            <CardDescription>Referencia campo / sala — valores de muestra.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <Metric label="Peso actual" value={formatKgEs(animal.pesoActualKg)} hint="Último registro válido." />
              <Metric
                label="GDP"
                value={formatGdpKgDia(animal.gdpKgDia)}
                hint={gdpHint(animal.gdpKgDia)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Estado sanitario y reproductivo</CardTitle>
            <CardDescription>Plan sanitario integral y ciclo materno cuando aplica.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <Row k="Sanidad" v={labelEstadoSanitario(animal.estadoSanitario)} />
            <Row
              k="Reproducción"
              v={
                animal.sexo === "M"
                  ? "No aplica por sexo macho."
                  : labelEstadoReproductivo(animal.estadoReproductivo)
              }
            />
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Lote asignado</CardTitle>
            <CardDescription>Ubicación productiva dentro del establecimiento.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="rounded-lg border border-border bg-muted/20 p-4 font-medium leading-relaxed text-foreground">
              {animal.lotePotrero}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Historial de eventos</CardTitle>
            <CardDescription>
              Sanidad, movimientos de lote, pesajes y marcadores reproductivos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[min(28rem,70vh)] pr-3">
              {eventos.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aún no hay eventos cargados para este animal (podés cargarlos al implementar registros persistentes).
                </p>
              ) : (
                <ul className="space-y-4">
                  {eventos.map((ev) => (
                    <li
                      key={ev.id}
                      className="rounded-xl border border-border/80 bg-muted/15 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <TipoEventBadge tipo={ev.tipo} />
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {formatFechaCortaEs(ev.fecha)}
                        </span>
                      </div>
                      <p className="mt-2 font-semibold text-foreground">{ev.titulo}</p>
                      {ev.detalle ? (
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{ev.detalle}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid gap-1">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{k}</p>
      <p className="font-medium text-foreground">{v}</p>
    </div>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-lg border border-border/70 bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function gdpHint(gdpKgDia: number) {
  if (gdpKgDia < 0) {
    return "Negativo habitual en rodeo materno cuando el foco ya no es crecimiento (demo).";
  }
  if (gdpKgDia < 0.35) {
    return "GDP bajo/coherente para vacas y toros mantenimiento.";
  }
  return "GDP orientado a recría/terminación dentro del ciclo completo.";
}

function TipoEventBadge({ tipo }: { tipo: AnimalEvento["tipo"] }) {
  const palette: Record<AnimalEvento["tipo"], string> = {
    sanidad:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100",
    pesaje:
      "border-blue-500/40 bg-blue-500/10 text-blue-900 dark:text-blue-100",
    movimiento:
      "border-violet-500/40 bg-violet-500/10 text-violet-900 dark:text-violet-100",
    reproduccion:
      "border-amber-500/45 bg-amber-500/10 text-amber-950 dark:text-amber-100",
    otro: "border-border bg-muted text-foreground",
  };

  const label: Record<AnimalEvento["tipo"], string> = {
    sanidad: "Sanidad",
    pesaje: "Pesaje",
    movimiento: "Movimiento",
    reproduccion: "Reproducción",
    otro: "Otro",
  };

  return (
    <Badge variant="outline" className={`${palette[tipo]} border`}>
      {label[tipo]}
    </Badge>
  );
}
