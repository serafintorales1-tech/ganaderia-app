"use client";

import { MOCK_ANIMALES } from "@/config/mock-animales";
import type { Animal } from "@/domain/animal";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { normalizeCaravana } from "./animal-utils";

type AnimalesCtx = {
  animales: Animal[];
  lotesPotreros: string[];
  addAnimal: (animal: Omit<Animal, "id">) => boolean;
};

const AnimalesContext = createContext<AnimalesCtx | null>(null);

export function AnimalesProvider({ children }: { children: ReactNode }) {
  const [animales, setAnimales] = useState<Animal[]>(MOCK_ANIMALES);

  const lotesPotreros = useMemo(() => {
    const s = new Set<string>();
    animales.forEach((a) => s.add(a.lotePotrero.trim()));
    return Array.from(s).sort((x, y) => x.localeCompare(y, "es"));
  }, [animales]);

  const addAnimal = useCallback((next: Omit<Animal, "id">): boolean => {
    const cand = normalizeCaravana(next.caravana);
    /** ID determinístico ayuda a evitar altas duplicadas en modo estricto (dev). */
    const id = `stk-${cand}`;

    let ok = false;
    setAnimales((prev) => {
      const exists = prev.some((a) => normalizeCaravana(a.caravana) === cand);
      if (exists) return prev;

      ok = true;
      return [...prev, { ...next, id }];
    });

    return ok;
  }, []);

  const value = useMemo(
    () => ({
      animales,
      lotesPotreros,
      addAnimal,
    }),
    [animales, addAnimal, lotesPotreros]
  );

  return (
    <AnimalesContext.Provider value={value}>{children}</AnimalesContext.Provider>
  );
}

export function useAnimalesStore() {
  const ctx = useContext(AnimalesContext);
  if (!ctx) {
    throw new Error("useAnimalesStore debe usarse bajo AnimalesProvider");
  }
  return ctx;
}

export function filtrarPorCaravana(lista: Animal[], q: string): Animal[] {
  const n = normalizeCaravana(q);
  if (!n) return lista;
  return lista.filter((a) => normalizeCaravana(a.caravana).includes(n));
}
