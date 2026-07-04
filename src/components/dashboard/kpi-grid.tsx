import { mockKpis, type KpiDatum } from "@/config/mock-dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Minus } from "lucide-react";

function TrendIcon({
  datum,
}: {
  datum: KpiDatum;
}) {
  const isMortality = datum.key === "mortalidad";
  if (datum.trend === "flat") {
    return <Minus className="h-4 w-4 text-muted-foreground" aria-hidden />;
  }
  const up = datum.trend === "up";
  if (isMortality) {
    return up ? (
      <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" aria-hidden />
    ) : (
      <ArrowDownRight
        className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
        aria-hidden
      />
    );
  }
  return up ? (
    <ArrowUpRight
      className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
      aria-hidden
    />
  ) : (
    <ArrowDownRight className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden />
  );
}

export function KpiGrid({ data = mockKpis }: { data?: KpiDatum[] }) {
  return (
    <section aria-label="Indicadores clave">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Panorama rápido
          </h2>
          <p className="text-sm text-muted-foreground">
            Indicadores de ejemplo sobre el período seleccionado.
          </p>
        </div>
        <Badge variant="secondary">Datos demo</Badge>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.map((kpi) => (
          <Card
            key={kpi.key}
            className="border-border/80 shadow-sm shadow-primary/5 transition hover:shadow-md"
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div className="space-y-1">
                <CardTitle className="text-sm font-semibold leading-none text-muted-foreground">
                  {kpi.label}
                </CardTitle>
                <CardDescription className="leading-snug">
                  {kpi.hint}
                </CardDescription>
              </div>
              <div className="rounded-md border border-border bg-background p-1.5">
                <TrendIcon datum={kpi} />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-semibold tabular-nums tracking-tight text-foreground md:text-[1.75rem]">
                {kpi.value}
              </p>
              <p className="flex items-start gap-1 text-xs text-muted-foreground">
                <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-70" />
                <span>{kpi.deltaLabel}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
