import { NextResponse } from "next/server";
import { getStore, hoy } from "@/lib/db";
import { investigarConWeb, parsearJson, MODELO } from "@/lib/claude";
import { normalizeName } from "@/lib/normalize";
import type { NewCompany } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

type Filial = { pais: string; entidad: string; gancho: string; empleados_estimados?: string; senal?: string };
type Expansion = { paises_operacion: string[]; filiales: Filial[] };

const SYSTEM = `Eres un investigador de prospección B2B para UBITS, plataforma de L&D corporativo
con operación en varios países de Latinoamérica.

El usuario ya tiene a esta empresa como CLIENTE ACTIVO en Chile. Tu tarea es encontrar por
dónde expandir la cuenta hacia otros países ("cuenta árbol").

Reglas:
- Usa la herramienta de búsqueda web para verificar países de operación y filiales reales.
  No inventes filiales ni entidades que no existan.
- Prioriza países donde UBITS opera o puede vender: Colombia, México, Perú, Ecuador, Brasil,
  Argentina, Centroamérica y EE.UU. hispano.
- Si la empresa solo opera en Chile, devuelve "filiales": [].
- Los tamaños de dotación son estimaciones.
- Responde SOLO con un objeto JSON. Sin markdown, sin fences, sin preámbulo.`;

export async function POST(req: Request) {
  try {
    const { empresa, sector = null } = (await req.json()) as { empresa?: string; sector?: string | null };
    if (!empresa?.trim()) return NextResponse.json({ error: "Falta 'empresa'." }, { status: 400 });

    const cliente = empresa.trim();
    const store = getStore();
    const companies = await store.listCompanies();

    const prompt = `EMPRESA CLIENTE EN CHILE: ${cliente}${sector ? ` (sector: ${sector})` : ""}

Investiga:
1. En qué países opera hoy el grupo (filiales, plantas, oficinas, marcas propias).
2. Qué filial(es) fuera de Chile son el mejor objetivo para expandir una suscripción de
   formación corporativa, y con qué gancho concreto.

Formato de salida — objeto JSON con exactamente estas claves:
{"paises_operacion":["",""],"filiales":[{"pais":"","entidad":"","empleados_estimados":"","gancho":"","senal":""}]}

- "paises_operacion": países donde el grupo tiene operación real.
- "filiales": máximo 5, solo fuera de Chile. "entidad" es el nombre con que opera allá.
- "gancho": 1 frase de por qué esa filial es buen objetivo de L&D y cómo apalancar la
  relación existente en Chile.
- "senal": hecho reciente verificable de esa filial, o "".

Responde SOLO el objeto JSON.`;

    const texto = await investigarConWeb({ system: SYSTEM, prompt, maxUses: 12 });
    const data = parsearJson<Expansion>(texto);
    const paises = Array.isArray(data?.paises_operacion) ? data.paises_operacion : [];
    const filiales = Array.isArray(data?.filiales) ? data.filiales : [];

    // Deduplica por "cliente + filial", que es la unidad real de esta pestaña.
    const vistos = new Set(
      companies
        .filter((c) => c.frente === "arbol")
        .map((c) => `${normalizeName(c.cliente_origen ?? "")}|${normalizeName(c.filial_objetivo ?? c.empresa)}`),
    );

    const nuevas: NewCompany[] = [];
    for (const f of filiales) {
      const entidad = (f?.entidad || "").trim();
      const pais = (f?.pais || "").trim();
      if (!entidad || !pais) continue;
      const clave = `${normalizeName(cliente)}|${normalizeName(entidad)}`;
      if (vistos.has(clave)) continue;
      vistos.add(clave);

      nuevas.push({
        frente: "arbol",
        empresa: `${cliente} — ${pais}`,
        sector: sector || null,
        tamano_estimado: f.empleados_estimados?.trim() || null,
        ciudad: pais,
        gancho: f.gancho?.trim() || null,
        senal: f.senal?.trim() || null,
        estado: "Nuevo",
        fecha_entregada: hoy(),
        cliente_origen: cliente,
        paises_operacion: paises,
        filial_objetivo: entidad,
        gancho_expansion: f.gancho?.trim() || null,
      });
    }

    const insertadas = await store.insertCompanies(nuevas);
    return NextResponse.json({
      insertadas,
      paises_operacion: paises,
      encontradas: filiales.length,
      modelo: MODELO,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
