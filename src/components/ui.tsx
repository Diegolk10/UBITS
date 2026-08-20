"use client";

import { COLORES_ESTADO, type Estado } from "@/lib/types";

export function ChipEstado({ estado }: { estado: Estado }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${COLORES_ESTADO[estado]}`}
    >
      {estado}
    </span>
  );
}

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg className={`h-4 w-4 animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

type BotonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: "primario" | "secundario" | "fantasma";
  cargando?: boolean;
};

export function Boton({ variante = "secundario", cargando, children, className = "", ...props }: BotonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";
  const estilos = {
    primario: "bg-magenta-600 text-white hover:bg-magenta-500 shadow-sm",
    secundario: "bg-white text-navy-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50",
    fantasma: "text-white/80 hover:text-white hover:bg-white/10",
  }[variante];

  return (
    <button className={`${base} ${estilos} ${className}`} disabled={cargando || props.disabled} {...props}>
      {cargando ? <Spinner /> : null}
      {children}
    </button>
  );
}

export function Aviso({
  tipo = "info",
  children,
  onCerrar,
}: {
  tipo?: "info" | "error" | "exito";
  children: React.ReactNode;
  onCerrar?: () => void;
}) {
  const estilos = {
    info: "bg-electric-100 text-navy-900 ring-electric-500/30",
    error: "bg-rose-50 text-rose-800 ring-rose-300",
    exito: "bg-emerald-50 text-emerald-800 ring-emerald-300",
  }[tipo];

  return (
    <div className={`flex items-start gap-3 rounded-lg px-4 py-2.5 text-sm ring-1 ring-inset ${estilos}`}>
      <div className="flex-1">{children}</div>
      {onCerrar ? (
        <button onClick={onCerrar} className="shrink-0 text-lg leading-none opacity-60 hover:opacity-100">
          ×
        </button>
      ) : null}
    </div>
  );
}

export function Kpi({ label, valor, tono = "navy" }: { label: string; valor: number | string; tono?: string }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${tono === "magenta" ? "text-magenta-600" : "text-navy-900"}`}>
        {valor}
      </div>
    </div>
  );
}
