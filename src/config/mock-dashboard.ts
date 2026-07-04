/** Datos mock para el dashboard (solo UI). */
export type KpiDatum = {
  key: string;
  label: string;
  hint: string;
  value: string;
  deltaLabel: string;
  trend: "up" | "down" | "flat";
};

export const mockKpis: KpiDatum[] = [
  {
    key: "animales",
    label: "Total animales",
    hint: "Incluye cría, recría y terminación",
    value: "1 248",
    deltaLabel: "+3,2 % vs. mes anterior",
    trend: "up",
  },
  {
    key: "prenez",
    label: "Índice de preñez",
    hint: "Vacas diagnosticadas sobre servidas",
    value: "58 %",
    deltaLabel: "+1,4 pp año corrido",
    trend: "up",
  },
  {
    key: "gdp",
    label: "GDP promedio",
    hint: "Ganancia diaria de peso terminación",
    value: "1,18 kg/día",
    deltaLabel: "Objetivo: 1,10 kg/día",
    trend: "up",
  },
  {
    key: "mortalidad",
    label: "Mortalidad",
    hint: "Últimos 12 meses",
    value: "1,05 %",
    deltaLabel: "−0,12 pp vs. año anterior",
    trend: "down",
  },
];

export type AlertKind = "sanitaria" | "stock" | "reproductiva";

export type MockAlert = {
  id: string;
  tipo: AlertKind;
  titulo: string;
  detalle: string;
  fecha: string;
};

export const mockAlerts: MockAlert[] = [
  {
    id: "1",
    tipo: "sanitaria",
    titulo: "Vacunación clostridiales — Lote T3",
    detalle:
      "Faltan 6 animales registados en el día 4/5 sin aplicación dentro de la ventana.",
    fecha: "Hoy, 07:48",
  },
  {
    id: "2",
    tipo: "stock",
    titulo: "Insumos: balanceado terminación",
    detalle:
      "Stock proyectado llega al mínimo en 11 días con la dotación actual de raciones.",
    fecha: "Ayer",
  },
  {
    id: "3",
    tipo: "reproductiva",
    titulo: "Gestaciones sin revisión tardía",
    detalle:
      "12 hembras tienen fecha de revisión anterior a −15 días respecto del calendario.",
    fecha: "10 may",
  },
  {
    id: "4",
    tipo: "sanitaria",
    titulo: "Tratamiento con retiro incompleto",
    detalle: "Dos animales terminación siguen dentro del período de retiro hasta el 13/5.",
    fecha: "9 may",
  },
];
