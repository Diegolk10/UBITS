import { NextResponse } from "next/server";
import { getStore, hoy } from "@/lib/db";
import { dedupeByName } from "@/lib/normalize";
import { ESTADOS, type Estado, type Frente, type NewCompany, type NewCrmAccount } from "@/lib/types";

export const dynamic = "force-dynamic";

type FilaCruda = Record<string, unknown>;

/** Acepta encabezados con acentos, mayúsculas o espacios. */
function norm(k: string): string {
  return k
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");
}

const ALIAS: Record<string, string> = {
  empresa: "empresa",
  nombre: "empresa",
  cuenta: "empresa",
  compania: "empresa",
  frente: "frente",
  estado: "estado",
  etapa: "estado",
  sector: "sector",
  industria: "sector",
  tamano: "tamano_estimado",
  tamano_estimado: "tamano_estimado",
  empleados: "tamano_estimado",
  ciudad: "ciudad",
  hq: "ciudad",
  gancho: "gancho",
  gancho_expansion: "gancho_expansion",
  senal: "senal",
  trigger: "senal",
  contacto: "contacto",
  cargo: "cargo",
  email: "email",
  correo: "email",
  telefono: "telefono",
  fono: "telefono",
  notas: "notas",
  proximo_paso: "proximo_paso",
  cliente_origen: "cliente_origen",
  filial_objetivo: "filial_objetivo",
  sponsor_interno: "sponsor_interno",
  contacto_filial: "contacto_filial",
  fecha_entregada: "fecha_entregada",
  estado_crm: "estado_crm",
  hubspot_url: "hubspot_url",
  enlace_en_hubspot: "hubspot_url",
};

function mapear(fila: FilaCruda): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(fila)) {
    const destino = ALIAS[norm(k)];
    if (!destino) continue;
    const valor = v == null ? "" : String(v).trim();
    if (valor) out[destino] = valor;
  }
  return out;
}

export async function POST(req: Request) {
  try {
    const { tipo = "companies", frente = "net_new", rows = [] } = (await req.json()) as {
      tipo?: "companies" | "crm";
      frente?: Frente;
      rows?: FilaCruda[];
    };
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: "El archivo no tenía filas." }, { status: 400 });
    }

    const store = getStore();
    const mapeadas = rows.map(mapear).filter((r) => r.empresa);
    if (mapeadas.length === 0) {
      return NextResponse.json(
        { error: "No se encontró una columna 'Empresa' (o 'Nombre') en el archivo." },
        { status: 400 },
      );
    }

    if (tipo === "crm") {
      const existentes = (await store.listCrmAccounts()).map((c) => c.empresa);
      const nuevas: NewCrmAccount[] = mapeadas.map((r) => ({
        empresa: r.empresa,
        estado_crm: r.estado_crm || r.estado || "In",
        hubspot_url: r.hubspot_url || null,
        sector: r.sector || null,
      }));
      const insertadas = await store.insertCrmAccounts(dedupeByName(nuevas, existentes));
      return NextResponse.json({ insertadas: insertadas.length, duplicadas: mapeadas.length - insertadas.length });
    }

    const existentes = (await store.listCompanies()).map((c) => c.empresa);
    const nuevas: NewCompany[] = mapeadas.map((r) => ({
      frente: (r.frente === "arbol" ? "arbol" : r.frente === "net_new" ? "net_new" : frente) as Frente,
      empresa: r.empresa,
      sector: r.sector || null,
      tamano_estimado: r.tamano_estimado || null,
      ciudad: r.ciudad || null,
      gancho: r.gancho || null,
      senal: r.senal || null,
      estado: (ESTADOS.includes(r.estado as Estado) ? r.estado : "Nuevo") as Estado,
      fecha_entregada: r.fecha_entregada || hoy(),
      contacto: r.contacto || null,
      cargo: r.cargo || null,
      email: r.email || null,
      telefono: r.telefono || null,
      notas: r.notas || null,
      proximo_paso: r.proximo_paso || null,
      cliente_origen: r.cliente_origen || null,
      filial_objetivo: r.filial_objetivo || null,
      sponsor_interno: r.sponsor_interno || null,
      gancho_expansion: r.gancho_expansion || null,
      contacto_filial: r.contacto_filial || null,
    }));

    const insertadas = await store.insertCompanies(dedupeByName(nuevas, existentes));
    return NextResponse.json({ insertadas: insertadas.length, duplicadas: mapeadas.length - insertadas.length });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
