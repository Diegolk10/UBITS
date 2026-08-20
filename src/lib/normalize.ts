/**
 * Normaliza el nombre de una empresa para deduplicar:
 * minúsculas, sin tildes, sin sufijos societarios ni "chile", sin puntuación.
 */
const SUFIJOS = [
  "s\\.?a\\.?s?",
  "sa",
  "spa",
  "s\\.?p\\.?a",
  "ltda",
  "limitada",
  "ltd",
  "llc",
  "inc",
  "corp",
  "cia",
  "compania",
  "holding",
  "group",
  "grupo",
  "chile",
  "chilena",
  "ch",
  "de chile",
];

export function normalizeName(raw: string): string {
  let s = (raw ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " y ")
    .replace(/[^a-z0-9\s.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Quita sufijos repetidamente: "Grupo Saesa Chile SpA" -> "saesa"
  let previo = "";
  const re = new RegExp(`(^|\\s)(${SUFIJOS.join("|")})\\.?$`);
  while (s !== previo) {
    previo = s;
    s = s.replace(re, "").trim();
  }
  // "grupo saesa" -> también intenta sin prefijo genérico
  s = s.replace(/^(grupo|empresas|holding|comercial|inversiones)\s+/, "").trim();

  return s.replace(/\./g, "").replace(/\s+/g, " ").trim();
}

export function dedupeByName<T extends { empresa: string }>(rows: T[], existentes: string[] = []): T[] {
  const vistos = new Set(existentes.map(normalizeName).filter(Boolean));
  const out: T[] = [];
  for (const r of rows) {
    const k = normalizeName(r.empresa);
    if (!k || vistos.has(k)) continue;
    vistos.add(k);
    out.push(r);
  }
  return out;
}
