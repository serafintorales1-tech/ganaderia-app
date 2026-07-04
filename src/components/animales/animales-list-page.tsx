"use client";

import { AnimalCreateDialog } from "@/components/animales/animal-create-dialog";
import { AnimalesCardsView } from "@/components/animales/animales-cards-view";
import { AnimalesFiltersBar } from "@/components/animales/animales-filters-bar";
import {
  filtrarPorCaravana,
  useAnimalesStore,
} from "@/components/animales/animales-provider";
import { AnimalesTableView } from "@/components/animales/animales-table-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CategoriaAnimal, EstadoSanitario } from "@/domain/animal";
import { LayoutGrid, Table2 } from "lucide-react";
import { useMemo, useState } from "react";

export function AnimalesListPage() {
  const { animales, lotesPotreros } = useAnimalesStore();

  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState<"all" | CategoriaAnimal>("all");
  const [filtroLote, setFiltroLote] = useState<"all" | string>("all");
  const [sanitario, setSanitario] = useState<"all" | EstadoSanitario>("all");

  type Vista = "tabla" | "tarjetas";
  const [vista, setVista] = useState<Vista>("tabla");

  const resultado = useMemo(() => {
    const porCaravan = filtrarPorCaravana(animales, busqueda);
    return porCaravan.filter((a) => {
      if (categoria !== "all" && a.categoria !== categoria) return false;
      if (filtroLote !== "all" && a.lotePotrero !== filtroLote) return false;
      if (sanitario !== "all" && a.estadoSanitario !== sanitario) return false;
      return true;
    });
  }, [animales, busqueda, categoria, filtroLote, sanitario]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Animales
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Stock del ciclo completo con filtros de categoría, lote/potrero y
            estado sanitario. Los datos son de ejemplo hasta conectar el backend.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <Badge variant="secondary">
              Resultados · {resultado.length}
            </Badge>
            <Badge variant="outline">Total cargados · {animales.length}</Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:justify-end">
          <div className="inline-flex rounded-lg border border-border bg-card p-1 shadow-sm">
            <Button
              type="button"
              size="sm"
              variant={vista === "tabla" ? "secondary" : "ghost"}
              className={`gap-1.5 ${vista === "tabla" ? "shadow-sm" : ""}`}
              onClick={() => setVista("tabla")}
            >
              <Table2 className="h-4 w-4" aria-hidden />
              Tabla
            </Button>
            <Button
              type="button"
              size="sm"
              variant={vista === "tarjetas" ? "secondary" : "ghost"}
              className={`gap-1.5 ${vista === "tarjetas" ? "shadow-sm" : ""}`}
              onClick={() => setVista("tarjetas")}
            >
              <LayoutGrid className="h-4 w-4" aria-hidden />
              Tarjetas
            </Button>
          </div>
          <AnimalCreateDialog />
        </div>
      </div>

      <AnimalesFiltersBar
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
        categoria={categoria}
        onCategoriaChange={setCategoria}
        filtroLote={filtroLote}
        onFiltroLoteChange={setFiltroLote}
        sanitario={sanitario}
        onSanitarioChange={setSanitario}
        lotesOpciones={lotesPotreros}
      />

      {resultado.length === 0 ? (
        <Card className="border-dashed shadow-sm">
          <CardHeader>
            <CardTitle>No hay coincidencias</CardTitle>
            <CardDescription>
              Probá ajustar filtros o limpiando el buscador de caravana.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : vista === "tabla" ? (
        <AnimalesTableView animales={resultado} />
      ) : (
        <AnimalesCardsView animales={resultado} />
      )}
    </div>
  );
}
