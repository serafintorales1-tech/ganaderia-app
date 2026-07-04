import { mockAlerts, type AlertKind, type MockAlert } from "@/config/mock-dashboard";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Boxes, Droplets } from "lucide-react";

function alertBadge(tipo: AlertKind) {
  switch (tipo) {
    case "sanitaria":
      return (
        <Badge className="shrink-0 bg-primary/90 text-primary-foreground hover:bg-primary">
          Sanitaria
        </Badge>
      );
    case "stock":
      return (
        <Badge
          variant="secondary"
          className="shrink-0 bg-amber-500/15 text-amber-900 dark:text-amber-100"
        >
          Stock
        </Badge>
      );
    case "reproductiva":
      return (
        <Badge variant="outline" className="shrink-0 border-primary/35 text-primary">
          Reproductiva
        </Badge>
      );
    default:
      return <Badge variant="outline">Alerta</Badge>;
  }
}

function alertIcon(tipo: AlertKind) {
  switch (tipo) {
    case "sanitaria":
      return (
        <Droplets className="h-[1.125rem] w-[1.125rem] text-primary" aria-hidden />
      );
    case "stock":
      return (
        <Boxes className="h-[1.125rem] w-[1.125rem] text-amber-600 dark:text-amber-400" aria-hidden />
      );
    case "reproductiva":
      return (
        <AlertTriangle className="h-[1.125rem] w-[1.125rem] text-primary" aria-hidden />
      );
  }
}

export function AlertsPanel({ alerts = mockAlerts }: { alerts?: MockAlert[] }) {
  return (
    <section aria-label="Alertas activas">
      <Card className="border-border/80 shadow-sm shadow-primary/5">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <CardTitle className="text-lg">Alertas activas</CardTitle>
              <CardDescription>
                Ejemplos de prioridades sanitarias, de stock y reproductivas.
              </CardDescription>
            </div>
            <Badge variant="outline">{alerts.length} abiertas</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-0 p-0">
          {alerts.map((a, idx) => (
            <div key={a.id}>
              <div className="flex gap-4 px-6 py-5">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  {alertIcon(a.tipo)}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {alertBadge(a.tipo)}
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {a.fecha}
                    </span>
                  </div>
                  <p className="font-semibold leading-snug text-foreground">{a.titulo}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{a.detalle}</p>
                </div>
              </div>
              {idx < alerts.length - 1 ? <Separator /> : null}
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
