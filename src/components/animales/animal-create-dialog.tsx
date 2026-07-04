"use client";

import { useAnimalesStore } from "@/components/animales/animales-provider";
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
import {
  CATEGORIAS,
  ESTADOS_REPRODUCTIVOS,
  ESTADOS_SANITARIOS,
  labelCategoria,
  labelEstadoReproductivo,
  labelEstadoSanitario,
  type Animal,
  type CategoriaAnimal,
  type EstadoReproductivo,
  type EstadoSanitario,
} from "@/domain/animal";
import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

const defaultBirthIso = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const mo = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${mo}-${day}`;
};

export function AnimalCreateDialog() {
  const { addAnimal, lotesPotreros } = useAnimalesStore();

  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [caravana, setCaravana] = useState("");
  const [categoria, setCategoria] = useState<CategoriaAnimal>("ternero");
  const [raza, setRaza] = useState("Angus");
  const [sexo, setSexo] = useState<"H" | "M">("M");
  const [fechaNacimiento, setFechaNacimiento] = useState(defaultBirthIso);
  const [peso, setPeso] = useState("180");
  const [gdp, setGdp] = useState("0.92");
  const [estadoSanitario, setEstadoSanitario] =
    useState<EstadoSanitario>("al_día");
  const [estadoRep, setEstadoRep] = useState<EstadoReproductivo>("no_aplica");
  const [lote, setLote] = useState("");

  const lotesLista = useMemo(() => [...lotesPotreros].sort(), [lotesPotreros]);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setCaravana("");
    setCategoria("ternero");
    setRaza("Angus");
    setSexo("M");
    setFechaNacimiento(defaultBirthIso());
    setPeso("180");
    setGdp("0.92");
    setEstadoSanitario("al_día");
    setEstadoRep("no_aplica");
    const sugerencia = [...lotesPotreros].sort()[0] ?? "";
    setLote(sugerencia);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps -- solo al abrir el diálogo

  useEffect(() => {
    if (sexo === "M") setEstadoRep("no_aplica");
  }, [sexo]);

  function submit() {
    setError(null);
    const p = Number(peso.replace(",", "."));
    const g = Number(gdp.replace(",", "."));

    const carTrim = caravana.trim();
    if (!carTrim) {
      setError("La caravana es obligatoria.");
      return;
    }
    if (!Number.isFinite(p) || p <= 0) {
      setError("Ingresá un peso válido (> 0).");
      return;
    }
    if (!Number.isFinite(g)) {
      setError("Ingresá un GDP válido (puede ser negativo en algunos registros demo).");
      return;
    }
    const loteValor = lote.trim().length ? lote.trim() : "Sin asignar";

    const reproFinal: EstadoReproductivo =
      sexo === "M" ? "no_aplica" : estadoRep;

    const next: Omit<Animal, "id"> = {
      caravana: carTrim,
      categoria,
      raza: raza.trim() || "Sin datos",
      sexo,
      fechaNacimiento,
      pesoActualKg: p,
      gdpKgDia: g,
      estadoSanitario,
      estadoReproductivo: reproFinal,
      lotePotrero: loteValor,
      historial: [],
    };

    const ok = addAnimal(next);
    if (!ok) {
      setError(`Ya existe un animal con caravana cercana a «${carTrim}». Probá otro número.`);
      return;
    }
    setOpen(false);
  }

  const reproSelectable = sexo === "H";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" aria-hidden />
          Agregar animal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Alta de animal</DialogTitle>
          <DialogDescription>
            Registro rápido (demo): los datos solo viven en memoria durante la sesión.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 pt-2 sm:grid-cols-2">
          <Field full>
            <Label htmlFor="caravana">Caravana</Label>
            <Input
              id="caravana"
              autoComplete="off"
              placeholder="Ej. UY 999 444 022"
              value={caravana}
              onChange={(e) => setCaravana(e.target.value)}
            />
          </Field>

          <Field>
            <Label>Categoría</Label>
            <Select value={categoria} onValueChange={(v) => setCategoria(v as CategoriaAnimal)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIAS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {labelCategoria(c)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <Label htmlFor="raza">Raza</Label>
            <Input
              id="raza"
              value={raza}
              onChange={(e) => setRaza(e.target.value)}
            />
          </Field>

          <Field>
            <Label>Sexo</Label>
            <Select value={sexo} onValueChange={(v) => setSexo(v as "H" | "M")}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar sexo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="H">Hembra</SelectItem>
                <SelectItem value="M">Macho</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <Label htmlFor="fn">Fecha de nacimiento</Label>
            <Input
              id="fn"
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
            />
          </Field>

          <Field>
            <Label htmlFor="peso">Peso actual (kg)</Label>
            <Input
              id="peso"
              inputMode="decimal"
              type="number"
              min={1}
              step={1}
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
            />
          </Field>

          <Field>
            <Label htmlFor="gdp">GDP (kg/día)</Label>
            <Input
              id="gdp"
              inputMode="decimal"
              type="number"
              step={0.01}
              value={gdp}
              onChange={(e) => setGdp(e.target.value)}
            />
          </Field>

          <Field>
            <Label>Estado sanitario</Label>
            <Select
              value={estadoSanitario}
              onValueChange={(v) => setEstadoSanitario(v as EstadoSanitario)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ESTADOS_SANITARIOS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {labelEstadoSanitario(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field full>
            <Label>Estado reproductivo</Label>
            {reproSelectable ? (
              <Select
                value={estadoRep}
                onValueChange={(v) => setEstadoRep(v as EstadoReproductivo)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS_REPRODUCTIVOS.map((er) => (
                    <SelectItem key={er} value={er}>
                      {labelEstadoReproductivo(er)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="rounded-lg border border-dashed border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                En machos el estado reproductivo queda en <strong>No aplica</strong>.
              </p>
            )}
          </Field>

          <Field full>
            <Label htmlFor="lote">Lote / potrero</Label>
            <Input
              id="lote"
              list="lotes-sugeridos"
              placeholder="Elegí una sugerencia o escribí uno nuevo"
              value={lote}
              onChange={(e) => setLote(e.target.value)}
            />
            <datalist id="lotes-sugeridos">
              {lotesLista.map((l) => (
                <option key={l} value={l} />
              ))}
            </datalist>
          </Field>
        </div>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={submit}>
            Guardar animal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  children,
  full,
}: {
  children: ReactNode;
  full?: boolean;
}) {
  return <div className={`space-y-1.5 ${full ? "sm:col-span-2" : ""}`}>{children}</div>;
}
