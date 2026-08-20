import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";
import { ESTADOS, type Company } from "@/lib/types";

export const dynamic = "force-dynamic";

const EDITABLES = new Set<keyof Company>([
  "estado",
  "contacto",
  "cargo",
  "email",
  "telefono",
  "notas",
  "proximo_paso",
  "sector",
  "tamano_estimado",
  "ciudad",
  "gancho",
  "senal",
  "empresa",
  "cliente_origen",
  "filial_objetivo",
  "sponsor_interno",
  "gancho_expansion",
  "contacto_filial",
]);

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = (await req.json()) as Record<string, unknown>;

    const patch: Partial<Company> = {};
    for (const [k, v] of Object.entries(body)) {
      if (!EDITABLES.has(k as keyof Company)) continue;
      if (k === "estado" && !ESTADOS.includes(v as Company["estado"])) {
        return NextResponse.json({ error: `Estado inválido: ${String(v)}` }, { status: 400 });
      }
      (patch as Record<string, unknown>)[k] = v === "" ? null : v;
    }
    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "Ningún campo editable en el body." }, { status: 400 });
    }

    const company = await getStore().updateCompany(id, patch);
    return NextResponse.json({ company });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await getStore().deleteCompany(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
