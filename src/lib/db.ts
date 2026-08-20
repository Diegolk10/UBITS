import { promises as fs } from "node:fs";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Company, CrmAccount, NewCompany, NewCrmAccount } from "./types";

/**
 * Capa de datos. Si hay credenciales de Supabase se usa Postgres (persistente y
 * compartible). Si no, cae a un archivo JSON local para poder probar la app sin
 * cuentas externas — eso NO persiste en un deploy serverless.
 */
export type Store = {
  kind: "supabase" | "file";
  listCompanies(): Promise<Company[]>;
  insertCompanies(rows: NewCompany[]): Promise<Company[]>;
  updateCompany(id: string, patch: Partial<Company>): Promise<Company>;
  deleteCompany(id: string): Promise<void>;
  listCrmAccounts(): Promise<CrmAccount[]>;
  insertCrmAccounts(rows: NewCrmAccount[]): Promise<CrmAccount[]>;
  deleteCrmAccount(id: string): Promise<void>;
};

const COMPANY_DEFAULTS = {
  frente: "net_new" as const,
  sector: null,
  tamano_estimado: null,
  ciudad: null,
  gancho: null,
  senal: null,
  estado: "Nuevo" as const,
  fecha_entregada: null,
  contacto: null,
  cargo: null,
  email: null,
  telefono: null,
  notas: null,
  proximo_paso: null,
  cliente_origen: null,
  paises_operacion: null,
  filial_objetivo: null,
  sponsor_interno: null,
  gancho_expansion: null,
  contacto_filial: null,
};

export function hoy(): string {
  // Fecha local de Chile, en formato YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago" }).format(new Date());
}

/* ------------------------------- Supabase -------------------------------- */

let cachedClient: SupabaseClient | null = null;

function supabase(): SupabaseClient {
  if (!cachedClient) {
    cachedClient = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false },
    });
  }
  return cachedClient;
}

function supabaseStore(): Store {
  const check = <T>(res: { data: T | null; error: { message: string } | null }): T => {
    if (res.error) throw new Error(`Supabase: ${res.error.message}`);
    return res.data as T;
  };

  return {
    kind: "supabase",
    async listCompanies() {
      return check(await supabase().from("companies").select("*").order("created_at", { ascending: false }));
    },
    async insertCompanies(rows) {
      if (rows.length === 0) return [];
      const payload = rows.map((r) => ({ ...COMPANY_DEFAULTS, ...r }));
      return check(await supabase().from("companies").insert(payload).select());
    },
    async updateCompany(id, patch) {
      const data = check(
        await supabase()
          .from("companies")
          .update({ ...patch, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select()
          .single(),
      );
      return data as unknown as Company;
    },
    async deleteCompany(id) {
      check(await supabase().from("companies").delete().eq("id", id));
    },
    async listCrmAccounts() {
      return check(await supabase().from("crm_accounts").select("*").order("empresa"));
    },
    async insertCrmAccounts(rows) {
      if (rows.length === 0) return [];
      return check(await supabase().from("crm_accounts").insert(rows).select());
    },
    async deleteCrmAccount(id) {
      check(await supabase().from("crm_accounts").delete().eq("id", id));
    },
  };
}

/* ------------------------------ File store ------------------------------- */

type FileDb = { companies: Company[]; crm_accounts: CrmAccount[] };

const FILE_PATH = path.join(process.cwd(), ".data", "db.json");
let cola: Promise<unknown> = Promise.resolve();

/** Serializa los accesos al archivo para no perder escrituras concurrentes. */
function enCola<T>(fn: () => Promise<T>): Promise<T> {
  const next = cola.then(fn, fn);
  cola = next.catch(() => undefined);
  return next;
}

async function leer(): Promise<FileDb> {
  try {
    return JSON.parse(await fs.readFile(FILE_PATH, "utf8")) as FileDb;
  } catch {
    return { companies: [], crm_accounts: [] };
  }
}

async function escribir(db: FileDb): Promise<void> {
  await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
  await fs.writeFile(FILE_PATH, JSON.stringify(db, null, 2), "utf8");
}

function fileStore(): Store {
  return {
    kind: "file",
    listCompanies: () =>
      enCola(async () => {
        const db = await leer();
        return [...db.companies].sort((a, b) => b.created_at.localeCompare(a.created_at));
      }),
    insertCompanies: (rows) =>
      enCola(async () => {
        const db = await leer();
        const ahora = new Date().toISOString();
        const nuevas: Company[] = rows.map((r) => ({
          ...COMPANY_DEFAULTS,
          ...r,
          id: crypto.randomUUID(),
          created_at: ahora,
          updated_at: ahora,
        })) as Company[];
        db.companies.push(...nuevas);
        await escribir(db);
        return nuevas;
      }),
    updateCompany: (id, patch) =>
      enCola(async () => {
        const db = await leer();
        const i = db.companies.findIndex((c) => c.id === id);
        if (i === -1) throw new Error("Empresa no encontrada");
        db.companies[i] = { ...db.companies[i], ...patch, updated_at: new Date().toISOString() };
        await escribir(db);
        return db.companies[i];
      }),
    deleteCompany: (id) =>
      enCola(async () => {
        const db = await leer();
        db.companies = db.companies.filter((c) => c.id !== id);
        await escribir(db);
      }),
    listCrmAccounts: () =>
      enCola(async () => {
        const db = await leer();
        return [...db.crm_accounts].sort((a, b) => a.empresa.localeCompare(b.empresa));
      }),
    insertCrmAccounts: (rows) =>
      enCola(async () => {
        const db = await leer();
        const nuevas: CrmAccount[] = rows.map((r) => ({
          id: crypto.randomUUID(),
          empresa: r.empresa,
          estado_crm: r.estado_crm,
          hubspot_url: r.hubspot_url ?? null,
          sector: r.sector ?? null,
          created_at: new Date().toISOString(),
        }));
        db.crm_accounts.push(...nuevas);
        await escribir(db);
        return nuevas;
      }),
    deleteCrmAccount: (id) =>
      enCola(async () => {
        const db = await leer();
        db.crm_accounts = db.crm_accounts.filter((c) => c.id !== id);
        await escribir(db);
      }),
  };
}

/* --------------------------------- API ----------------------------------- */

export function haySupabase(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

let store: Store | null = null;

export function getStore(): Store {
  if (!store) store = haySupabase() ? supabaseStore() : fileStore();
  return store;
}
