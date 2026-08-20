# UBITS · Prospección Chile

App web "viva" de prospección para un Account Executive de UBITS en Chile.
Reemplaza el tracker en Excel y maneja dos frentes:

1. **Net-new Chile** — empresas donde todavía no hay negocio.
2. **Cuentas árbol** — clientes actuales en Chile con filiales en otros países,
   para expandir por relación caliente.

Cada mañana aprietas **«Generar lote de hoy»** y Claude (con búsqueda web) devuelve
15–20 empresas reales que cumplen el ICP, excluyendo todo lo que ya está en la base
y todo lo que ya trabajaste en HubSpot. Después vas moviendo cada empresa por el
pipeline: `Nuevo → Investigando → Contactado → Reunión agendada → Propuesta enviada → Ganado / Descartado`.

---

## Stack

| Pieza | Qué se usa |
|---|---|
| Front + back | Next.js 16 (App Router) + React 19 + TypeScript |
| Estilos | Tailwind CSS v4 (paleta UBITS: navy `#12235F`, azul eléctrico, magenta `#E10098`) |
| Base de datos | Supabase (Postgres). Fallback local en `.data/db.json` si no configuras Supabase |
| IA | Anthropic API (`@anthropic-ai/sdk`) con la server tool `web_search_20260209` |
| Import/Export | CSV y XLSX (SheetJS) |
| Deploy | Vercel |

**Seguridad:** todas las llamadas a Anthropic salen desde API routes en el servidor.
`ANTHROPIC_API_KEY` vive solo en variables de entorno del servidor y **nunca** se expone
al navegador (ninguna variable sensible lleva el prefijo `NEXT_PUBLIC_`).

---

## Puesta en marcha (5 minutos)

### 1. Requisitos

- Node.js 20 o superior
- Una API key de Anthropic (https://console.anthropic.com)
- Una cuenta gratis de Supabase (https://supabase.com) — opcional para probar, necesaria para compartir

### 2. Instalar

```bash
npm install
cp .env.example .env.local     # y completa las variables
npm run dev                    # http://localhost:3000
```

La primera vez que abres la app se cargan solas las **20 empresas semilla** y los
**135 negocios del CRM** (los "In" alimentan el frente de cuentas árbol).

Si dejas las variables de Supabase vacías, la app guarda en `.data/db.json`: sirve para
probar sin cuentas externas, pero **no** persiste en un deploy serverless ni se comparte.
La app te avisa en pantalla cuando está en ese modo.

### 3. Crear el proyecto en Supabase

1. Entra a https://supabase.com → **New project** (elige región `South America (São Paulo)`).
2. Menú lateral → **SQL Editor** → **New query** → pega el contenido de
   [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
3. (Opcional) Repite con [`supabase/seed.sql`](supabase/seed.sql) para cargar los datos
   semilla desde SQL. Si prefieres, la app los carga sola la primera vez, o puedes llamar
   `POST /api/seed` — es idempotente.
4. Menú lateral → **Project Settings → API** y copia:
   - **Project URL** → `SUPABASE_URL`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

> La tabla queda con RLS activo y sin políticas: solo el backend, que usa la
> `service_role key`, puede leer y escribir. Esa key nunca sale del servidor.

### 4. Variables de entorno

```bash
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-5          # o claude-opus-5 si quieres más profundidad
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

El modelo debe soportar la server tool de web search con filtrado dinámico
(`claude-sonnet-5`, `claude-opus-5`, `claude-opus-4-8`, `claude-sonnet-4-6`).

### 5. Deploy en Vercel

```bash
npm i -g vercel
vercel                      # primer deploy (preview)
vercel --prod               # producción
```

O desde la web: **Add New → Project → Import Git Repository**, elige este repo y en
**Environment Variables** pega las cuatro variables de arriba (marcadas para
Production, Preview y Development). Vercel detecta Next.js solo — no hay que configurar
build command ni output directory.

Las rutas que llaman a Claude declaran `maxDuration = 300`, pero el tope efectivo lo
pone tu plan de Vercel. Si un lote grande se corta por timeout, baja la cantidad a 10–12
o revisa el límite de duración de funciones de tu plan.

---

## Cómo se usa

### Net-new Chile
- **Generar lote de hoy** (arriba a la derecha, siempre visible): elige cantidad
  (default 18) y opcionalmente un sector. Claude busca en la web, valida que las
  empresas existan y devuelve empresa, sector, tamaño estimado, ciudad, gancho de L&D
  y señal reciente. Se insertan como `Nuevo` con la fecha de hoy.
- Las columnas **contacto / cargo / email / teléfono / próximo paso / notas** están
  resaltadas en rosado cuando están vacías: son las que investigas tú. Se editan
  inline y se guardan solas al salir del campo.
- El **estado** es un dropdown con chips de color. Filtra por sector, tamaño y estado,
  busca por nombre y ordena haciendo clic en cualquier encabezado.
- Si una empresa ya está en tu HubSpot, aparece un badge ámbar **CRM: Lost / SQL / In**
  al lado del nombre, para que no la trabajes a ciegas.

### Cuentas árbol
- El panel superior lista tus clientes ganados (etapa **In** del CRM). Puedes agregar
  clientes a mano o importarlos desde CSV/XLSX.
- **Buscar expansión** en un cliente → Claude investiga en qué países opera el grupo y
  propone hasta 5 filiales objetivo con su gancho de expansión. Cada filial entra como
  fila `arbol` con `cliente_origen`, `filial_objetivo` y `paises_operacion`.
- Ahí completas **sponsor interno** (quién te puede presentar desde Chile) y el
  **contacto de la filial**.

### Dashboard
KPIs (total, nuevos, contactados, reuniones, propuestas, ganados), pipeline por estado,
desglose por frente y top de sectores.

### Importar / Exportar
- **Importar CSV/XLSX**: acepta encabezados en español con o sin acentos
  (`Empresa`, `Nombre`, `Sector`, `Estado`, `Email`, `Teléfono`, `Próximo paso`, …).
  Solo `Empresa` es obligatoria. Sirve para migrar tu tracker actual.
- **Exportar CSV / XLSX**: exporta el frente que estés viendo, listo para mandar a la
  jefatura. El CSV lleva BOM para que Excel respete los acentos.

Todo lo que importas o generas pasa por la **deduplicación por nombre normalizado**
(minúsculas, sin tildes, sin `S.A.` / `Ltda` / `SpA` / `Chile`), así que "WOM",
"WOM Chile" y "WOM S.A." cuentan como la misma empresa.

---

## API interna

| Método y ruta | Qué hace |
|---|---|
| `GET /api/companies` | Lista el pipeline completo |
| `POST /api/companies` | Alta manual (`{row}` o `{rows}`), deduplicada |
| `PATCH /api/companies/:id` | Edición inline (solo campos permitidos; valida el estado) |
| `DELETE /api/companies/:id` | Elimina una fila |
| `POST /api/generate-batch` | `{cantidad, sector?}` → Claude + web search → inserta net-new |
| `POST /api/find-expansion` | `{empresa, sector?}` → Claude + web search → inserta filiales `arbol` |
| `GET/POST /api/crm-accounts` | Cuentas del CRM (exclusión + origen de cuentas árbol) |
| `POST /api/import` | `{tipo: "companies" \| "crm", rows}` |
| `GET /api/export` | `?frente=net_new\|arbol&formato=csv\|xlsx` |
| `POST /api/seed` | Carga idempotente de los datos semilla |

---

## Modelo de datos

`companies` — un registro por empresa u oportunidad de filial:

`id`, `frente` (`net_new` \| `arbol`), `empresa`, `sector`, `tamano_estimado`, `ciudad`,
`gancho`, `senal`, `estado`, `fecha_entregada`, `contacto`, `cargo`, `email`, `telefono`,
`notas`, `proximo_paso`, y para cuentas árbol: `cliente_origen`, `paises_operacion` (jsonb),
`filial_objetivo`, `sponsor_interno`, `gancho_expansion`, `contacto_filial`.
Más `created_at` / `updated_at` (con trigger).

`crm_accounts` — negocios ya trabajados en HubSpot: `empresa`, `estado_crm`, `hubspot_url`,
`sector`. Se usan para excluir cuentas repetidas al generar lotes y para alimentar el
frente de cuentas árbol con las que están en etapa `In`.

Ver [`supabase/schema.sql`](supabase/schema.sql).

---

## Scripts

```bash
npm run dev         # desarrollo
npm run build       # build de producción
npm run start       # servir el build
npm run typecheck   # tsc --noEmit
```
