"use client";

import { useMemo, useState } from "react";
import { ESTADOS, COLORES_ESTADO, type Company, type Estado, type Frente } from "@/lib/types";
import { normalizeName } from "@/lib/normalize";

export type Columna = {
  key: keyof Company;
  label: string;
  ancho: string;
  editable?: boolean;
  /** Campo que el AE debe completar → se resalta cuando está vacío. */
  pendiente?: boolean;
  multilinea?: boolean;
};

const COLS_NET_NEW: Columna[] = [
  { key: "empresa", label: "Empresa", ancho: "min-w-[190px]" },
  { key: "estado", label: "Estado", ancho: "min-w-[165px]" },
  { key: "sector", label: "Sector", ancho: "min-w-[150px]" },
  { key: "tamano_estimado", label: "Tamaño est.", ancho: "w-[120px]" },
  { key: "ciudad", label: "Ciudad / HQ", ancho: "min-w-[130px]" },
  { key: "gancho", label: "Gancho L&D", ancho: "min-w-[260px]", multilinea: true },
  { key: "senal", label: "Señal", ancho: "min-w-[200px]", multilinea: true },
  { key: "contacto", label: "Contacto", ancho: "min-w-[150px]", editable: true, pendiente: true },
  { key: "cargo", label: "Cargo", ancho: "min-w-[150px]", editable: true, pendiente: true },
  { key: "email", label: "Email", ancho: "min-w-[190px]", editable: true, pendiente: true },
  { key: "telefono", label: "Teléfono", ancho: "min-w-[130px]", editable: true, pendiente: true },
  { key: "proximo_paso", label: "Próximo paso", ancho: "min-w-[180px]", editable: true, pendiente: true },
  { key: "notas", label: "Notas", ancho: "min-w-[220px]", editable: true, pendiente: true },
  { key: "fecha_entregada", label: "Entregada", ancho: "w-[110px]" },
];

const COLS_ARBOL: Columna[] = [
  { key: "cliente_origen", label: "Cliente Chile", ancho: "min-w-[170px]" },
  { key: "filial_objetivo", label: "Filial objetivo", ancho: "min-w-[190px]" },
  { key: "ciudad", label: "País", ancho: "w-[120px]" },
  { key: "estado", label: "Estado", ancho: "min-w-[165px]" },
  { key: "gancho_expansion", label: "Gancho de expansión", ancho: "min-w-[280px]", multilinea: true },
  { key: "senal", label: "Señal", ancho: "min-w-[200px]", multilinea: true },
  { key: "sponsor_interno", label: "Sponsor interno (Chile)", ancho: "min-w-[170px]", editable: true, pendiente: true },
  { key: "contacto_filial", label: "Contacto filial", ancho: "min-w-[160px]", editable: true, pendiente: true },
  { key: "cargo", label: "Cargo", ancho: "min-w-[140px]", editable: true, pendiente: true },
  { key: "email", label: "Email", ancho: "min-w-[190px]", editable: true, pendiente: true },
  { key: "telefono", label: "Teléfono", ancho: "min-w-[130px]", editable: true, pendiente: true },
  { key: "proximo_paso", label: "Próximo paso", ancho: "min-w-[180px]", editable: true, pendiente: true },
  { key: "notas", label: "Notas", ancho: "min-w-[220px]", editable: true, pendiente: true },
  { key: "fecha_entregada", label: "Entregada", ancho: "w-[110px]" },
];

export const COLUMNAS: Record<Frente, Columna[]> = { net_new: COLS_NET_NEW, arbol: COLS_ARBOL };

/* --------------------------------- celdas -------------------------------- */

function CeldaTexto({
  valor,
  col,
  onGuardar,
}: {
  valor: string;
  col: Columna;
  onGuardar: (v: string) => void;
}) {
  const [borrador, setBorrador] = useState(valor);
  const [tocado, setTocado] = useState(false);

  // Si el valor llega actualizado desde el servidor y no lo estoy editando, sincroniza.
  if (!tocado && borrador !== valor) setBorrador(valor);

  return (
    <input
      value={borrador}
      placeholder="—"
      onChange={(e) => {
        setTocado(true);
        setBorrador(e.target.value);
      }}
      onBlur={() => {
        setTocado(false);
        if (borrador !== valor) onGuardar(borrador);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        if (e.key === "Escape") {
          setBorrador(valor);
          setTocado(false);
        }
      }}
      className={`w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-[13px] outline-none placeholder:text-slate-300 hover:border-slate-200 focus:border-electric-500 focus:bg-white focus:ring-2 focus:ring-electric-500/20 ${
        col.pendiente ? "celda-pendiente" : ""
      }`}
    />
  );
}

function SelectorEstado({ estado, onGuardar }: { estado: Estado; onGuardar: (v: Estado) => void }) {
  return (
    <select
      value={estado}
      onChange={(e) => onGuardar(e.target.value as Estado)}
      className={`w-full cursor-pointer rounded-full px-2 py-1 text-[12px] font-semibold ring-1 ring-inset outline-none focus:ring-2 focus:ring-electric-500 ${COLORES_ESTADO[estado]}`}
    >
      {ESTADOS.map((e) => (
        <option key={e} value={e} className="bg-white text-slate-800">
          {e}
        </option>
      ))}
    </select>
  );
}

/* --------------------------------- tabla --------------------------------- */

export type Filtros = { texto: string; sector: string; tamano: string; estado: string };

export default function TablaEmpresas({
  companies,
  frente,
  filtros,
  crmPorNombre,
  onActualizar,
  onEliminar,
}: {
  companies: Company[];
  frente: Frente;
  filtros: Filtros;
  crmPorNombre: Map<string, string>;
  onActualizar: (id: string, patch: Partial<Company>) => void;
  onEliminar: (id: string) => void;
}) {
  const [orden, setOrden] = useState<{ key: keyof Company; asc: boolean }>({ key: "created_at", asc: false });
  const columnas = COLUMNAS[frente];

  const filas = useMemo(() => {
    const texto = filtros.texto.trim().toLowerCase();
    const filtradas = companies.filter((c) => {
      if (c.frente !== frente) return false;
      if (filtros.sector && (c.sector ?? "") !== filtros.sector) return false;
      if (filtros.tamano && (c.tamano_estimado ?? "") !== filtros.tamano) return false;
      if (filtros.estado && c.estado !== filtros.estado) return false;
      if (!texto) return true;
      return [c.empresa, c.cliente_origen, c.filial_objetivo, c.sector, c.contacto, c.ciudad]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(texto));
    });

    const dir = orden.asc ? 1 : -1;
    return [...filtradas].sort((a, b) => {
      const va = a[orden.key];
      const vb = b[orden.key];
      return String(va ?? "").localeCompare(String(vb ?? ""), "es", { numeric: true }) * dir;
    });
  }, [companies, frente, filtros, orden]);

  if (filas.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-sm text-slate-500">
        {companies.some((c) => c.frente === frente)
          ? "Ningún registro coincide con los filtros."
          : frente === "net_new"
            ? "Todavía no hay empresas. Aprieta «Generar lote de hoy»."
            : "Todavía no hay filiales. Elige un cliente y aprieta «Buscar expansión»."}
      </div>
    );
  }

  return (
    <div className="tabla-scroll overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
      <table className="w-full border-collapse text-left text-[13px]">
        <thead className="sticky top-0 z-10 bg-navy-900 text-white">
          <tr>
            {columnas.map((col) => (
              <th
                key={String(col.key)}
                className={`${col.ancho} cursor-pointer select-none px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide hover:bg-navy-800`}
                onClick={() => setOrden((o) => ({ key: col.key, asc: o.key === col.key ? !o.asc : true }))}
                title="Ordenar por esta columna"
              >
                {col.label}
                {orden.key === col.key ? <span className="ml-1">{orden.asc ? "▲" : "▼"}</span> : null}
              </th>
            ))}
            <th className="w-10 px-2 py-2" />
          </tr>
        </thead>
        <tbody>
          {filas.map((c, i) => {
            const etapaCrm = crmPorNombre.get(normalizeName(c.empresa));
            return (
              <tr key={c.id} className={`${i % 2 ? "bg-slate-50/60" : "bg-white"} align-top hover:bg-electric-100/40`}>
                {columnas.map((col) => {
                  const bruto = c[col.key];
                  const valor = Array.isArray(bruto) ? bruto.join(", ") : bruto == null ? "" : String(bruto);

                  return (
                    <td key={String(col.key)} className="border-t border-slate-100 px-1.5 py-1">
                      {col.key === "estado" ? (
                        <SelectorEstado
                          estado={c.estado}
                          onGuardar={(estado) => onActualizar(c.id, { estado })}
                        />
                      ) : col.editable ? (
                        <CeldaTexto
                          valor={valor}
                          col={col}
                          onGuardar={(v) => onActualizar(c.id, { [col.key]: v || null } as Partial<Company>)}
                        />
                      ) : (
                        <div className={`px-1.5 py-1 ${col.multilinea ? "text-slate-600" : "text-slate-800"}`}>
                          <span className={col.key === "empresa" || col.key === "cliente_origen" ? "font-semibold text-navy-900" : ""}>
                            {valor || <span className="text-slate-300">—</span>}
                          </span>
                          {col.key === "empresa" && etapaCrm ? (
                            <span
                              className="ml-1.5 inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset ring-amber-300 bg-amber-50 text-amber-700"
                              title={`Esta cuenta ya está en HubSpot con etapa ${etapaCrm}`}
                            >
                              CRM: {etapaCrm}
                            </span>
                          ) : null}
                          {col.key === "cliente_origen" && c.paises_operacion?.length ? (
                            <div className="mt-0.5 text-[11px] text-slate-400">{c.paises_operacion.join(" · ")}</div>
                          ) : null}
                        </div>
                      )}
                    </td>
                  );
                })}
                <td className="border-t border-slate-100 px-1 py-2 text-center">
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar «${c.empresa}» del pipeline?`)) onEliminar(c.id);
                    }}
                    className="rounded px-1.5 py-0.5 text-slate-300 hover:bg-rose-50 hover:text-rose-600"
                    title="Eliminar fila"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
