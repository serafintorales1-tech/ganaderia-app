import { ModuleEmptyState } from "@/components/module-empty-state";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuración",
};

export default function ConfiguracionPage() {
  return (
    <ModuleEmptyState
      title="Configuración"
      description="Usuario, empresa, períodos económicos y parámetros del establecimiento."
    />
  );
}
