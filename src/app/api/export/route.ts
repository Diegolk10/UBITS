import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { getStore } from "@/lib/db";
import type { Company } from "@/lib/types";

export const dynamic = "force-dynamic";

const COLUMNAS: { key: keyof Company; label: string }[] = [
  { key: "frente", label: "Frente" },
  { key: "empresa", label: "Empresa" },
  { key: "estado", label: "Estado" },
  { key: "sector", label: "Sector" },
  { key: "tamano_estimado", label: "Tamaño estimado" },
  { key: "ciudad", label: "Ciudad" },
  { key: "cliente_origen", label: "Cliente origen" },
  { key: "filial_objetivo", label: "Filial objetivo" },
  { key: "paises_operacion", label: "Países operación" },
  { key: "sponsor_interno", label: "Sponsor interno" },
  { key: "contacto", label: "Contacto" },
  { key: "cargo", label: "Cargo" },
  { key: "email", label: "Email" },
  { key: "telefono", label: "Teléfono" },
  { key: "contacto_filial", label: "Contacto filial" },
  { key: "gancho", label: "Gancho" },
  { key: "gancho_expansion", label: "Gancho expansión" },
  { key: "senal", label: "Señal" },
  { key: "proximo_paso", label: "Próximo paso" },
  { key: "notas", label: "Notas" },
  { key: "fecha_entregada", label: "Fecha entregada" },
  { key: "updated_at", label: "Última actualización" },
];

function valor(c: Company, key: keyof Company): string {
  const v = c[key];
  if (v == null) return "";
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const frente = url.searchParams.get("frente");
    const formato = (url.searchParams.get("formato") || "csv").toLowerCase();

    let companies = await getStore().listCompanies();
    if (frente === "net_new" || frente === "arbol") companies = companies.filter((c) => c.frente === frente);

    const nombre = `ubits-prospeccion-${frente ?? "todo"}-${new Date().toISOString().slice(0, 10)}`;
    const filas = companies.map((c) => Object.fromEntries(COLUMNAS.map((col) => [col.label, valor(c, col.key)])));

    if (formato === "xlsx") {
      const hoja = XLSX.utils.json_to_sheet(filas, { header: COLUMNAS.map((c) => c.label) });
      const libro = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(libro, hoja, "Prospección");
      const buffer: Buffer = XLSX.write(libro, { type: "buffer", bookType: "xlsx" });
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${nombre}.xlsx"`,
        },
      });
    }

    const escapa = (s: string) => `"${s.replace(/"/g, '""')}"`;
    const csv = [
      COLUMNAS.map((c) => escapa(c.label)).join(","),
      ...companies.map((c) => COLUMNAS.map((col) => escapa(valor(c, col.key))).join(",")),
    ].join("\r\n");

    // BOM para que Excel abra los acentos bien.
    return new NextResponse("﻿" + csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${nombre}.csv"`,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
