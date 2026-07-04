export type EventoReproductivoTipo =
  | "servicio"
  | "inseminacion"
  | "diagnostico_prenez"
  | "parto"
  | "aborto";

export type ResultadoReproductivo = "positivo" | "negativo" | "pendiente";

export interface EventoReproductivoRegistro {
  id: string;
  caravanaHembra: string;
  tipo: EventoReproductivoTipo;
  /** ISO yyyy-mm-dd */
  fecha: string;
  /** Toro monta natural o identificación de dosis / pajuela */
  toroSemen: string;
  resultado: ResultadoReproductivo;
  /** ISO yyyy-mm-dd — vacío si no aplica */
  fechaProbableParto?: string;
  lotePotrero: string;
  observaciones?: string;
}

export const TIPOS_EVENTO_REPRO: EventoReproductivoTipo[] = [
  "servicio",
  "inseminacion",
  "diagnostico_prenez",
  "parto",
  "aborto",
];

export function labelTipoEventoRepro(t: EventoReproductivoTipo): string {
  const m: Record<EventoReproductivoTipo, string> = {
    servicio: "Servicio",
    inseminacion: "Inseminación",
    diagnostico_prenez: "Diagnóstico de preñez",
    parto: "Parto",
    aborto: "Aborto",
  };
  return m[t];
}

export function labelResultadoRepro(r: ResultadoReproductivo): string {
  const m: Record<ResultadoReproductivo, string> = {
    positivo: "Positivo",
    negativo: "Negativo",
    pendiente: "Pendiente",
  };
  return m[r];
}
