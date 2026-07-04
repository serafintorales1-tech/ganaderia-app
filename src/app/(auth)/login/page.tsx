import { LoginForm } from "@/components/auth/login-form";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { Metadata } from "next";
import Link from "next/link";
import { Beef } from "lucide-react";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.1),_transparent_55%)]" />

      <div className="absolute right-4 top-4 md:right-8 md:top-8">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground transition hover:text-foreground"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Beef className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold">Ciclo Ganadero</span>
          </Link>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
            Iniciá sesión
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Accedé al panel del establecimiento.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-lg shadow-black/5 dark:shadow-black/30">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
