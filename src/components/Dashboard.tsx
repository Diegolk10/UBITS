"use client";

import { useMemo } from "react";
import { ESTADOS, type Company, type Estado } from "@/lib/types";
import { Kpi } from "./ui";

function Barras({
  datos,
  color = "bg-electric-600",
  vacio = "Sin datos todavía.",
}: {
  datos: { label: string; valor: number; clase?: string }[];
  color?: string;
  vacio?: string;
}) {
  const max = Math.max(1, ...datos.map((d) => d.valor));
  if (datos.length === 0) return <p className="text-sm text-slate-400">{vacio}</p>;

  return (
    <div className="space-y-2">
      {datos.map((d) => (
        <div key={d.label} className="grid grid-cols-[minmax(120px,190px)_1fr_40px] items-center gap-3">
          <div className="truncate text-[12px] text-slate-600" title={d.label}>
            {d.label}
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${d.clase ?? color}`}
              style={{ width: `${Math.round((d.valor / max) * 100)}%` }}
            />
          </div>
          <div className="text-right text-[12px] font-semibold text-navy-900">{d.valor}</div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard({ companies }: { companies: Company[] }) {
  const m = useMemo(() => {
    const netNew = companies.filter((c) => c.frente === "net_new");
    const arbol = companies.filter((c) => c.frente === "arbol");

    const porEstado = (rows: Company[]) =>
      ESTADOS.map((e) => ({ label: e, valor: rows.filter((c) => c.estado === e).length }));

    const sectores = new Map<string, number>();
    for (const c of companies) {
      const s = (c.sector ?? "Sin sector").trim() || "Sin sector";
      sectores.set(s, (sectores.get(s) ?? 0) + 1);
    }

    const cuenta = (e: Estado) => companies.filter((c) => c.estado === e).length;

    return {
      total: companies.length,
      netNew,
      arbol,
      porEstadoTotal: porEstado(companies),
      porEstadoNetNew: porEstado(netNew),
      porEstadoArbol: porEstado(arbol),
      sectores: [...sectores.entries()]
        .map(([label, valor]) => ({ label, valor }))
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 12),
      nuevos: cuenta("Nuevo"),
      contactados: cuenta("Contactado"),
      reuniones: cuenta("Reunión agendada"),
      propuestas: cuenta("Propuesta enviada"),
      ganados: cuenta("Ganado"),
      descartados: cuenta("Descartado"),
    };
  }, [companies]);

  const CLASE_BARRA: Record<Estado, string> = {
    Nuevo: "bg-slate-400",
    Investigando: "bg-amber-400",
    Contactado: "bg-sky-500",
    "Reunión agendada": "bg-indigo-500",
    "Propuesta enviada": "bg-fuchsia-500",
    Ganado: "bg-emerald-500",
    Descartado: "bg-rose-400",
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Kpi label="Total pipeline" valor={m.total} />
        <Kpi label="Nuevos por trabajar" valor={m.nuevos} />
        <Kpi label="Contactados" valor={m.contactados} />
        <Kpi label="Reuniones agendadas" valor={m.reuniones} tono="magenta" />
        <Kpi label="Propuestas enviadas" valor={m.propuestas} />
        <Kpi label="Ganados" valor={m.ganados} tono="magenta" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h3 className="mb-4 text-sm font-bold text-navy-900">Pipeline por estado</h3>
          <Barras datos={m.porEstadoTotal.map((d) => ({ ...d, clase: CLASE_BARRA[d.label] }))} />
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h3 className="mb-4 text-sm font-bold text-navy-900">Por frente</h3>
          <Barras
            datos={[
              { label: `Net-new Chile (${m.netNew.length})`, valor: m.netNew.length, clase: "bg-navy-900" },
              { label: `Cuentas árbol (${m.arbol.length})`, valor: m.arbol.length, clase: "bg-magenta-600" },
            ]}
          />
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Net-new</h4>
              <Barras datos={m.porEstadoNetNew.filter((d) => d.valor > 0)} color="bg-navy-700" vacio="Sin registros." />
            </div>
            <div>
              <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Árbol</h4>
              <Barras datos={m.porEstadoArbol.filter((d) => d.valor > 0)} color="bg-magenta-500" vacio="Sin registros." />
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h3 className="mb-4 text-sm font-bold text-navy-900">Top sectores</h3>
        <Barras datos={m.sectores} color="bg-electric-600" />
      </section>
    </div>
  );
}
