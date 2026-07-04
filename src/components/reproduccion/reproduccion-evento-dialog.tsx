"use client";

import { MOCK_ANIMALES } from "@/config/mock-animales";
import { useReproduccion } from "@/components/reproduccion/reproduccion-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  labelTipoEventoRepro,
  TIPOS_EVENTO_REPRO,
  type EventoReproductivoRegistro,
  type EventoReproductivoTipo,
  type ResultadoReproductivo,
} from "@/domain/reproduccion";
import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

function pad2(n: number) {
  return `${n}`.padStart(2, "0");
}

function fechaHoyIso() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function ReproduccionEventoDialog() {
  const { registrarEvento, eventos } = useReproduccion();

  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [caravanaHembra, setCaravanaHembra] = useState("");
  const [tipo, setTipo] = useState<EventoReproductivoTipo>("servicio");
  const [fecha, setFecha] = useState(fechaHoyIso);
  const [toroSemen, setToroSemen] = useState("");
  const [resultado, setResultado] = useState<ResultadoReproductivo>("pendiente");
  const [fechaProbableParto, setFechaProbableParto] = useState("");
  const [lote, setLote] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const caravanasHembras = useMemo(
    () => MOCK_ANIMALES.filter((a) => a.sexo === "H").map((a) => a.caravana),
    []
  );

  const lotesSugeridos = useMemo(() => {
    const set = new Set<string>();
    eventos.forEach((e) => set.add(e.lotePotrero.trim()));
    MOCK_ANIMALES.filter((a) => a.sexo === "H").forEach((a) =>
      set.add(a.lotePotrero.trim())
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [eventos]);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setCaravanaHembra("");
    setTipo("servicio");
    setFecha(fechaHoyIso());
    setToroSemen("");
    setResultado("pendiente");
    setFechaProbableParto("");
    setObservaciones("");
    setLote(lotesSugeridos[0] ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reinicio sólo al abrir
  }, [open]);

  function submit() {
    setError(null);
    const car = caravanaHembra.trim();
    const toro = toroSemen.trim();
    const l = lote.trim();

    if (!car || !toro) {
      setError("Caravana hembra y toro / semen son obligatorios.");
      return;
    }

    const fpp =
      fechaProbableParto.trim().length > 0 ? fechaProbableParto.trim() : undefined;

    const registro: Omit<EventoReproductivoRegistro, "id"> = {
      caravanaHembra: car,
      tipo,
      fecha,
      toroSemen: toro,
      resultado,
      fechaProbableParto: fpp,
      lotePotrero: l.length ? l : "Sin lote declarado",
      observaciones: observaciones.trim() || undefined,
    };

    registrarEvento(registro);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shrink-0 gap-2">
          <Plus className="h-4 w-4" aria-hidden />
          Registrar evento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo evento reproductivo</DialogTitle>
          <DialogDescription>
            Registro en memoria para la sesión (demo). Sugerencias de caravana limitadas a hembras del dataset.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <CampoFull>
            <Label htmlFor="rep-car">Animal hembra (caravana)</Label>
            <Input
              id="rep-car"
              list="rep-caravanas-hembras"
              autoComplete="off"
              placeholder="Ej. UY 884 102 045"
              value={caravanaHembra}
              onChange={(e) => setCaravanaHembra(e.target.value)}
            />
            <datalist id="rep-caravanas-hembras">
              {caravanasHembras.map((x) => (
                <option key={x} value={x} />
              ))}
            </datalist>
          </CampoFull>

          <Campo>
            <Label>Tipo de evento</Label>
            <Select
              value={tipo}
              onValueChange={(v) => setTipo(v as EventoReproductivoTipo)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_EVENTO_REPRO.map((t) => (
                  <SelectItem key={t} value={t}>
                    {labelTipoEventoRepro(t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Campo>

          <Campo>
            <Label htmlFor="rep-fe">Fecha</Label>
            <Input
              id="rep-fe"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </Campo>

          <CampoFull>
            <Label htmlFor="rep-toro">Toro o dosis de semen</Label>
            <Input
              id="rep-toro"
              placeholder="Ej. Toro Angus RN5 — o pajuela Holstein H09"
              value={toroSemen}
              onChange={(e) => setToroSemen(e.target.value)}
            />
          </CampoFull>

          <Campo>
            <Label>Resultado</Label>
            <Select
              value={resultado}
              onValueChange={(v) => setResultado(v as ResultadoReproductivo)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positivo">Positivo</SelectItem>
                <SelectItem value="negativo">Negativo</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>
          </Campo>

          <Campo>
            <Label htmlFor="rep-fpp">Fecha probable de parto</Label>
            <Input
              id="rep-fpp"
              type="date"
              value={fechaProbableParto}
              onChange={(e) => setFechaProbableParto(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Opcional si el evento aún no proyecta un parto.
            </p>
          </Campo>

          <CampoFull>
            <Label htmlFor="rep-lote">Lote / potrero</Label>
            <Input
              id="rep-lote"
              list="rep-lotes-sug"
              placeholder="Referencia del rodeo"
              value={lote}
              onChange={(e) => setLote(e.target.value)}
            />
            <datalist id="rep-lotes-sug">
              {lotesSugeridos.map((x) => (
                <option key={x} value={x} />
              ))}
            </datalist>
          </CampoFull>

          <CampoFull>
            <Label htmlFor="rep-obs">Observaciones</Label>
            <Textarea
              id="rep-obs"
              placeholder="Sincronías, ecografía, incidencias…"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </CampoFull>
        </div>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={submit}>
            Guardar registro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Campo({ children }: { children: ReactNode }) {
  return <div className="space-y-1.5">{children}</div>;
}

function CampoFull({ children }: { children: ReactNode }) {
  return <div className="space-y-1.5 sm:col-span-2">{children}</div>;
}
