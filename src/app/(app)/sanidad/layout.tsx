import { SanidadProvider } from "@/components/sanidad/sanidad-provider";
import type { ReactNode } from "react";

export default function SanidadLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <SanidadProvider>{children}</SanidadProvider>;
}
