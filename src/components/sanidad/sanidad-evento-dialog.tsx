"use client";

import { MOCK_ANIMALES } from "@/config/mock-animales";
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
import type { ReactNode } from "react";
import { useMemo, useEffect, useState } from "react";
import {
  labelTipoEventoSanidad,
  TIPOS_EVENTO,
  type EventoSanitarioRegistro,
  type EventoSanitarioTipo,
} from "@/domain/sanidad";
import { useSanidad } from "@/components/sanidad/sanidad-provider";
import { Plus } from "lucide-react";

function pad2(n: number) {
  return `${n}`.padStart(2, "0");
}

function fechaHoyIso() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function SanidadEventoDialog() {
  const { registrarEvento, eventos } = useSanidad();

  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [caravana, setCaravana] = useState("");
  const [tipo, setTipo] = useState<EventoSanitarioTipo>("vacuna");
  const [producto, setProducto] = useState("");
  const [dosis, setDosis] = useState("");
  const [fecha, setFecha] = useState(fechaHoyIso);
  const [lote, setLote] = useState("");
  const [responsable, setResponsable] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const caravanasEjemplo = useMemo(
    () => MOCK_ANIMALES.map((a) => a.caravana),
    []
  );

  const lotesSugeridos = useMemo(() => {
    const set = new Set<string>();
    eventos.forEach((e) => set.add(e.lotePotrero.trim()));
    MOCK_ANIMALES.forEach((a) => set.add(a.lotePotrero.trim()));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [eventos]);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setCaravana("");
    setTipo("vacuna");
    setProducto("");
    setDosis("");
    setFecha(fechaHoyIso());
    setResponsable("");
    setObservaciones("");
    setLote(lotesSugeridos[0] ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reinicio sólo al abrir
  }, [open]);

  function submit() {
    setError(null);
    const c = caravana.trim();
    const p = producto.trim();
    const dosisVal = dosis.trim();
    const l = lote.trim();
    const r = responsable.trim();

    if (!c || !p || !dosisVal || !r) {
      setError("Caravana, producto/medicamento, dosis y responsable son obligatorios.");
      return;
    }

    const registro: Omit<EventoSanitarioRegistro, "id"> = {
      caravana: c,
      tipo,
      producto: p,
      dosis: dosisVal,
      fecha,
      lotePotrero: l.length ? l : "Sin lote declarado",
      responsable: r,
      observaciones: observaciones.trim() || undefined,
    };

    registrarEvento(registro);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shrink-0">
          <Plus className="h-4 w-4" aria-hidden />
          Registrar evento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo evento sanitario</DialogTitle>
          <DialogDescription>
            Los registros sólo persisten durante la sesión (demo UI).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <CampoFull>
            <Label htmlFor="san-car">Animal (caravana)</Label>
            <Input
              id="san-car"
              list="sanidad-caravanas-sug"
              autoComplete="off"
              placeholder="Ej. UY 884 102 045"
              value={caravana}
              onChange={(e) => setCaravana(e.target.value)}
            />
            <datalist id="sanidad-caravanas-sug">
              {caravanasEjemplo.map((x) => (
                <option key={x} value={x} />
              ))}
            </datalist>
          </CampoFull>

          <Campo>
            <Label>Tipo de evento</Label>
            <Select
              value={tipo}
              onValueChange={(v) => setTipo(v as EventoSanitarioTipo)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_EVENTO.map((t) => (
                  <SelectItem key={t} value={t}>
                    {labelTipoEventoSanidad(t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Campo>

          <CampoFull>
            <Label htmlFor="san-prod">Producto / medicamento</Label>
            <Input
              id="san-prod"
              placeholder="Ej. Ivermectina 3,15% LA"
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
            />
          </CampoFull>

          <CampoFull>
            <Label htmlFor="san-dosis">Dosis</Label>
            <Input
              id="san-dosis"
              placeholder="Ej. 7 ml SC / peso corrido sala"
              value={dosis}
              onChange={(e) => setDosis(e.target.value)}
            />
          </CampoFull>

          <Campo>
            <Label htmlFor="san-fe">Fecha</Label>
            <Input
              id="san-fe"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </Campo>

          <CampoFull>
            <Label htmlFor="san-lote">Lote / potrero referencia</Label>
            <Input
              id="san-lote"
              list="sanidad-lotes-sug"
              placeholder="Seleccioná o escribí un lote"
              value={lote}
              onChange={(e) => setLote(e.target.value)}
            />
            <datalist id="sanidad-lotes-sug">
              {lotesSugeridos.map((x) => (
                <option key={x} value={x} />
              ))}
            </datalist>
          </CampoFull>

          <CampoFull>
            <Label htmlFor="san-resp">Responsable</Label>
            <Input
              id="san-resp"
              placeholder="Nombre completo MV / técnico"
              value={responsable}
              onChange={(e) => setResponsable(e.target.value)}
            />
          </CampoFull>

          <CampoFull>
            <Label htmlFor="san-obs">Observaciones</Label>
            <Textarea
              id="san-obs"
              placeholder="Reacciones, condiciones meteorológicas, retiros, etc."
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
