"use client";

import type { Animal } from "@/domain/animal";
import {
  labelCategoria,
  labelEstadoSanitario,
  labelSexo,
} from "@/domain/animal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatGdpKgDia, formatKgEs } from "@/lib/format-es";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function AnimalesCardsView({ animales }: { animales: Animal[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {animales.map((a) => (
        <Link
          key={a.id}
          href={`/animales/${a.id}`}
          className="group block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Card className="h-full border-border/80 shadow-sm shadow-primary/5 transition group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-md">
            <CardHeader className="space-y-3 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">{a.caravana}</CardTitle>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {labelCategoria(a.categoria)}
                    </Badge>
                    <Badge variant="outline">{labelSexo(a.sexo)}</Badge>
                  </div>
                </div>
                <ChevronRight
                  className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground"
                  aria-hidden
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex flex-col gap-2">
                <DetailLine label="Raza" value={a.raza} />
                <DetailLine label="Lote" value={a.lotePotrero} />
              </div>
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/70 bg-muted/20 p-3 tabular-nums">
                <div>
                  <p className="text-xs text-muted-foreground">Peso vivo</p>
                  <p className="font-semibold text-foreground">
                    {formatKgEs(a.pesoActualKg)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">GDP</p>
                  <p className="font-semibold text-foreground">
                    {formatGdpKgDia(a.gdpKgDia)}
                  </p>
                </div>
              </div>
              <div className="rounded-md border border-dashed border-primary/30 bg-primary/5 px-3 py-2 text-xs leading-snug text-primary">
                {labelEstadoSanitario(a.estadoSanitario)}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="truncate font-medium leading-snug text-foreground">{value}</p>
    </div>
  );
}
