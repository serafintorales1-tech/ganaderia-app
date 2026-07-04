"use client";

import type { ReactNode } from "react";
import {
  CATEGORIAS,
  ESTADOS_SANITARIOS,
  labelCategoria,
  labelEstadoSanitario,
  type CategoriaAnimal,
  type EstadoSanitario,
} from "@/domain/animal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const ALL = "__all__";

type Props = {
  busqueda: string;
  onBusquedaChange: (v: string) => void;
  categoria: "all" | CategoriaAnimal;
  onCategoriaChange: (v: "all" | CategoriaAnimal) => void;
  filtroLote: "all" | string;
  onFiltroLoteChange: (v: "all" | string) => void;
  sanitario: "all" | EstadoSanitario;
  onSanitarioChange: (v: "all" | EstadoSanitario) => void;
  lotesOpciones: string[];
};

export function AnimalesFiltersBar({
  busqueda,
  onBusquedaChange,
  categoria,
  onCategoriaChange,
  filtroLote,
  onFiltroLoteChange,
  sanitario,
  onSanitarioChange,
  lotesOpciones,
}: Props) {
  return (
    <div className="space-y-4">
      <Input
        value={busqueda}
        onChange={(e) => onBusquedaChange(e.target.value)}
        placeholder="Buscar por caravana (número, espacios o país)..."
        aria-label="Buscar por caravana"
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <FilterSelect
          label="Categoría"
          value={categoria === "all" ? ALL : categoria}
          onValueChange={(v) =>
            onCategoriaChange(v === ALL ? "all" : (v as CategoriaAnimal))
          }
          placeholder="Todas"
        >
          <SelectItem value={ALL}>Todas las categorías</SelectItem>
          {CATEGORIAS.map((c) => (
            <SelectItem key={c} value={c}>
              {labelCategoria(c)}
            </SelectItem>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Lote / potrero"
          value={filtroLote === "all" ? ALL : filtroLote}
          onValueChange={(v) => onFiltroLoteChange(v === ALL ? "all" : v)}
          placeholder="Todos"
        >
          <SelectItem value={ALL}>Todos los lotes</SelectItem>
          {lotesOpciones.map((l) => (
            <SelectItem key={l} value={l}>
              {l}
            </SelectItem>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Estado sanitario"
          value={sanitario === "all" ? ALL : sanitario}
          onValueChange={(v) =>
            onSanitarioChange(v === ALL ? "all" : (v as EstadoSanitario))
          }
          placeholder="Todos"
        >
          <SelectItem value={ALL}>Todos los estados</SelectItem>
          {ESTADOS_SANITARIOS.map((s) => (
            <SelectItem key={s} value={s}>
              {labelEstadoSanitario(s)}
            </SelectItem>
          ))}
        </FilterSelect>

        <div className="flex flex-col justify-end gap-1.5 rounded-lg border border-dashed border-border bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Combiná filtros</span>
          <span>Las condiciones aplican todas a la vez; el resultado se actualiza al instante (demo).</span>
        </div>
      </div>

      <Separator className="bg-border/80" />
    </div>
  );
}

function FilterSelect({
  label,
  placeholder,
  value,
  onValueChange,
  children,
}: {
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger aria-label={label}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  );
}
