"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Pesaje = {
  id: string;
  caravana: string;
  categoria: string;
  lote: string;
  fecha: string;
  peso: number;
  gdp: number;
  observaciones: string;
};

export default function PesajesPage() {
  const supabase = createClient();
  const [pesajes, setPesajes] = useState<Pesaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [nuevo, setNuevo] = useState({
    caravana: "", categoria: "", lote: "", fecha: "",
    peso: "", gdp: "", observaciones: ""
  });

  async function cargarPesajes() {
    const { data, error } = await supabase.from("pesajes").select("*");
    if (!error && data) setPesajes(data);
    setLoading(false);
  }

  useEffect(() => { cargarPesajes(); }, []);

  async function guardarPesaje() {
    if (!nuevo.caravana || !nuevo.peso) {
      alert("Caravana y peso son obligatorios");
      return;
    }
    setGuardando(true);
    const { error } = await supabase.from("pesajes").insert([{
      ...nuevo,
      peso: parseFloat(nuevo.peso),
      gdp: nuevo.gdp ? parseFloat(nuevo.gdp) : null
    }]);
    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      setMostrarFormulario(false);
      setNuevo({ caravana: "", categoria: "", lote: "", fecha: "", peso: "", gdp: "", observaciones: "" });
      cargarPesajes();
    }
    setGuardando(false);
  }

  const promedioPeso = pesajes.length > 0 ? Math.round(pesajes.reduce((a, b) => a + b.peso, 0) / pesajes.length) : 0;
  const promedioGdp = pesajes.length > 0 ? (pesajes.reduce((a, b) => a + (b.gdp || 0), 0) / pesajes.length).toFixed(2) : "0.00";
  const bajosRendimiento = pesajes.filter(p => p.gdp < 0.6).length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pesajes</h1>
        <p className="text-muted-foreground">Control de ganancia diaria de peso — {pesajes.length} registros</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Peso promedio</p>
          <p className="text-3xl font-semibold mt-1">{promedioPeso} kg</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">GDP promedio</p>
          <p className="text-3xl font-semibold mt-1">{promedioGdp} kg/día</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Bajo rendimiento</p>
          <p className="text-3xl font-semibold mt-1 text-red-600">{bajosRendimiento}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setMostrarFormulario(!mostrarFormulario)} className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
          + Registrar pesaje
        </button>
      </div>

      {mostrarFormulario && (
        <div className="border rounded-lg p-5 space-y-4 bg-muted/30">
          <h2 className="font-semibold text-base">Registrar nuevo pesaje</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Caravana *</label>
              <input className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: #0221" value={nuevo.caravana} onChange={e => setNuevo({...nuevo, caravana: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Categoría</label>
              <select className="border rounded px-3 py-2 text-sm w-full" value={nuevo.categoria} onChange={e => setNuevo({...nuevo, categoria: e.target.value})}>
                <option value="">Seleccionar</option>
                <option value="Vaca">Vaca</option>
                <option value="Novillo">Novillo</option>
                <option value="Ternero">Ternero</option>
                <option value="Vaquillona">Vaquillona</option>
                <option value="Toro">Toro</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Lote</label>
              <input className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: Lote 2" value={nuevo.lote} onChange={e => setNuevo({...nuevo, lote: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Fecha</label>
              <input type="date" className="border rounded px-3 py-2 text-sm w-full" value={nuevo.fecha} onChange={e => setNuevo({...nuevo, fecha: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Peso (kg) *</label>
              <input type="number" className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: 350" value={nuevo.peso} onChange={e => setNuevo({...nuevo, peso: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">GDP (kg/día)</label>
              <input type="number" step="0.01" className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: 0.85" value={nuevo.gdp} onChange={e => setNuevo({...nuevo, gdp: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Observaciones</label>
            <textarea className="border rounded px-3 py-2 text-sm w-full" rows={2} value={nuevo.observaciones} onChange={e => setNuevo({...nuevo, observaciones: e.target.value})} />
          </div>
          <div className="flex gap-3">
            <button onClick={guardarPesaje} disabled={guardando} className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
              {guardando ? "Guardando..." : "Guardar pesaje"}
            </button>
            <button onClick={() => setMostrarFormulario(false)} className="border px-4 py-2 rounded-lg text-sm hover:bg-muted">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Cargando pesajes...</p>
      ) : pesajes.length === 0 ? (
        <div className="border rounded-lg p-8 text-center text-muted-foreground">
          <p className="text-lg font-medium">No hay pesajes registrados</p>
          <p className="text-sm mt-1">Hacé clic en "Registrar pesaje" para agregar el primero</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="text-left p-3">Caravana</th>
                <th className="text-left p-3">Categoría</th>
                <th className="text-left p-3">Lote</th>
                <th className="text-left p-3">Fecha</th>
                <th className="text-left p-3">Peso</th>
                <th className="text-left p-3">GDP</th>
                <th className="text-left p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {pesajes.map((p) => (
                <tr key={p.id} className="border-t hover:bg-muted/50">
                  <td className="p-3 font-medium">{p.caravana}</td>
                  <td className="p-3">{p.categoria}</td>
                  <td className="p-3">{p.lote}</td>
                  <td className="p-3">{p.fecha}</td>
                  <td className="p-3">{p.peso} kg</td>
                  <td className={`p-3 font-medium ${p.gdp >= 0.7 ? "text-green-700" : "text-red-600"}`}>
                    {p.gdp ? `+${p.gdp.toFixed(2)}` : "-"}
                  </td>
                  <td className="p-3">
                    {p.gdp >= 0.7 ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Bueno</span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Bajo</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}