import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";
import { dedupeByName } from "@/lib/normalize";
import type { NewCrmAccount } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ crmAccounts: await getStore().listCrmAccounts() });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { rows?: NewCrmAccount[]; row?: NewCrmAccount };
    const entrantes = (body.rows ?? (body.row ? [body.row] : [])).filter((r) => r.empresa?.trim());
    if (entrantes.length === 0) return NextResponse.json({ error: "Nada que insertar." }, { status: 400 });

    const store = getStore();
    const existentes = (await store.listCrmAccounts()).map((c) => c.empresa);
    const limpias = dedupeByName(entrantes, existentes).map((r) => ({
      ...r,
      estado_crm: r.estado_crm?.trim() || "In",
    }));

    const insertadas = await store.insertCrmAccounts(limpias);
    return NextResponse.json({ insertadas, duplicadas: entrantes.length - insertadas.length });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
