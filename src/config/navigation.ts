import type { LucideIcon } from "lucide-react";
import {
  Baby,
  Beef,
  CircleDot,
  FileBarChart,
  HeartPulse,
  LayoutDashboard,
  MapPinned,
  Package,
  Scale,
  Settings,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

/** Navegación del ciclo completo: cría, recría y terminación. */
export const mainNav: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Resumen operativo",
  },
  {
    title: "Animales",
    href: "/animales",
    icon: Beef,
    description: "Stock y categorías",
  },
  {
    title: "Nacimientos",
    href: "/nacimientos",
    icon: Baby,
    description: "Pariciones y cría",
  },
  {
    title: "Sanidad",
    href: "/sanidad",
    icon: HeartPulse,
    description: "Tratamientos y vacunaciones",
  },
  {
    title: "Pesajes",
    href: "/pesajes",
    icon: Scale,
    description: "Control de ganancia",
  },
  {
    title: "Potreros",
    href: "/potreros",
    icon: MapPinned,
    description: "Lotes y carga animal",
  },
  {
    title: "Insumos",
    href: "/insumos",
    icon: Package,
    description: "Stock de insumos y raciones",
  },
  {
    title: "Reproducción",
    href: "/reproduccion",
    icon: CircleDot,
    description: "Servicios e IATF",
  },
  {
    title: "Reportes",
    href: "/reportes",
    icon: FileBarChart,
    description: "Indicadores y exportación",
  },
  {
    title: "Configuración",
    href: "/configuracion",
    icon: Settings,
    description: "Establecimiento y usuarios",
  },
];
