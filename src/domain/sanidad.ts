export type EventoSanitarioTipo =
  | "vacuna"
  | "antiparasitario"
  | "tratamiento"
  | "enfermedad";

export interface EventoSanitarioRegistro {
  id: string;
  caravana: string;
  tipo: EventoSanitarioTipo;
  producto: string;
  dosis: string;
  /** ISO yyyy-mm-dd */
  fecha: string;
  lotePotrero: string;
  responsable: string;
  observaciones?: string;
}

export interface ProximaAplicacionSanitaria {
  id: string;
  /** ISO yyyy-mm-dd */
  fechaProgramada: string;
  tipo: EventoSanitarioTipo;
  titulo: string;
  lotePotrero?: string;
  /** Si aplica a un individuo puntual */
  caravana?: string;
  notas?: string;
}

export type AlertaVencimientoTipo =
  | "retiro_carne"
  | "retiro_lacteos"
  | "vacuna_plan"
  | "renov_certificado"
  | "medicacion";

export interface AlertaVencimientoSanidad {
  id: string;
  severidad: "info" | "warning" | "critical";
  tipo: AlertaVencimientoTipo;
  titulo: string;
  detalle: string;
  /** ISO yyyy-mm-dd límite o vencimiento */
  fechaLimite: string;
  referenciaCaravana?: string;
  referenciaLote?: string;
}

export const TIPOS_EVENTO: EventoSanitarioTipo[] = [
  "vacuna",
  "antiparasitario",
  "tratamiento",
  "enfermedad",
];

export function labelTipoEventoSanidad(t: EventoSanitarioTipo): string {
  const m: Record<EventoSanitarioTipo, string> = {
    vacuna: "Vacuna",
    antiparasitario: "Antiparasitario",
    tratamiento: "Tratamiento",
    enfermedad: "Enfermedad",
  };
  return m[t];
}

export function labelTipoAlertaVencimiento(t: AlertaVencimientoTipo): string {
  const m: Record<AlertaVencimientoTipo, string> = {
    retiro_carne: "Retiro carne",
    retiro_lacteos: "Retiro lácteos",
    vacuna_plan: "Plan sanitario",
    renov_certificado: "Certificado / carnet",
    medicacion: "Medicación seguimiento",
  };
  return m[t];
}
