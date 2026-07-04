import { ReproduccionProvider } from "@/components/reproduccion/reproduccion-provider";
import type { ReactNode } from "react";

export default function ReproduccionLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <ReproduccionProvider>{children}</ReproduccionProvider>;
}
