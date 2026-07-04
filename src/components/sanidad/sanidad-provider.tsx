"use client";

import {
  MOCK_ALERTAS_VENCIMIENTOS,
  MOCK_EVENTOS_SANIDAD,
  MOCK_PROXIMAS_SANIDAD,
} from "@/config/mock-sanidad";
import type { EventoSanitarioRegistro } from "@/domain/sanidad";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type SanidadCtx = {
  /** Eventos históricos + altas en sesión */
  eventos: EventoSanitarioRegistro[];
  proximasAplicaciones: typeof MOCK_PROXIMAS_SANIDAD;
  alertasVencimientos: typeof MOCK_ALERTAS_VENCIMIENTOS;
  registrarEvento: (registro: Omit<EventoSanitarioRegistro, "id">) => void;
};

const SanidadContext = createContext<SanidadCtx | null>(null);

export function SanidadProvider({ children }: { children: ReactNode }) {
  const [eventos, setEventos] =
    useState<EventoSanitarioRegistro[]>(MOCK_EVENTOS_SANIDAD);

  const registrarEvento = useCallback(
    (registro: Omit<EventoSanitarioRegistro, "id">) => {
      const id = `evt-${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`;
      setEventos((prev) => [{ ...registro, id }, ...prev]);
    },
    []
  );

  const value = useMemo(
    (): SanidadCtx => ({
      eventos,
      proximasAplicaciones: MOCK_PROXIMAS_SANIDAD,
      alertasVencimientos: MOCK_ALERTAS_VENCIMIENTOS,
      registrarEvento,
    }),
    [eventos, registrarEvento]
  );

  return (
    <SanidadContext.Provider value={value}>{children}</SanidadContext.Provider>
  );
}

export function useSanidad() {
  const ctx = useContext(SanidadContext);
  if (!ctx) throw new Error("useSanidad requiere SanidadProvider");
  return ctx;
}
