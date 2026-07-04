"use client";

import { MOCK_EVENTOS_REPRODUCCION } from "@/config/mock-reproduccion";
import type { EventoReproductivoRegistro } from "@/domain/reproduccion";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ReproCtx = {
  eventos: EventoReproductivoRegistro[];
  registrarEvento: (registro: Omit<EventoReproductivoRegistro, "id">) => void;
};

const ReproduccionContext = createContext<ReproCtx | null>(null);

export function ReproduccionProvider({ children }: { children: ReactNode }) {
  const [eventos, setEventos] = useState<EventoReproductivoRegistro[]>(
    MOCK_EVENTOS_REPRODUCCION
  );

  const registrarEvento = useCallback(
    (registro: Omit<EventoReproductivoRegistro, "id">) => {
      const id = `rep-${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`;
      setEventos((prev) => [{ ...registro, id }, ...prev]);
    },
    []
  );

  const value = useMemo(
    (): ReproCtx => ({
      eventos,
      registrarEvento,
    }),
    [eventos, registrarEvento]
  );

  return (
    <ReproduccionContext.Provider value={value}>
      {children}
    </ReproduccionContext.Provider>
  );
}

export function useReproduccion() {
  const ctx = useContext(ReproduccionContext);
  if (!ctx) throw new Error("useReproduccion requiere ReproduccionProvider");
  return ctx;
}
