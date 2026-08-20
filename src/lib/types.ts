export const ESTADOS = [
  "Nuevo",
  "Investigando",
  "Contactado",
  "Reunión agendada",
  "Propuesta enviada",
  "Ganado",
  "Descartado",
] as const;

export type Estado = (typeof ESTADOS)[number];

export type Frente = "net_new" | "arbol";

export type Company = {
  id: string;
  frente: Frente;
  empresa: string;
  sector: string | null;
  tamano_estimado: string | null;
  ciudad: string | null;
  gancho: string | null;
  senal: string | null;
  estado: Estado;
  fecha_entregada: string | null; // YYYY-MM-DD
  contacto: string | null;
  cargo: string | null;
  email: string | null;
  telefono: string | null;
  notas: string | null;
  proximo_paso: string | null;
  // Solo cuentas árbol
  cliente_origen: string | null;
  paises_operacion: string[] | null;
  filial_objetivo: string | null;
  sponsor_interno: string | null;
  gancho_expansion: string | null;
  contacto_filial: string | null;
  created_at: string;
  updated_at: string;
};

export type NewCompany = Partial<Omit<Company, "id" | "created_at" | "updated_at">> & {
  empresa: string;
};

/** Etapas del CRM (HubSpot) de negocios ya trabajados por el AE. */
export const ETAPAS_CRM = ["SQL", "Opportunity", "Upside", "In", "Lost"] as const;
export type EtapaCrm = (typeof ETAPAS_CRM)[number];

export type CrmAccount = {
  id: string;
  empresa: string;
  /** Puede traer más de una etapa, ej. "SQL / Lost". */
  estado_crm: string;
  hubspot_url: string | null;
  sector: string | null;
  created_at: string;
};

export type NewCrmAccount = { empresa: string; estado_crm: string; hubspot_url?: string | null; sector?: string | null };

/** Campos de `companies` que el usuario puede editar inline. */
export const CAMPOS_EDITABLES = [
  "estado",
  "contacto",
  "cargo",
  "email",
  "telefono",
  "notas",
  "proximo_paso",
  "sponsor_interno",
  "contacto_filial",
] as const;
export type CampoEditable = (typeof CAMPOS_EDITABLES)[number];

export const COLORES_ESTADO: Record<Estado, string> = {
  Nuevo: "bg-slate-100 text-slate-700 ring-slate-300",
  Investigando: "bg-amber-100 text-amber-800 ring-amber-300",
  Contactado: "bg-sky-100 text-sky-800 ring-sky-300",
  "Reunión agendada": "bg-indigo-100 text-indigo-800 ring-indigo-300",
  "Propuesta enviada": "bg-fuchsia-100 text-fuchsia-800 ring-fuchsia-300",
  Ganado: "bg-emerald-100 text-emerald-800 ring-emerald-300",
  Descartado: "bg-rose-100 text-rose-700 ring-rose-300",
};
