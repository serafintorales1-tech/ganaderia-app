const fechaFmt = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const num0 = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

const num2 = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatFechaEs(isoDate: string): string {
  try {
    const [y, m, d] = isoDate.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return fechaFmt.format(dt);
  } catch {
    return isoDate;
  }
}

export function formatKgEs(n: number): string {
  return `${num0.format(n)} kg`;
}

/** GDP / ganancia diaria expresado en kg/día */
export function formatGdpKgDia(n: number): string {
  return `${num2.format(n)} kg/día`;
}

export function formatFechaCortaEs(isoDate: string): string {
  try {
    const [y, m, d] = isoDate.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return isoDate;
  }
}
