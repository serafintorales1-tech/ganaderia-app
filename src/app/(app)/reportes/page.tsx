export default function ReportesPage() {
  const reportes = [
    { id: 1, nombre: "Resumen mensual del rodeo", categoria: "Productivo", fecha: "01/05/2026", estado: "Disponible" },
    { id: 2, nombre: "Índice de preñez campaña 2025/2026", categoria: "Reproductivo", fecha: "30/04/2026", estado: "Disponible" },
    { id: 3, nombre: "Mortalidad acumulada anual", categoria: "Sanitario", fecha: "30/04/2026", estado: "Disponible" },
    { id: 4, nombre: "Ganancia diaria de peso por lote", categoria: "Productivo", fecha: "09/05/2026", estado: "Disponible" },
    { id: 5, nombre: "Stock de insumos críticos", categoria: "Insumos", fecha: "09/05/2026", estado: "Disponible" },
    { id: 6, nombre: "Movimientos de animales mayo 2026", categoria: "Productivo", fecha: "09/05/2026", estado: "Disponible" },
    { id: 7, nombre: "Vacunaciones realizadas 2026", categoria: "Sanitario", fecha: "01/05/2026", estado: "Disponible" },
    { id: 8, nombre: "Resumen económico del mes", categoria: "Económico", fecha: "01/05/2026", estado: "En proceso" },
  ];

  const categoriaColor = (cat: string) => {
    if (cat === "Productivo") return "bg-green-100 text-green-800";
    if (cat === "Reproductivo") return "bg-blue-100 text-blue-800";
    if (cat === "Sanitario") return "bg-purple-100 text-purple-800";
    if (cat === "Insumos") return "bg-amber-100 text-amber-800";
    if (cat === "Económico") return "bg-orange-100 text-orange-800";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reportes</h1>
        <p className="text-muted-foreground">Informes automáticos e indicadores del establecimiento</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total animales</p>
          <p className="text-3xl font-semibold mt-1">2.418</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Índice de preñez</p>
          <p className="text-3xl font-semibold mt-1 text-green-700">87%</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">GDP promedio</p>
          <p className="text-3xl font-semibold mt-1">0,82 kg/d</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Mortalidad acum.</p>
          <p className="text-3xl font-semibold mt-1">1,2%</p>
        </div>
      </div>

      {/* Botón */}
      <div className="flex justify-end">
        <button className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
          + Generar reporte
        </button>
      </div>

      {/* Lista de reportes */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="text-left p-3">Nombre del reporte</th>
              <th className="text-left p-3">Categoría</th>
              <th className="text-left p-3">Fecha</th>
              <th className="text-left p-3">Estado</th>
              <th className="text-left p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reportes.map((r) => (
              <tr key={r.id} className="border-t hover:bg-muted/50">
                <td className="p-3 font-medium">{r.nombre}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${categoriaColor(r.categoria)}`}>
                    {r.categoria}
                  </span>
                </td>
                <td className="p-3">{r.fecha}</td>
                <td className="p-3">
                  {r.estado === "Disponible" ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Disponible</span>
                  ) : (
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">En proceso</span>
                  )}
                </td>
                <td className="p-3">
                  <button className="text-green-800 hover:underline text-xs font-medium mr-3">
                    Ver
                  </button>
                  <button className="text-gray-500 hover:underline text-xs">
                    Exportar PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}