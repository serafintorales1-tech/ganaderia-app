import Link from "next/link";
import { ArrowRight, Beef, CheckCircle2 } from "lucide-react";
import { LandingHeaderActions } from "@/components/layout/landing-header-actions";

const features = [
  "Vacas, rebaños y trazabilidad",
  "Sanidad y reproducción en un solo lugar",
  "Inventario y pasturas pensados para el campo",
  "Reportes claros para decisiones rápidas",
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.12),_transparent_50%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Beef className="h-6 w-6" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Ciclo Ganadero
          </span>
        </div>
        <div className="flex items-center gap-3">
          <LandingHeaderActions />
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
          >
            Ir al panel
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 md:px-6 md:pt-16">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-primary">Software ganadero</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Operá tu establecimiento de ciclo completo con claridad.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            Una base profesional para registrar animales, movimientos y
            decisiones del día a día. Diseño tipo SaaS, listo para crecer con tu
            negocio.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
            >
              Ver el panel
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted"
            >
              Acceder
            </Link>
          </div>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2">
          {features.map((text) => (
            <li
              key={text}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm font-medium text-foreground">{text}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
