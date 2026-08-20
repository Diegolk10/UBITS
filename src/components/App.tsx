"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import type { Company, CrmAccount, Frente } from "@/lib/types";
import { ESTADOS } from "@/lib/types";
import { normalizeName } from "@/lib/normalize";
import TablaEmpresas, { type Filtros } from "./TablaEmpresas";
import Dashboard from "./Dashboard";
import PanelClientes from "./PanelClientes";
import { Aviso, Boton, Spinner } from "./ui";

type Tab = Frente | "dashboard";

const FILTROS_VACIOS: Filtros = { texto: "", sector: "", tamano: "", estado: "" };

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? `Error ${res.status}`);
  return data as T;
}

export default function App() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [crmAccounts, setCrmAccounts] = useState<CrmAccount[]>([]);
  const [tab, setTab] = useState<Tab>("net_new");
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VACIOS);
  const [cargando, setCargando] = useState(true);
  const [generando, setGenerando] = useState(false);
  const [buscando, setBuscando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(18);
  const [sectorLote, setSectorLote] = useState("");
  const [almacen, setAlmacen] = useState<"supabase" | "file" | null>(null);
  const inputArchivo = useRef<HTMLInputElement>(null);

  /* ------------------------------- carga ------------------------------- */

  const recargar = useCallback(async () => {
    const [a, b] = await Promise.all([
      api<{ companies: Company[]; store: "supabase" | "file" }>("/api/companies"),
      api<{ crmAccounts: CrmAccount[] }>("/api/crm-accounts"),
    ]);
    setCompanies(a.companies);
    setAlmacen(a.store);
    setCrmAccounts(b.crmAccounts);
    return a.companies.length + b.crmAccounts.length;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const total = await recargar();
        // Primera vez: precarga la semilla para no arrancar en blanco.
        if (total === 0) {
          await api("/api/seed", { method: "POST" });
          await recargar();
        }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setCargando(false);
      }
    })();
  }, [recargar]);

  /* ------------------------------ acciones ----------------------------- */

  const actualizar = useCallback(
    async (id: string, patch: Partial<Company>) => {
      const previo = companies;
      setCompanies((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
      try {
        await api(`/api/companies/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
      } catch (e) {
        setCompanies(previo);
        setError(`No se pudo guardar: ${(e as Error).message}`);
      }
    },
    [companies],
  );

  const eliminar = useCallback(async (id: string) => {
    const respaldo = companies;
    setCompanies((cs) => cs.filter((c) => c.id !== id));
    try {
      await api(`/api/companies/${id}`, { method: "DELETE" });
    } catch (e) {
      setCompanies(respaldo);
      setError((e as Error).message);
    }
  }, [companies]);

  const generarLote = useCallback(async () => {
    setGenerando(true);
    setError(null);
    setAviso(null);
    try {
      const r = await api<{ insertadas: Company[]; devueltas: number; descartadas: number }>("/api/generate-batch", {
        method: "POST",
        body: JSON.stringify({ cantidad, sector: sectorLote.trim() || null }),
      });
      setCompanies((cs) => [...r.insertadas, ...cs]);
      setTab("net_new");
      setAviso(
        `Lote listo: ${r.insertadas.length} empresas nuevas` +
          (r.descartadas > 0 ? ` (${r.descartadas} descartadas por duplicado).` : "."),
      );
    } catch (e) {
      setError(`No se pudo generar el lote: ${(e as Error).message}`);
    } finally {
      setGenerando(false);
    }
  }, [cantidad, sectorLote]);

  const buscarExpansion = useCallback(async (empresa: string, sector: string | null) => {
    setBuscando(empresa);
    setError(null);
    setAviso(null);
    try {
      const r = await api<{ insertadas: Company[]; paises_operacion: string[]; encontradas: number }>(
        "/api/find-expansion",
        { method: "POST", body: JSON.stringify({ empresa, sector }) },
      );
      setCompanies((cs) => [...r.insertadas, ...cs]);
      setAviso(
        r.insertadas.length > 0
          ? `${empresa}: ${r.insertadas.length} filial(es) agregadas. Opera en ${r.paises_operacion.join(", ") || "—"}.`
          : `${empresa}: no se encontraron filiales nuevas fuera de Chile.`,
      );
    } catch (e) {
      setError(`No se pudo buscar la expansión: ${(e as Error).message}`);
    } finally {
      setBuscando(null);
    }
  }, []);

  const agregarCliente = useCallback(async (empresa: string, sector: string) => {
    try {
      const r = await api<{ insertadas: CrmAccount[] }>("/api/crm-accounts", {
        method: "POST",
        body: JSON.stringify({ row: { empresa, estado_crm: "In", sector: sector || null } }),
      });
      if (r.insertadas.length === 0) setAviso(`«${empresa}» ya estaba en la lista.`);
      else setCrmAccounts((cs) => [...cs, ...r.insertadas]);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  const eliminarCliente = useCallback(async (id: string) => {
    const respaldo = crmAccounts;
    setCrmAccounts((cs) => cs.filter((c) => c.id !== id));
    try {
      await api(`/api/crm-accounts/${id}`, { method: "DELETE" });
    } catch (e) {
      setCrmAccounts(respaldo);
      setError((e as Error).message);
    }
  }, [crmAccounts]);

  const importar = useCallback(
    async (archivo: File, tipo: "companies" | "crm") => {
      setError(null);
      setAviso(null);
      try {
        const buffer = await archivo.arrayBuffer();
        const libro = XLSX.read(buffer, { type: "array" });
        const hoja = libro.Sheets[libro.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(hoja, { defval: "" });

        const r = await api<{ insertadas: number; duplicadas: number }>("/api/import", {
          method: "POST",
          body: JSON.stringify({ tipo, frente: tab === "arbol" ? "arbol" : "net_new", rows }),
        });
        await recargar();
        setAviso(`Importadas ${r.insertadas} filas (${r.duplicadas} duplicadas omitidas).`);
      } catch (e) {
        setError(`No se pudo importar: ${(e as Error).message}`);
      }
    },
    [recargar, tab],
  );

  /* ------------------------------ derivados ---------------------------- */

  const crmPorNombre = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of crmAccounts) m.set(normalizeName(c.empresa), c.estado_crm);
    return m;
  }, [crmAccounts]);

  const opciones = useMemo(() => {
    const delFrente = companies.filter((c) => (tab === "dashboard" ? true : c.frente === tab));
    const unicos = (f: (c: Company) => string | null) =>
      [...new Set(delFrente.map(f).filter((v): v is string => Boolean(v)))].sort((a, b) => a.localeCompare(b, "es"));
    return { sectores: unicos((c) => c.sector), tamanos: unicos((c) => c.tamano_estimado) };
  }, [companies, tab]);

  const conteo = (f: Frente) => companies.filter((c) => c.frente === f).length;

  /* -------------------------------- render ----------------------------- */

  const tabs: { id: Tab; label: string }[] = [
    { id: "net_new", label: `Net-new Chile (${conteo("net_new")})` },
    { id: "arbol", label: `Cuentas árbol (${conteo("arbol")})` },
    { id: "dashboard", label: "Dashboard" },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 shadow-lg">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold tracking-tight text-white">UBITS</span>
            <span className="text-sm font-medium text-electric-100/80">Prospección Chile</span>
          </div>

          <nav className="flex gap-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id);
                  setFiltros(FILTROS_VACIOS);
                }}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                  tab === t.id ? "bg-white text-navy-900 shadow-sm" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <input
              type="number"
              min={1}
              max={30}
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              title="Cantidad de empresas por lote"
              className="w-16 rounded-lg border border-white/20 bg-white/10 px-2 py-2 text-sm text-white outline-none placeholder:text-white/50 focus:border-white/50"
            />
            <input
              value={sectorLote}
              onChange={(e) => setSectorLote(e.target.value)}
              placeholder="Sector (opcional)"
              title="Filtra el lote a un sector"
              className="w-40 rounded-lg border border-white/20 bg-white/10 px-2.5 py-2 text-sm text-white outline-none placeholder:text-white/50 focus:border-white/50"
            />
            <Boton variante="primario" onClick={generarLote} cargando={generando}>
              {generando ? "Investigando con Claude…" : "Generar lote de hoy"}
            </Boton>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] space-y-4 px-5 py-5">
        {almacen === "file" ? (
          <Aviso tipo="info">
            Estás usando el <b>store local</b> (<code>.data/db.json</code>). Configura <code>SUPABASE_URL</code> y{" "}
            <code>SUPABASE_SERVICE_ROLE_KEY</code> para persistir y compartir con tu jefatura.
          </Aviso>
        ) : null}
        {error ? (
          <Aviso tipo="error" onCerrar={() => setError(null)}>
            {error}
          </Aviso>
        ) : null}
        {aviso ? (
          <Aviso tipo="exito" onCerrar={() => setAviso(null)}>
            {aviso}
          </Aviso>
        ) : null}

        {cargando ? (
          <div className="flex items-center gap-3 rounded-xl bg-white p-10 text-slate-500 shadow-sm ring-1 ring-slate-200">
            <Spinner className="text-navy-900" /> Cargando pipeline…
          </div>
        ) : tab === "dashboard" ? (
          <Dashboard companies={companies} />
        ) : (
          <>
            {tab === "arbol" ? (
              <PanelClientes
                crmAccounts={crmAccounts}
                companies={companies}
                buscando={buscando}
                onBuscarExpansion={buscarExpansion}
                onAgregarCliente={agregarCliente}
                onEliminarCliente={eliminarCliente}
              />
            ) : null}

            <div className="flex flex-wrap items-center gap-2 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
              <input
                value={filtros.texto}
                onChange={(e) => setFiltros((f) => ({ ...f, texto: e.target.value }))}
                placeholder="Buscar empresa, contacto, ciudad…"
                className="min-w-[220px] flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-electric-500 focus:ring-2 focus:ring-electric-500/20"
              />
              <select
                value={filtros.sector}
                onChange={(e) => setFiltros((f) => ({ ...f, sector: e.target.value }))}
                className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-electric-500"
              >
                <option value="">Todos los sectores</option>
                {opciones.sectores.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                value={filtros.tamano}
                onChange={(e) => setFiltros((f) => ({ ...f, tamano: e.target.value }))}
                className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-electric-500"
              >
                <option value="">Todos los tamaños</option>
                {opciones.tamanos.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                value={filtros.estado}
                onChange={(e) => setFiltros((f) => ({ ...f, estado: e.target.value }))}
                className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-electric-500"
              >
                <option value="">Todos los estados</option>
                {ESTADOS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {filtros.texto || filtros.sector || filtros.tamano || filtros.estado ? (
                <Boton variante="fantasma" className="text-slate-500 hover:bg-slate-100 hover:text-navy-900" onClick={() => setFiltros(FILTROS_VACIOS)}>
                  Limpiar
                </Boton>
              ) : null}

              <div className="ml-auto flex items-center gap-2">
                <input
                  ref={inputArchivo}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={(e) => {
                    const archivo = e.target.files?.[0];
                    if (archivo) importar(archivo, tab === "arbol" ? "crm" : "companies");
                    e.target.value = "";
                  }}
                />
                <Boton onClick={() => inputArchivo.current?.click()}>
                  Importar {tab === "arbol" ? "clientes" : "CSV/XLSX"}
                </Boton>
                <a
                  href={`/api/export?frente=${tab}&formato=csv`}
                  className="inline-flex items-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-navy-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                >
                  Exportar CSV
                </a>
                <a
                  href={`/api/export?frente=${tab}&formato=xlsx`}
                  className="inline-flex items-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-navy-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                >
                  XLSX
                </a>
              </div>
            </div>

            <TablaEmpresas
              companies={companies}
              frente={tab}
              filtros={filtros}
              crmPorNombre={crmPorNombre}
              onActualizar={actualizar}
              onEliminar={eliminar}
            />
          </>
        )}
      </main>
    </div>
  );
}
