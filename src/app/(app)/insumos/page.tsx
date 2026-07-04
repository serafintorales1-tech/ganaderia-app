"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Insumo = {
  id: string;
  nombre: string;
  categoria: string;
  stock: number;
  unidad: string;
  minimo: number;
  precio: number;
  proveedor: string;
  fecha_compra: string;
};

export default function InsumosPage() {
  const supabase = createClient();
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [nuevo, setNuevo] = useState({
    nombre: "", categoria: "", stock: "",
    unidad: "", minimo: "", precio: "",
    proveedor: "", fecha_compra: ""
  });

  async function cargarInsumos() {
    const { data, error } = await supabase.from("insumos").select("*");
    if (!error && data) setInsumos(data);
    setLoading(false);
  }

  useEffect(() => { cargarInsumos(); }, []);

  async function guardarInsumo() {
    if (!nuevo.nombre || !nuevo.categoria) {
      alert("Nombre y categoría son obligatorios");
      return;
    }
    setGuardando(true);
    const { error } = await supabase.from("insumos").insert([{
      ...nuevo,
      stock: nuevo.stock ? parseFloat(nuevo.stock) : null,
      minimo: nuevo.minimo ? parseFloat(nuevo.minimo) : null,
      precio: nuevo.precio ? parseFloat(nuevo.precio) : null,
    }]);
    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      setMostrarFormulario(false);
      setNuevo({ nombre: "", categoria: "", stock: "", unidad: "", minimo: "", precio: "", proveedor: "", fecha_compra: "" });
      cargarInsumos();
    }
    setGuardando(false);
  }

  const stockBajo = insumos.filter(i => i.stock < i.minimo).length;

  const estadoStock = (stock: number, minimo: number) => {
    if (stock < minimo) return { texto: "Stock bajo", clase: "bg-red-100 text-red-800" };
    if (stock < minimo * 1.5) return { texto: "Stock medio", clase: "bg-amber-100 text-amber-800" };
    return { texto: "Stock OK", clase: "bg-green-100 text-green-800" };
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Insumos</h1>
        <p className="text-muted-foreground">Control de stock — {insumos.length} productos registrados</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total productos</p>
          <p className="text-3xl font-semibold mt-1">{insumos.length}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Alertas stock bajo</p>
          <p className="text-3xl font-semibold mt-1 text-red-600">{stockBajo}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Categorías</p>
          <p className="text-3xl font-semibold mt-1">{[...new Set(insumos.map(i => i.categoria))].length}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setMostrarFormulario(!mostrarFormulario)} className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
          + Agregar insumo
        </button>
      </div>

      {mostrarFormulario && (
        <div className="border rounded-lg p-5 space-y-4 bg-muted/30">
          <h2 className="font-semibold text-base">Agregar nuevo insumo</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Nombre *</label>
              <input className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: Ivermectina 1%" value={nuevo.nombre} onChange={e => setNuevo({...nuevo, nombre: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Categoría *</label>
              <select className="border rounded px-3 py-2 text-sm w-full" value={nuevo.categoria} onChange={e => setNuevo({...nuevo, categoria: e.target.value})}>
                <option value="">Seleccionar</option>
                <option value="Medicamento">Medicamento</option>
                <option value="Vacuna">Vacuna</option>
                <option value="Alimentación">Alimentación</option>
                <option value="Combustible">Combustible</option>
                <option value="Herramienta">Herramienta</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Unidad</label>
              <input className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: litros, kg, dosis" value={nuevo.unidad} onChange={e => setNuevo({...nuevo, unidad: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Stock actual</label>
              <input type="number" className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: 20" value={nuevo.stock} onChange={e => setNuevo({...nuevo, stock: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Stock mínimo</label>
              <input type="number" className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: 10" value={nuevo.minimo} onChange={e => setNuevo({...nuevo, minimo: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Precio unitario</label>
              <input type="number" className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: 8500" value={nuevo.precio} onChange={e => setNuevo({...nuevo, precio: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Proveedor</label>
              <input className="border rounded px-3 py-2 text-sm w-full" placeholder="Ej: VetSur" value={nuevo.proveedor} onChange={e => setNuevo({...nuevo, proveedor: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Fecha de compra</label>
              <input type="date" className="border rounded px-3 py-2 text-sm w-full" value={nuevo.fecha_compra} onChange={e => setNuevo({...nuevo, fecha_compra: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={guardarInsumo} disabled={guardando} className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
              {guardando ? "Guardando..." : "Guardar insumo"}
            </button>
            <button onClick={() => setMostrarFormulario(false)} className="border px-4 py-2 rounded-lg text-sm hover:bg-muted">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Cargando insumos...</p>
      ) : insumos.length === 0 ? (
        <div className="border rounded-lg p-8 text-center text-muted-foreground">
          <p className="text-lg font-medium">No hay insumos registrados</p>
          <p className="text-sm mt-1">Hacé clic en "Agregar insumo" para agregar el primero</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="text-left p-3">Producto</th>
                <th className="text-left p-3">Categoría</th>
                <th className="text-left p-3">Stock</th>
                <th className="text-left p-3">Mínimo</th>
                <th className="text-left p-3">Precio</th>
                <th className="text-left p-3">Proveedor</th>
                <th className="text-left p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {insumos.map((i) => {
                const estado = estadoStock(i.stock, i.minimo);
                return (
                  <tr key={i.id} className="border-t hover:bg-muted/50">
                    <td className="p-3 font-medium">{i.nombre}</td>
                    <td className="p-3">{i.categoria}</td>
                    <td className="p-3">{i.stock} {i.unidad}</td>
                    <td className="p-3">{i.minimo} {i.unidad}</td>
                    <td className="p-3">${i.precio?.toLocaleString()}</td>
                    <td className="p-3">{i.proveedor}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${estado.clase}`}>
                        {estado.texto}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}