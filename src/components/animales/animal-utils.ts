/** Normalización para deduplicar caravanas digitadas vs. ejemplo. */
export function normalizeCaravana(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, "");
}

/** Aproximación simple de edad (solo UI demo). */
export function resumenEdad(isoBirth: string): string {
  const parts = isoBirth.split("-").map(Number);
  const y = parts[0];
  const mo = parts[1];
  const d = parts[2];
  if (!y || !mo || !d) return "—";
  const birth = new Date(y, mo - 1, d);
  const now = new Date();
  let ageMonths =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) ageMonths -= 1;
  ageMonths = Math.max(ageMonths, 0);
  if (ageMonths < 18) {
    return `${ageMonths} meses`;
  }
  const years = Math.floor(ageMonths / 12);
  const rem = ageMonths % 12;
  if (rem >= 10) return `${years} años ${rem} m`;
  if (years === 0) return `${rem} meses`;
  return `${years} años`;
}
