"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Animal = {
  id: string;
  caravana: string;
  categoria: string;
  raza: string;
  sexo: string;
  lote: string;
  peso: number;
  estado_sanitario: string;
  estado_reproductivo: string;
  fecha_nacimiento: string;
  observaciones: string;
};

const CATEGORIAS = ["Vaca", "Novillo", "Ternero", "Vaquillona", "Toro", "Recría"];
const RAZAS = ["Angus", "Hereford", "Braford", "Cruza", "Otra"];
const LOTES = ["Lote 1", "Lote 2", "Lote 3", "Lote 4", "Lote 5", "P. Norte", "P. Sur", "P. Este"];

export default function AnimalesPage() {
  const supabase = createClient();
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [nuevo, setNuevo] = useState({
    caravana: "", categoria: "", raza: "", sexo: "",
    lote: "", peso: "", estado_sanitario: "Sano",
    estado_reproductivo: "", fecha_nacimiento: "", observaciones: ""
  });

  async function cargarAnimales() {
    const { data, error } = await supabase.from("animales").select("*");
    if (!error && data) setAnimales(data);
    setLoading(false);
  }

  useEffect(() => { cargarAnimales(); }, []);

  async function guardarAnimal() {
    if (!nuevo.caravana || !nuevo.categoria) {
      alert("Caravana y categoría son obligatorios");
      return;
    }
    setGuardando(true);
    const { error } = await supabase.from("animales").insert([{
      ...nuevo,
      peso: nuevo.peso ? parseFloat(nuevo.peso) : null
    }]);
    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      setMostrarFormulario(false);
      setNuevo({ caravana: "", categoria: "", raza: "", sexo: "", lote: "", peso: "", estado_sanitario: "Sano", estado_reproductivo: "", fecha_nacimiento: "", observaciones: "" });
      cargarAnimales();
    }
    setGuardando(false);
  }

  const animalesFiltrados = animales.filter((a) => {
    const matchBusqueda = a.caravana?.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.lote?.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = categoriaFiltro === "" || a.categoria === categoriaFiltro;
    return matchBusqueda && matchCategoria;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Animales</h1>
        <p className="text-muted-foreground">Registro individual del rodeo — {animales.length} cabezas</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Buscar por caravana o lote..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-64"
        />
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 ml-auto"
        >
          + Nuevo animal
        </button>
      </div>

      {/* Formulario */}
      {mostrarFormulario && (
        <div className="border rounded-lg p-5 space-y-4 bg-muted/30">
          <h2 className="font-semibold text-base">Registrar nuevo animal</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Caravana *</label>
              <input className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: #0500" value={nuevo.caravana} onChange={e => setNuevo({...nuevo, caravana: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Categoría *</label>
              <select className="border rounded px-3 py-2 text-sm w-full" value={nuevo.categoria} onChange={e => setNuevo({...nuevo, categoria: e.target.value})}>
                <option value="">Seleccionar</option>
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Raza</label>
              <select className="border rounded px-3 py-2 text-sm w-full" value={nuevo.raza} onChange={e => setNuevo({...nuevo, raza: e.target.value})}>
                <option value="">Seleccionar</option>
                {RAZAS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Sexo</label>
              <select className="border rounded px-3 py-2 text-sm w-full" value={nuevo.sexo} onChange={e => setNuevo({...nuevo, sexo: e.target.value})}>
                <option value="">Seleccionar</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
                <option value="Macho castrado">Macho castrado</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Lote</label>
              <select className="border rounded px-3 py-2 text-sm w-full" value={nuevo.lote} onChange={e => setNuevo({...nuevo, lote: e.target.value})}>
                <option value="">Seleccionar</option>
                {LOTES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Peso (kg)</label>
              <input type="number" className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: 350" value={nuevo.peso} onChange={e => setNuevo({...nuevo, peso: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Fecha de nacimiento</label>
              <input type="date" className="border rounded px-3 py-2 text-sm w-full" value={nuevo.fecha_nacimiento} onChange={e => setNuevo({...nuevo, fecha_nacimiento: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Estado sanitario</label>
              <select className="border rounded px-3 py-2 text-sm w-full" value={nuevo.estado_sanitario} onChange={e => setNuevo({...nuevo, estado_sanitario: e.target.value})}>
                <option value="Sano">Sano</option>
                <option value="En tratamiento">En tratamiento</option>
                <option value="En alerta">En alerta</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Estado reproductivo</label>
              <input className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: Preñada 4to mes" value={nuevo.estado_reproductivo} onChange={e => setNuevo({...nuevo, estado_reproductivo: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Observaciones</label>
            <textarea className="border rounded px-3 py-2 text-sm w-full" rows={2} placeholder="Observaciones adicionales..." value={nuevo.observaciones} onChange={e => setNuevo({...nuevo, observaciones: e.target.value})} />
          </div>
          <div className="flex gap-3">
            <button onClick={guardarAnimal} disabled={guardando} className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
              {guardando ? "Guardando..." : "Guardar animal"}
            </button>
            <button onClick={() => setMostrarFormulario(false)} className="border px-4 py-2 rounded-lg text-sm hover:bg-muted">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Tabla */}
      {loading ? (
        <p className="text-muted-foreground">Cargando animales...</p>
      ) : animalesFiltrados.length === 0 ? (
        <div className="border rounded-lg p-8 text-center text-muted-foreground">
          <p className="text-lg font-medium">No hay animales registrados</p>
          <p className="text-sm mt-1">Hacé clic en "Nuevo animal" para agregar el primero</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="text-left p-3">Caravana</th>
                <th className="text-left p-3">Categoría</th>
                <th className="text-left p-3">Raza</th>
                <th className="text-left p-3">Sexo</th>
                <th className="text-left p-3">Lote</th>
                <th className="text-left p-3">Peso</th>
                <th className="text-left p-3">Estado sanitario</th>
              </tr>
            </thead>
            <tbody>
              {animalesFiltrados.map((a) => (
                <tr key={a.id} className="border-t hover:bg-muted/50">
                  <td className="p-3 font-medium">{a.caravana}</td>
                  <td className="p-3">{a.categoria}</td>
                  <td className="p-3">{a.raza}</td>
                  <td className="p-3">{a.sexo}</td>
                  <td className="p-3">{a.lote}</td>
                  <td className="p-3">{a.peso} kg</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      a.estado_sanitario === "Sano"
                        ? "bg-green-100 text-green-800"
                        : a.estado_sanitario === "En alerta"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {a.estado_sanitario}
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