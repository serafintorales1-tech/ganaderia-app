"use client";

import type { HTMLAttributes, ReactNode } from "react";
import type { Animal } from "@/domain/animal";
import {
  labelCategoria,
  labelEstadoSanitario,
  labelSexo,
} from "@/domain/animal";
import { formatGdpKgDia, formatKgEs } from "@/lib/format-es";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function AnimalesTableView({ animales }: { animales: Animal[] }) {
  const router = useRouter();

  return (
    <div className="relative rounded-xl border border-border/80 bg-card shadow-sm shadow-primary/5">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="bg-muted/60 text-muted-foreground">
            <tr>
              <Th>Caravana</Th>
              <Th>Categoría</Th>
              <Th>Sexo</Th>
              <Th className="hidden lg:table-cell">Raza</Th>
              <Th className="hidden xl:table-cell">Lote / potrero</Th>
              <Th className="hidden lg:table-cell">Sanidad</Th>
              <Th className="text-right hidden md:table-cell">Peso vivo</Th>
              <Th className="text-right hidden md:table-cell">GDP</Th>
              <Th className="w-px pr-4" aria-label="Ir a ficha" />
            </tr>
          </thead>
          <tbody>
            {animales.map((a) => (
              <tr
                key={a.id}
                tabIndex={0}
                role="link"
                onClick={() => router.push(`/animales/${a.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/animales/${a.id}`);
                  }
                }}
                className="cursor-pointer border-t border-border/70 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Td className="font-semibold text-foreground">{a.caravana}</Td>
                <Td>{labelCategoria(a.categoria)}</Td>
                <Td>{labelSexo(a.sexo)}</Td>
                <Td className="hidden max-w-[10rem] truncate lg:table-cell">
                  {a.raza}
                </Td>
                <Td className="hidden max-w-[16rem] truncate xl:table-cell">
                  {a.lotePotrero}
                </Td>
                <Td className="hidden lg:table-cell">
                  {labelEstadoSanitario(a.estadoSanitario)}
                </Td>
                <Td className="hidden tabular-nums text-right md:table-cell">
                  {formatKgEs(a.pesoActualKg)}
                </Td>
                <Td className="hidden tabular-nums text-right md:table-cell">
                  {formatGdpKgDia(a.gdpKgDia)}
                </Td>
                <Td className="pr-4 text-right text-muted-foreground">
                  <ChevronRight className="ml-auto h-4 w-4" aria-hidden />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
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
