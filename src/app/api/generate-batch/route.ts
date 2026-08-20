import { NextResponse } from "next/server";
import { getStore, hoy } from "@/lib/db";
import { investigarConWeb, parsearJson, MODELO } from "@/lib/claude";
import { dedupeByName } from "@/lib/normalize";
import type { NewCompany } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

type Generada = {
  empresa: string;
  sector: string;
  tamano_estimado: string;
  ciudad: string;
  gancho: string;
  senal: string;
};

const SYSTEM = `Eres un investigador de prospección B2B en Chile para UBITS, una plataforma
de aprendizaje y desarrollo (L&D) corporativo B2B que vende suscripciones a empresas
medianas y grandes.

Reglas:
- Usa la herramienta de búsqueda web para verificar que cada empresa existe hoy, opera en
  Chile y sigue activa. No inventes empresas ni nombres de fantasía.
- Los tamaños de dotación son ESTIMACIONES: exprésalos como rango (ej. "2.000–3.000") y
  no los presentes como dato oficial.
- La "señal" debe ser un hecho reciente y verificable (últimos ~18 meses): inversión,
  expansión, contratación masiva, fusión, nueva planta, cambio regulatorio, resultados.
  Si no encuentras una señal real, devuelve string vacío. Nunca inventes noticias.
- Responde SOLO con un array JSON. Sin markdown, sin fences, sin preámbulo ni cierre.`;

const ICP = `PERFIL DE CLIENTE IDEAL (ICP)
- Empresas con operación en Chile, de ~200 a 5.000+ empleados.
- Con área de RR.HH. / Formación / Desarrollo Organizacional y presupuesto de capacitación
  (idealmente usan franquicia SENCE).
- Sectores objetivo: retail y consumo masivo, minería y sus proveedores, banca y seguros,
  industrial/manufactura, energía y utilities, logística y transporte, salud,
  telco y tecnología, agroindustria y salmón, construcción.
- Prioriza empresas con gran dotación operaria, alta rotación, red de sucursales o
  fuerza de venta amplia: ahí una plataforma de formación digital rinde más.`;

export async function POST(req: Request) {
  try {
    const { cantidad = 18, sector = null } = (await req.json().catch(() => ({}))) as {
      cantidad?: number;
      sector?: string | null;
    };
    const n = Math.min(Math.max(Number(cantidad) || 18, 1), 30);

    const store = getStore();
    const [companies, crmAccounts] = await Promise.all([store.listCompanies(), store.listCrmAccounts()]);

    const excluir = [...companies.map((c) => c.empresa), ...crmAccounts.map((c) => c.empresa)];

    const prompt = `${ICP}

FILTRO DE SECTOR: ${sector ? `entrega SOLO empresas del sector "${sector}".` : "sin filtro, diversifica sectores."}

NO INCLUYAS ninguna de estas empresas (ya están en el pipeline o ya fueron trabajadas),
ni sus filiales, holdings o razones sociales equivalentes:
${excluir.map((e) => `- ${e}`).join("\n") || "- (ninguna todavía)"}

Entrega exactamente ${n} empresas NUEVAS que cumplan el ICP, ordenadas de mayor a menor
atractivo comercial.

Formato de salida — array JSON de objetos con exactamente estas claves:
[{"empresa":"","sector":"","tamano_estimado":"","ciudad":"","gancho":"","senal":""}]

- "empresa": nombre comercial en Chile.
- "sector": categoría corta.
- "tamano_estimado": rango de empleados en Chile (estimación).
- "ciudad": ciudad o región de la casa matriz / operación principal.
- "gancho": 1 frase de por qué encaja con una plataforma de formación corporativa como UBITS.
- "senal": trigger reciente y verificable, o "" si no hay.

Responde SOLO el array JSON.`;

    const texto = await investigarConWeb({ system: SYSTEM, prompt, maxUses: 12 });
    const generadas = parsearJson<Generada[]>(texto);
    if (!Array.isArray(generadas)) throw new Error("El modelo no devolvió un array JSON.");

    const candidatas: NewCompany[] = generadas
      .filter((g) => g && typeof g.empresa === "string" && g.empresa.trim())
      .map((g) => ({
        frente: "net_new" as const,
        empresa: g.empresa.trim(),
        sector: g.sector?.trim() || null,
        tamano_estimado: g.tamano_estimado?.trim() || null,
        ciudad: g.ciudad?.trim() || null,
        gancho: g.gancho?.trim() || null,
        senal: g.senal?.trim() || null,
        estado: "Nuevo" as const,
        fecha_entregada: hoy(),
      }));

    const nuevas = dedupeByName(candidatas, excluir);
    const insertadas = await store.insertCompanies(nuevas);

    return NextResponse.json({
      insertadas,
      pedidas: n,
      devueltas: generadas.length,
      descartadas: generadas.length - insertadas.length,
      modelo: MODELO,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
