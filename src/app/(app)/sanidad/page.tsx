"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type EventoSanitario = {
  id: string;
  caravana: string;
  tipo: string;
  producto: string;
  dosis: string;
  fecha: string;
  responsable: string;
  observaciones: string;
};

export default function SanidadPage() {
  const supabase = createClient();
  const [eventos, setEventos] = useState<EventoSanitario[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [nuevo, setNuevo] = useState({
    caravana: "", tipo: "", producto: "",
    dosis: "", fecha: "", responsable: "", observaciones: ""
  });

  async function cargarEventos() {
    const { data, error } = await supabase.from("sanidad").select("*");
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
    const { error } = await supabase.from("sanidad").insert([{ ...nuevo }]);
    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      setMostrarFormulario(false);
      setNuevo({ caravana: "", tipo: "", producto: "", dosis: "", fecha: "", responsable: "", observaciones: "" });
      cargarEventos();
    }
    setGuardando(false);
  }

  const vacunas = eventos.filter(e => e.tipo === "Vacuna").length;
  const tratamientos = eventos.filter(e => e.tipo === "Tratamiento").length;
  const antiparasitarios = eventos.filter(e => e.tipo === "Antiparasitario").length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sanidad</h1>
        <p className="text-muted-foreground">Control sanitario del rodeo — {eventos.length} eventos registrados</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Vacunas</p>
          <p className="text-3xl font-semibold mt-1">{vacunas}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Tratamientos</p>
          <p className="text-3xl font-semibold mt-1 text-amber-600">{tratamientos}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Antiparasitarios</p>
          <p className="text-3xl font-semibold mt-1">{antiparasitarios}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setMostrarFormulario(!mostrarFormulario)} className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
          + Registrar evento sanitario
        </button>
      </div>

      {mostrarFormulario && (
        <div className="border rounded-lg p-5 space-y-4 bg-muted/30">
          <h2 className="font-semibold text-base">Registrar evento sanitario</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Caravana *</label>
              <input className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: #0221" value={nuevo.caravana} onChange={e => setNuevo({...nuevo, caravana: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Tipo *</label>
              <select className="border rounded px-3 py-2 text-sm w-full" value={nuevo.tipo} onChange={e => setNuevo({...nuevo, tipo: e.target.value})}>
                <option value="">Seleccionar</option>
                <option value="Vacuna">Vacuna</option>
                <option value="Antiparasitario">Antiparasitario</option>
                <option value="Tratamiento">Tratamiento</option>
                <option value="Enfermedad">Enfermedad</option>
                <option value="Control">Control</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Producto</label>
              <input className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: Ivermectina 1%" value={nuevo.producto} onChange={e => setNuevo({...nuevo, producto: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Dosis</label>
              <input className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: 5ml" value={nuevo.dosis} onChange={e => setNuevo({...nuevo, dosis: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Fecha</label>
              <input type="date" className="border rounded px-3 py-2 text-sm w-full" value={nuevo.fecha} onChange={e => setNuevo({...nuevo, fecha: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Responsable</label>
              <input className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: Dr. García" value={nuevo.responsable} onChange={e => setNuevo({...nuevo, responsable: e.target.value})} />
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
          <p className="text-lg font-medium">No hay eventos sanitarios registrados</p>
          <p className="text-sm mt-1">Hacé clic en "Registrar evento sanitario" para agregar el primero</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="text-left p-3">Caravana</th>
                <th className="text-left p-3">Tipo</th>
                <th className="text-left p-3">Producto</th>
                <th className="text-left p-3">Dosis</th>
                <th className="text-left p-3">Fecha</th>
                <th className="text-left p-3">Responsable</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((e) => (
                <tr key={e.id} className="border-t hover:bg-muted/50">
                  <td className="p-3 font-medium">{e.caravana}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      e.tipo === "Vacuna" ? "bg-blue-100 text-blue-800" :
                      e.tipo === "Tratamiento" ? "bg-red-100 text-red-800" :
                      e.tipo === "Antiparasitario" ? "bg-purple-100 text-purple-800" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {e.tipo}
                    </span>
                  </td>
                  <td className="p-3">{e.producto}</td>
                  <td className="p-3">{e.dosis}</td>
                  <td className="p-3">{e.fecha}</td>
                  <td className="p-3">{e.responsable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}