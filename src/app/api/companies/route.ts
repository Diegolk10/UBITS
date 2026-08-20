import { NextResponse } from "next/server";
import { getStore, haySupabase, hoy } from "@/lib/db";
import { dedupeByName } from "@/lib/normalize";
import type { NewCompany } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = getStore();
    const companies = await store.listCompanies();
    return NextResponse.json({ companies, store: store.kind, supabase: haySupabase() });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

/** Alta manual de una o varias empresas. */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { rows?: NewCompany[]; row?: NewCompany };
    const entrantes = body.rows ?? (body.row ? [body.row] : []);
    if (entrantes.length === 0) {
      return NextResponse.json({ error: "Nada que insertar." }, { status: 400 });
    }

    const store = getStore();
    const existentes = (await store.listCompanies()).map((c) => c.empresa);
    const limpias = dedupeByName(
      entrantes.filter((r) => r.empresa?.trim()),
      existentes,
    ).map((r) => ({ ...r, estado: r.estado ?? "Nuevo", fecha_entregada: r.fecha_entregada ?? hoy() }));

    const insertadas = await store.insertCompanies(limpias);
    return NextResponse.json({ insertadas, duplicadas: entrantes.length - insertadas.length });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
