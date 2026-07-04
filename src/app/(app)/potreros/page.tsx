"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Potrero = {
  id: string;
  nombre: string;
  superficie: number;
  carga_actual: number;
  capacidad_max: number;
  animales: number;
  estado: string;
  forraje: string;
};

export default function PotrerosPage() {
  const supabase = createClient();
  const [potreros, setPotreros] = useState<Potrero[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [nuevo, setNuevo] = useState({
    nombre: "", superficie: "", carga_actual: "",
    capacidad_max: "", animales: "", estado: "Óptimo", forraje: "Alto"
  });

  async function cargarPotreros() {
    const { data, error } = await supabase.from("potreros").select("*");
    if (!error && data) setPotreros(data);
    setLoading(false);
  }

  useEffect(() => { cargarPotreros(); }, []);

  async function guardarPotrero() {
    if (!nuevo.nombre) {
      alert("El nombre es obligatorio");
      return;
    }
    setGuardando(true);
    const { error } = await supabase.from("potreros").insert([{
      ...nuevo,
      superficie: nuevo.superficie ? parseFloat(nuevo.superficie) : null,
      carga_actual: nuevo.carga_actual ? parseFloat(nuevo.carga_actual) : null,
      capacidad_max: nuevo.capacidad_max ? parseFloat(nuevo.capacidad_max) : null,
      animales: nuevo.animales ? parseInt(nuevo.animales) : null,
    }]);
    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      setMostrarFormulario(false);
      setNuevo({ nombre: "", superficie: "", carga_actual: "", capacidad_max: "", animales: "", estado: "Óptimo", forraje: "Alto" });
      cargarPotreros();
    }
    setGuardando(false);
  }

  const totalSuperficie = potreros.reduce((a, b) => a + (b.superficie || 0), 0);
  const totalAnimales = potreros.reduce((a, b) => a + (b.animales || 0), 0);
  const activos = potreros.filter(p => p.estado !== "Vacío").length;

  const estadoColor = (estado: string) => {
    if (estado === "Óptimo") return "bg-green-100 text-green-800";
    if (estado === "Moderado") return "bg-amber-100 text-amber-800";
    if (estado === "Bajo") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Potreros</h1>
        <p className="text-muted-foreground">Estado y carga animal — {potreros.length} potreros registrados</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Superficie total</p>
          <p className="text-3xl font-semibold mt-1">{totalSuperficie} ha</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Animales en campo</p>
          <p className="text-3xl font-semibold mt-1">{totalAnimales}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Potreros activos</p>
          <p className="text-3xl font-semibold mt-1 text-green-700">{activos}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setMostrarFormulario(!mostrarFormulario)} className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
          + Agregar potrero
        </button>
      </div>

      {mostrarFormulario && (
        <div className="border rounded-lg p-5 space-y-4 bg-muted/30">
          <h2 className="font-semibold text-base">Agregar nuevo potrero</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Nombre *</label>
              <input className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: Potrero Norte" value={nuevo.nombre} onChange={e => setNuevo({...nuevo, nombre: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Superficie (ha)</label>
              <input type="number" className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: 500" value={nuevo.superficie} onChange={e => setNuevo({...nuevo, superficie: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Animales actuales</label>
              <input type="number" className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: 200" value={nuevo.animales} onChange={e => setNuevo({...nuevo, animales: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Carga actual (UA/ha)</label>
              <input type="number" step="0.1" className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: 0.8" value={nuevo.carga_actual} onChange={e => setNuevo({...nuevo, carga_actual: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Capacidad máx. (UA/ha)</label>
              <input type="number" step="0.1" className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: 1.2" value={nuevo.capacidad_max} onChange={e => setNuevo({...nuevo, capacidad_max: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Estado</label>
              <select className="border rounded px-3 py-2 text-sm w-full" value={nuevo.estado} onChange={e => setNuevo({...nuevo, estado: e.target.value})}>
                <option value="Óptimo">Óptimo</option>
                <option value="Moderado">Moderado</option>
                <option value="Bajo">Bajo</option>
                <option value="Vacío">Vacío</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Disponibilidad forrajera</label>
              <select className="border rounded px-3 py-2 text-sm w-full" value={nuevo.forraje} onChange={e => setNuevo({...nuevo, forraje: e.target.value})}>
                <option value="Alto">Alto</option>
                <option value="Medio">Medio</option>
                <option value="Bajo">Bajo</option>
                <option value="Descanso">Descanso</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={guardarPotrero} disabled={guardando} className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
              {guardando ? "Guardando..." : "Guardar potrero"}
            </button>
            <button onClick={() => setMostrarFormulario(false)} className="border px-4 py-2 rounded-lg text-sm hover:bg-muted">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Cargando potreros...</p>
      ) : potreros.length === 0 ? (
        <div className="border rounded-lg p-8 text-center text-muted-foreground">
          <p className="text-lg font-medium">No hay potreros registrados</p>
          <p className="text-sm mt-1">Hacé clic en "Agregar potrero" para agregar el primero</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="text-left p-3">Nombre</th>
                <th className="text-left p-3">Superficie</th>
                <th className="text-left p-3">Animales</th>
                <th className="text-left p-3">Carga actual</th>
                <th className="text-left p-3">Cap. máx.</th>
                <th className="text-left p-3">Forraje</th>
                <th className="text-left p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {potreros.map((p) => (
                <tr key={p.id} className="border-t hover:bg-muted/50">
                  <td className="p-3 font-medium">{p.nombre}</td>
                  <td className="p-3">{p.superficie} ha</td>
                  <td className="p-3">{p.animales}</td>
                  <td className="p-3">{p.carga_actual} UA/ha</td>
                  <td className="p-3">{p.capacidad_max} UA/ha</td>
                  <td className="p-3">{p.forraje}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${estadoColor(p.estado)}`}>
                      {p.estado}
                    </span>
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