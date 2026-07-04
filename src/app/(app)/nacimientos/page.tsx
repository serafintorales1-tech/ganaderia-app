"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Nacimiento = {
  id: string;
  fecha: string;
  cria: string;
  sexo: string;
  madre: string;
  padre: string;
  peso: number;
  dificultad: string;
  estado: string;
  observaciones: string;
};

export default function NacimientosPage() {
  const supabase = createClient();
  const [nacimientos, setNacimientos] = useState<Nacimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [nuevo, setNuevo] = useState({
    fecha: "", cria: "", sexo: "", madre: "",
    padre: "", peso: "", dificultad: "Normal",
    estado: "Sano", observaciones: ""
  });

  async function cargarNacimientos() {
    const { data, error } = await supabase.from("nacimientos").select("*");
    if (!error && data) setNacimientos(data);
    setLoading(false);
  }

  useEffect(() => { cargarNacimientos(); }, []);

  async function guardarNacimiento() {
    if (!nuevo.cria || !nuevo.madre) {
      alert("Cría y madre son obligatorios");
      return;
    }
    setGuardando(true);
    const { error } = await supabase.from("nacimientos").insert([{
      ...nuevo,
      peso: nuevo.peso ? parseFloat(nuevo.peso) : null
    }]);
    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      setMostrarFormulario(false);
      setNuevo({ fecha: "", cria: "", sexo: "", madre: "", padre: "", peso: "", dificultad: "Normal", estado: "Sano", observaciones: "" });
      cargarNacimientos();
    }
    setGuardando(false);
  }

  const machos = nacimientos.filter(n => n.sexo === "Macho").length;
  const hembras = nacimientos.filter(n => n.sexo === "Hembra").length;
  const pesoPromedio = nacimientos.length > 0 ? Math.round(nacimientos.reduce((a, b) => a + (b.peso || 0), 0) / nacimientos.length) : 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nacimientos</h1>
        <p className="text-muted-foreground">Registro de partos y crías — {nacimientos.length} registros</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total nacimientos</p>
          <p className="text-3xl font-semibold mt-1">{nacimientos.length}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Machos</p>
          <p className="text-3xl font-semibold mt-1 text-blue-600">{machos}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Hembras</p>
          <p className="text-3xl font-semibold mt-1 text-pink-600">{hembras}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Peso promedio</p>
          <p className="text-3xl font-semibold mt-1">{pesoPromedio} kg</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setMostrarFormulario(!mostrarFormulario)} className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
          + Registrar nacimiento
        </button>
      </div>

      {mostrarFormulario && (
        <div className="border rounded-lg p-5 space-y-4 bg-muted/30">
          <h2 className="font-semibold text-base">Registrar nuevo nacimiento</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Caravana cría *</label>
              <input className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: #0501" value={nuevo.cria} onChange={e => setNuevo({...nuevo, cria: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Madre *</label>
              <input className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: #0221" value={nuevo.madre} onChange={e => setNuevo({...nuevo, madre: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Padre</label>
              <input className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: T-03" value={nuevo.padre} onChange={e => setNuevo({...nuevo, padre: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Sexo</label>
              <select className="border rounded px-3 py-2 text-sm w-full" value={nuevo.sexo} onChange={e => setNuevo({...nuevo, sexo: e.target.value})}>
                <option value="">Seleccionar</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Fecha</label>
              <input type="date" className="border rounded px-3 py-2 text-sm w-full" value={nuevo.fecha} onChange={e => setNuevo({...nuevo, fecha: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Peso al nacer (kg)</label>
              <input type="number" className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: 32" value={nuevo.peso} onChange={e => setNuevo({...nuevo, peso: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Dificultad del parto</label>
              <select className="border rounded px-3 py-2 text-sm w-full" value={nuevo.dificultad} onChange={e => setNuevo({...nuevo, dificultad: e.target.value})}>
                <option value="Normal">Normal</option>
                <option value="Distócico">Distócico</option>
                <option value="Gemelar">Gemelar</option>
                <option value="Cesárea">Cesárea</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Estado sanitario</label>
              <select className="border rounded px-3 py-2 text-sm w-full" value={nuevo.estado} onChange={e => setNuevo({...nuevo, estado: e.target.value})}>
                <option value="Sano">Sano</option>
                <option value="Bajo observación">Bajo observación</option>
                <option value="En tratamiento">En tratamiento</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Observaciones</label>
            <textarea className="border rounded px-3 py-2 text-sm w-full" rows={2} value={nuevo.observaciones} onChange={e => setNuevo({...nuevo, observaciones: e.target.value})} />
          </div>
          <div className="flex gap-3">
            <button onClick={guardarNacimiento} disabled={guardando} className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
              {guardando ? "Guardando..." : "Guardar nacimiento"}
            </button>
            <button onClick={() => setMostrarFormulario(false)} className="border px-4 py-2 rounded-lg text-sm hover:bg-muted">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Cargando nacimientos...</p>
      ) : nacimientos.length === 0 ? (
        <div className="border rounded-lg p-8 text-center text-muted-foreground">
          <p className="text-lg font-medium">No hay nacimientos registrados</p>
          <p className="text-sm mt-1">Hacé clic en "Registrar nacimiento" para agregar el primero</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="text-left p-3">Fecha</th>
                <th className="text-left p-3">Cría</th>
                <th className="text-left p-3">Sexo</th>
                <th className="text-left p-3">Madre</th>
                <th className="text-left p-3">Padre</th>
                <th className="text-left p-3">Peso</th>
                <th className="text-left p-3">Dificultad</th>
                <th className="text-left p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {nacimientos.map((n) => (
                <tr key={n.id} className="border-t hover:bg-muted/50">
                  <td className="p-3">{n.fecha}</td>
                  <td className="p-3 font-medium">{n.cria}</td>
                  <td className="p-3">{n.sexo}</td>
                  <td className="p-3">{n.madre}</td>
                  <td className="p-3">{n.padre}</td>
                  <td className="p-3">{n.peso} kg</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${n.dificultad === "Normal" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                      {n.dificultad}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${n.estado === "Sano" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                      {n.estado}
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