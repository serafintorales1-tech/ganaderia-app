export type CategoriaAnimal =
  | "vaca"
  | "novillo"
  | "ternero"
  | "vaquillona"
  | "toro";

export type EstadoSanitario =
  | "al_día"
  | "pendiente_vacunar"
  | "en_tratamiento"
  | "periodo_retiro";

export type EstadoReproductivo =
  | "no_aplica"
  | "vacia"
  | "servida"
  | "preñada"
  | "post_parto";

export interface AnimalEvento {
  id: string;
  /** ISO yyyy-mm-dd */
  fecha: string;
  tipo: "sanidad" | "pesaje" | "movimiento" | "reproduccion" | "otro";
  titulo: string;
  detalle?: string;
}

export interface Animal {
  id: string;
  caravana: string;
  categoria: CategoriaAnimal;
  raza: string;
  /** H = hembra · M = macho */
  sexo: "H" | "M";
  /** ISO yyyy-mm-dd */
  fechaNacimiento: string;
  pesoActualKg: number;
  gdpKgDia: number;
  estadoSanitario: EstadoSanitario;
  estadoReproductivo: EstadoReproductivo;
  /** Nombre corto para potreros / lotes internos */
  lotePotrero: string;
  historial: AnimalEvento[];
}

export function labelCategoria(v: CategoriaAnimal): string {
  const map: Record<CategoriaAnimal, string> = {
    vaca: "Vaca",
    novillo: "Novillo",
    ternero: "Ternero",
    vaquillona: "Vaquillona",
    toro: "Toro",
  };
  return map[v];
}

export function labelEstadoSanitario(v: EstadoSanitario): string {
  const map: Record<EstadoSanitario, string> = {
    al_día: "Al día",
    pendiente_vacunar: "Pendiente vacunar",
    en_tratamiento: "En tratamiento",
    periodo_retiro: "Período de retiro",
  };
  return map[v];
}

export function labelEstadoReproductivo(v: EstadoReproductivo): string {
  const map: Record<EstadoReproductivo, string> = {
    no_aplica: "No aplica",
    vacia: "Vacía",
    servida: "Servida",
    preñada: "Preñada",
    post_parto: "Post-parto",
  };
  return map[v];
}

export const CATEGORIAS: CategoriaAnimal[] = [
  "vaca",
  "novillo",
  "ternero",
  "vaquillona",
  "toro",
];

export const ESTADOS_SANITARIOS: EstadoSanitario[] = [
  "al_día",
  "pendiente_vacunar",
  "en_tratamiento",
  "periodo_retiro",
];

export const ESTADOS_REPRODUCTIVOS: EstadoReproductivo[] = [
  "no_aplica",
  "vacia",
  "servida",
  "preñada",
  "post_parto",
];

export function labelSexo(sexo: "H" | "M"): string {
  return sexo === "H" ? "Hembra" : "Macho";
}
