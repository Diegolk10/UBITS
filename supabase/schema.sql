-- =============================================================================
-- UBITS · Prospección Chile — schema
-- Ejecuta este archivo completo en Supabase → SQL Editor → New query.
-- =============================================================================

create extension if not exists "pgcrypto";

-- Pipeline de prospección (los dos frentes viven en la misma tabla).
create table if not exists public.companies (
  id                uuid primary key default gen_random_uuid(),
  frente            text not null default 'net_new' check (frente in ('net_new', 'arbol')),
  empresa           text not null,
  sector            text,
  tamano_estimado   text,
  ciudad            text,
  gancho            text,
  senal             text,
  estado            text not null default 'Nuevo' check (estado in (
                      'Nuevo', 'Investigando', 'Contactado', 'Reunión agendada',
                      'Propuesta enviada', 'Ganado', 'Descartado')),
  fecha_entregada   date default current_date,
  contacto          text,
  cargo             text,
  email             text,
  telefono          text,
  notas             text,
  proximo_paso      text,

  -- Campos propios de cuentas árbol (nullable en net-new)
  cliente_origen    text,
  paises_operacion  jsonb,
  filial_objetivo   text,
  sponsor_interno   text,
  gancho_expansion  text,
  contacto_filial   text,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists companies_frente_idx on public.companies (frente);
create index if not exists companies_estado_idx on public.companies (estado);
create index if not exists companies_created_at_idx on public.companies (created_at desc);

-- Negocios ya trabajados en HubSpot: exclusión al generar lotes y
-- origen de las cuentas árbol (los que están "In").
create table if not exists public.crm_accounts (
  id          uuid primary key default gen_random_uuid(),
  empresa     text not null,
  estado_crm  text not null default 'In',
  hubspot_url text,
  sector      text,
  created_at  timestamptz not null default now()
);

create unique index if not exists crm_accounts_empresa_idx on public.crm_accounts (lower(empresa));

-- updated_at automático
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists companies_set_updated_at on public.companies;
create trigger companies_set_updated_at
  before update on public.companies
  for each row execute function public.set_updated_at();

-- La app entra siempre con la service role key desde el backend, así que
-- dejamos RLS activo sin políticas: nadie con la anon key puede leer la tabla.
alter table public.companies enable row level security;
alter table public.crm_accounts enable row level security;
