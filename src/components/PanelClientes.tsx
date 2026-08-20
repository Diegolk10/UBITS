"use client";

import { useMemo, useState } from "react";
import type { Company, CrmAccount } from "@/lib/types";
import { normalizeName } from "@/lib/normalize";
import { Boton, Spinner } from "./ui";

function esCliente(estado: string): boolean {
  return estado.split("/").some((e) => e.trim().toLowerCase() === "in");
}

export default function PanelClientes({
  crmAccounts,
  companies,
  buscando,
  onBuscarExpansion,
  onAgregarCliente,
  onEliminarCliente,
}: {
  crmAccounts: CrmAccount[];
  companies: Company[];
  buscando: string | null;
  onBuscarExpansion: (empresa: string, sector: string | null) => void;
  onAgregarCliente: (empresa: string, sector: string) => void;
  onEliminarCliente: (id: string) => void;
}) {
  const [verTodas, setVerTodas] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoSector, setNuevoSector] = useState("");

  const filialesPorCliente = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of companies) {
      if (c.frente !== "arbol" || !c.cliente_origen) continue;
      const k = normalizeName(c.cliente_origen);
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return m;
  }, [companies]);

  const lista = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return crmAccounts
      .filter((c) => (verTodas ? true : esCliente(c.estado_crm)))
      .filter((c) => (q ? c.empresa.toLowerCase().includes(q) : true))
      .sort((a, b) => a.empresa.localeCompare(b.empresa, "es"));
  }, [crmAccounts, verTodas, busqueda]);

  const clientesIn = crmAccounts.filter((c) => esCliente(c.estado_crm)).length;

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-navy-900">Clientes actuales en Chile</h3>
          <p className="text-[12px] text-slate-500">
            {clientesIn} cuentas ganadas (etapa «In»). Busca en qué países operan para expandir por relación caliente.
          </p>
        </div>
        <label className="flex items-center gap-2 text-[12px] text-slate-600">
          <input
            type="checkbox"
            checked={verTodas}
            onChange={(e) => setVerTodas(e.target.checked)}
            className="h-3.5 w-3.5 accent-[#E10098]"
          />
          Ver todas las cuentas del CRM ({crmAccounts.length})
        </label>
      </div>

      <input
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar cliente…"
        className="mb-3 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-electric-500 focus:ring-2 focus:ring-electric-500/20"
      />

      <div className="tabla-scroll max-h-[320px] space-y-1 overflow-y-auto pr-1">
        {lista.map((c) => {
          const filiales = filialesPorCliente.get(normalizeName(c.empresa)) ?? 0;
          const cargando = buscando === c.empresa;
          return (
            <div
              key={c.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 px-2.5 py-1.5 hover:bg-slate-50"
            >
              <div className="min-w-0">
                <div className="truncate text-[13px] font-semibold text-navy-900" title={c.empresa}>
                  {c.empresa}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span
                    className={`rounded px-1.5 py-0.5 font-semibold ${
                      esCliente(c.estado_crm)
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {c.estado_crm}
                  </span>
                  {c.sector ? <span className="truncate">{c.sector}</span> : null}
                  {filiales > 0 ? (
                    <span className="text-magenta-600">
                      {filiales} filial{filiales === 1 ? "" : "es"} en pipeline
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {c.hubspot_url ? (
                  <a
                    href={c.hubspot_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded px-1.5 py-1 text-[11px] text-slate-400 hover:bg-slate-100 hover:text-navy-900"
                    title="Abrir en HubSpot"
                  >
                    HS ↗
                  </a>
                ) : null}
                <button
                  onClick={() => onBuscarExpansion(c.empresa, c.sector)}
                  disabled={Boolean(buscando)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-navy-900 px-2.5 py-1.5 text-[12px] font-semibold text-white hover:bg-navy-800 disabled:opacity-50"
                >
                  {cargando ? <Spinner /> : null}
                  {cargando ? "Buscando…" : "Buscar expansión"}
                </button>
                <button
                  onClick={() => {
                    if (confirm(`¿Quitar «${c.empresa}» de la lista de cuentas del CRM?`)) onEliminarCliente(c.id);
                  }}
                  className="rounded px-1.5 py-1 text-slate-300 hover:bg-rose-50 hover:text-rose-600"
                  title="Quitar de la lista"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
        {lista.length === 0 ? (
          <p className="px-1 py-6 text-center text-sm text-slate-400">Sin clientes que coincidan.</p>
        ) : null}
      </div>

      <form
        className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!nuevoNombre.trim()) return;
          onAgregarCliente(nuevoNombre.trim(), nuevoSector.trim());
          setNuevoNombre("");
          setNuevoSector("");
        }}
      >
        <input
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          placeholder="Agregar cliente ganado…"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-electric-500"
        />
        <input
          value={nuevoSector}
          onChange={(e) => setNuevoSector(e.target.value)}
          placeholder="Sector (opcional)"
          className="w-44 rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-electric-500"
        />
        <Boton type="submit">Agregar</Boton>
      </form>
    </div>
  );
}
