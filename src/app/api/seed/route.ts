import { NextResponse } from "next/server";
import { getStore, hoy } from "@/lib/db";
import { dedupeByName } from "@/lib/normalize";
import { SEED_CRM_ACCOUNTS, SEED_NET_NEW } from "@/lib/seed-data";
import type { NewCompany } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Carga (idempotente) las 20 empresas semilla y los negocios del CRM. */
export async function POST() {
  try {
    const store = getStore();
    const [companies, crm] = await Promise.all([store.listCompanies(), store.listCrmAccounts()]);

    const nuevasEmpresas: NewCompany[] = dedupeByName(
      SEED_NET_NEW.map((s) => ({
        ...s,
        frente: "net_new" as const,
        estado: "Nuevo" as const,
        fecha_entregada: hoy(),
      })),
      companies.map((c) => c.empresa),
    );

    const nuevasCrm = dedupeByName(SEED_CRM_ACCOUNTS, crm.map((c) => c.empresa));

    const [empresas, cuentas] = await Promise.all([
      store.insertCompanies(nuevasEmpresas),
      store.insertCrmAccounts(nuevasCrm),
    ]);

    return NextResponse.json({ empresas: empresas.length, crm_accounts: cuentas.length, store: store.kind });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
