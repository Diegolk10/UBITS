import Anthropic from "@anthropic-ai/sdk";

/**
 * Todo el acceso a Anthropic vive acá y se ejecuta SOLO en el servidor.
 * La API key nunca sale del entorno del servidor.
 */

export const MODELO = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

let cliente: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "Falta ANTHROPIC_API_KEY en el entorno del servidor. Copia .env.example a .env.local y agrégala.",
    );
  }
  if (!cliente) cliente = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return cliente;
}

/** Server tool de web search (variante con filtrado dinámico, 2026-02-09). */
function herramientaWebSearch(maxUses: number) {
  return {
    type: "web_search_20260209" as const,
    name: "web_search" as const,
    max_uses: maxUses,
    user_location: {
      type: "approximate" as const,
      country: "CL",
      city: "Santiago",
      timezone: "America/Santiago",
    },
  };
}

/**
 * Ejecuta una consulta con web search y devuelve el texto final del modelo.
 * Reanuda automáticamente los turnos que terminan en `pause_turn`.
 */
export async function investigarConWeb(opts: {
  system: string;
  prompt: string;
  maxUses?: number;
  maxTokens?: number;
}): Promise<string> {
  const client = getAnthropic();
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: opts.prompt }];

  let ultimo: Anthropic.Message | null = null;

  for (let i = 0; i < 8; i++) {
    const respuesta = await client.messages.create({
      model: MODELO,
      max_tokens: opts.maxTokens ?? 16000,
      system: opts.system,
      thinking: { type: "adaptive" },
      tools: [herramientaWebSearch(opts.maxUses ?? 8)],
      messages,
    });

    ultimo = respuesta;
    if (respuesta.stop_reason !== "pause_turn") break;
    // Turno pausado por el servidor: se devuelve tal cual para continuar.
    messages.push({ role: "assistant", content: respuesta.content });
  }

  if (!ultimo) throw new Error("Sin respuesta del modelo.");

  const texto = ultimo.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  if (!texto) throw new Error("El modelo no devolvió texto (stop_reason: " + ultimo.stop_reason + ").");
  return texto;
}

/**
 * Parsea JSON aunque venga con fences ```json, preámbulo o texto de cierre.
 */
export function parsearJson<T>(texto: string): T {
  let s = texto.trim();

  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) s = fence[1].trim();

  try {
    return JSON.parse(s) as T;
  } catch {
    // Recorta al primer bloque JSON balanceado que aparezca.
    const inicio = s.search(/[[{]/);
    if (inicio === -1) throw new Error("La respuesta del modelo no contenía JSON:\n" + texto.slice(0, 400));
    const abre = s[inicio];
    const cierra = abre === "[" ? "]" : "}";
    const fin = s.lastIndexOf(cierra);
    if (fin <= inicio) throw new Error("JSON incompleto en la respuesta del modelo.");
    return JSON.parse(s.slice(inicio, fin + 1)) as T;
  }
}
