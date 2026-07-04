"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type EventoReproductivo = {
  id: string;
  caravana: string;
  tipo: string;
  fecha: string;
  toro: string;
  resultado: string;
  fecha_probable_parto: string;
  observaciones: string;
};

export default function ReproduccionPage() {
  const supabase = createClient();
  const [eventos, setEventos] = useState<EventoReproductivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [nuevo, setNuevo] = useState({
    caravana: "", tipo: "", fecha: "",
    toro: "", resultado: "Pendiente",
    fecha_probable_parto: "", observaciones: ""
  });

  async function cargarEventos() {
    const { data, error } = await supabase.from("reproduccion").select("*");
    if (!error && data) setEventos(data);
    setLoading(false);
  }

  useEffect(() => { cargarEventos(); }, []);

  async function guardarEvento() {
    if (!nuevo.caravana || !nuevo.tipo) {
      alert("Caravana y tipo son obligatorios");
      return;
    }
    setGuardando(true);
    const { error } = await supabase.from("reproduccion").insert([{ ...nuevo }]);
    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      setMostrarFormulario(false);
      setNuevo({ caravana: "", tipo: "", fecha: "", toro: "", resultado: "Pendiente", fecha_probable_parto: "", observaciones: "" });
      cargarEventos();
    }
    setGuardando(false);
  }

  const prenadas = eventos.filter(e => e.resultado === "Positivo").length;
  const servicios = eventos.filter(e => e.tipo === "Servicio" || e.tipo === "Inseminación").length;
  const proximosPartos = eventos.filter(e => e.fecha_probable_parto && new Date(e.fecha_probable_parto) > new Date()).length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reproducción</h1>
        <p className="text-muted-foreground">Seguimiento reproductivo del rodeo — {eventos.length} eventos registrados</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Diagnósticos positivos</p>
          <p className="text-3xl font-semibold mt-1 text-green-700">{prenadas}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Servicios realizados</p>
          <p className="text-3xl font-semibold mt-1">{servicios}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Próximos partos</p>
          <p className="text-3xl font-semibold mt-1 text-amber-600">{proximosPartos}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setMostrarFormulario(!mostrarFormulario)} className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
          + Registrar evento reproductivo
        </button>
      </div>

      {mostrarFormulario && (
        <div className="border rounded-lg p-5 space-y-4 bg-muted/30">
          <h2 className="font-semibold text-base">Registrar evento reproductivo</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Caravana *</label>
              <input className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: #0221" value={nuevo.caravana} onChange={e => setNuevo({...nuevo, caravana: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Tipo *</label>
              <select className="border rounded px-3 py-2 text-sm w-full" value={nuevo.tipo} onChange={e => setNuevo({...nuevo, tipo: e.target.value})}>
                <option value="">Seleccionar</option>
                <option value="Servicio">Servicio</option>
                <option value="Inseminación">Inseminación</option>
                <option value="Diagnóstico de preñez">Diagnóstico de preñez</option>
                <option value="Parto">Parto</option>
                <option value="Aborto">Aborto</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Fecha</label>
              <input type="date" className="border rounded px-3 py-2 text-sm w-full" value={nuevo.fecha} onChange={e => setNuevo({...nuevo, fecha: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Toro / Semen</label>
              <input className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: T-03" value={nuevo.toro} onChange={e => setNuevo({...nuevo, toro: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Resultado</label>
              <select className="border rounded px-3 py-2 text-sm w-full" value={nuevo.resultado} onChange={e => setNuevo({...nuevo, resultado: e.target.value})}>
                <option value="Pendiente">Pendiente</option>
                <option value="Positivo">Positivo</option>
                <option value="Negativo">Negativo</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Fecha probable de parto</label>
              <input type="date" className="border rounded px-3 py-2 text-sm w-full" value={nuevo.fecha_probable_parto} onChange={e => setNuevo({...nuevo, fecha_probable_parto: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Observaciones</label>
            <textarea className="border rounded px-3 py-2 text-sm w-full" rows={2} value={nuevo.observaciones} onChange={e => setNuevo({...nuevo, observaciones: e.target.value})} />
          </div>
          <div className="flex gap-3">
            <button onClick={guardarEvento} disabled={guardando} className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
              {guardando ? "Guardando..." : "Guardar evento"}
            </button>
            <button onClick={() => setMostrarFormulario(false)} className="border px-4 py-2 rounded-lg text-sm hover:bg-muted">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Cargando eventos...</p>
      ) : eventos.length === 0 ? (
        <div className="border rounded-lg p-8 text-center text-muted-foreground">
          <p className="text-lg font-medium">No hay eventos reproductivos registrados</p>
          <p className="text-sm mt-1">Hacé clic en "Registrar evento reproductivo" para agregar el primero</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="text-left p-3">Caravana</th>
                <th className="text-left p-3">Tipo</th>
                <th className="text-left p-3">Fecha</th>
                <th className="text-left p-3">Toro</th>
                <th className="text-left p-3">Resultado</th>
                <th className="text-left p-3">Fecha parto</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((e) => (
                <tr key={e.id} className="border-t hover:bg-muted/50">
                  <td className="p-3 font-medium">{e.caravana}</td>
                  <td className="p-3">{e.tipo}</td>
                  <td className="p-3">{e.fecha}</td>
                  <td className="p-3">{e.toro}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      e.resultado === "Positivo" ? "bg-green-100 text-green-800" :
                      e.resultado === "Negativo" ? "bg-red-100 text-red-800" :
                      "bg-amber-100 text-amber-800"
                    }`}>
                      {e.resultado}
                    </span>
                  </td>
                  <td className="p-3">{e.fecha_probable_parto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}