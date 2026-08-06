create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.terminals (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  address text,
  zone text not null,
  shift_window text not null,
  contact_name text,
  contact_email text,
  is_active boolean not null default true,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role_code text not null references public.roles(code),
  full_name text not null,
  email text not null unique,
  is_active boolean not null default true,
  last_access_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_terminal_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  terminal_id uuid not null references public.terminals(id) on delete cascade,
  is_primary boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, terminal_id)
);

create table if not exists public.bus_brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.bus_models (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.bus_brands(id),
  name text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (brand_id, name)
);

create table if not exists public.buses (
  id uuid primary key default gen_random_uuid(),
  terminal_id uuid not null references public.terminals(id),
  brand_id uuid references public.bus_brands(id),
  model_id uuid references public.bus_models(id),
  internal_number text not null,
  ppu text not null,
  energy_type text not null,
  operational_status text not null,
  administrative_status text not null default 'Pendiente',
  zone text,
  observations text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  unique (internal_number, ppu)
);

create table if not exists public.personnel (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  terminal_id uuid references public.terminals(id),
  internal_code text not null unique,
  full_name text not null,
  email text,
  phone text,
  job_title text not null,
  system_role_code text not null references public.roles(code),
  habitual_shift text,
  supervisor_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  terminal_id uuid not null references public.terminals(id),
  operational_date date not null,
  shift_type text not null,
  status text not null default 'Borrador',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  supervisor_id uuid references public.profiles(id),
  observations text,
  closed_at timestamptz,
  closed_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  terminal_id uuid not null references public.terminals(id),
  shift_id uuid references public.shifts(id),
  bus_id uuid references public.buses(id),
  assigned_user_id uuid references public.profiles(id),
  title text not null,
  description text,
  category text,
  priority text not null default 'Normal',
  status text not null default 'Pendiente',
  due_at timestamptz,
  starts_at timestamptz,
  completed_at timestamptz,
  evidence_required boolean not null default false,
  supervisor_comment text,
  execution_comment text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.task_evidences (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  uploaded_by uuid references public.profiles(id),
  file_path text not null,
  file_type text not null,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  terminal_id uuid references public.terminals(id),
  user_id uuid references public.profiles(id),
  title text not null,
  description text not null,
  severity text not null default 'info',
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.document_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  default_warning_days integer not null default 30,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.bus_documents (
  id uuid primary key default gen_random_uuid(),
  bus_id uuid not null references public.buses(id) on delete cascade,
  document_type_id uuid not null references public.document_types(id),
  document_number text,
  issued_at date,
  expires_at date,
  status text not null default 'Pendiente',
  file_path text,
  observations text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.rtg_processes (
  id uuid primary key default gen_random_uuid(),
  terminal_id uuid not null references public.terminals(id),
  bus_id uuid not null references public.buses(id),
  status text not null default 'Pendiente de programación',
  scheduled_at timestamptz,
  sent_at timestamptz,
  result_at timestamptz,
  result_summary text,
  evidence_path text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  terminal_id uuid references public.terminals(id),
  module text not null,
  action text not null,
  record_type text not null,
  record_id text,
  previous_values jsonb,
  new_values jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_profiles_role_code on public.profiles(role_code);
create index if not exists idx_buses_terminal_id on public.buses(terminal_id);
create index if not exists idx_personnel_terminal_id on public.personnel(terminal_id);
create index if not exists idx_shifts_terminal_id on public.shifts(terminal_id);
create index if not exists idx_shifts_operational_date on public.shifts(operational_date);
create index if not exists idx_tasks_terminal_id on public.tasks(terminal_id);
create index if not exists idx_tasks_shift_id on public.tasks(shift_id);
create index if not exists idx_tasks_status on public.tasks(status);
create index if not exists idx_bus_documents_expires_at on public.bus_documents(expires_at);
create index if not exists idx_rtg_processes_status on public.rtg_processes(status);

create trigger set_updated_at_roles before update on public.roles
for each row execute function public.set_updated_at();
create trigger set_updated_at_terminals before update on public.terminals
for each row execute function public.set_updated_at();
create trigger set_updated_at_profiles before update on public.profiles
for each row execute function public.set_updated_at();
create trigger set_updated_at_bus_brands before update on public.bus_brands
for each row execute function public.set_updated_at();
create trigger set_updated_at_bus_models before update on public.bus_models
for each row execute function public.set_updated_at();
create trigger set_updated_at_buses before update on public.buses
for each row execute function public.set_updated_at();
create trigger set_updated_at_personnel before update on public.personnel
for each row execute function public.set_updated_at();
create trigger set_updated_at_shifts before update on public.shifts
for each row execute function public.set_updated_at();
create trigger set_updated_at_tasks before update on public.tasks
for each row execute function public.set_updated_at();
create trigger set_updated_at_document_types before update on public.document_types
for each row execute function public.set_updated_at();
create trigger set_updated_at_bus_documents before update on public.bus_documents
for each row execute function public.set_updated_at();
create trigger set_updated_at_rtg_processes before update on public.rtg_processes
for each row execute function public.set_updated_at();

alter table public.terminals enable row level security;
alter table public.profiles enable row level security;
alter table public.user_terminal_access enable row level security;
alter table public.buses enable row level security;
alter table public.personnel enable row level security;
alter table public.shifts enable row level security;
alter table public.tasks enable row level security;
alter table public.task_evidences enable row level security;
alter table public.notifications enable row level security;
alter table public.bus_documents enable row level security;
alter table public.rtg_processes enable row level security;
alter table public.audit_logs enable row level security;

create or replace function public.current_role_code()
returns text
language sql
stable
as $$
  select role_code
  from public.profiles
  where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select public.current_role_code() = 'admin';
$$;

create or replace function public.has_terminal_access(target_terminal_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.user_terminal_access uta
    where uta.user_id = auth.uid()
      and uta.terminal_id = target_terminal_id
  ) or public.is_admin();
$$;

create policy "Profiles readable by self or admin"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

create policy "Terminals by authorized access"
on public.terminals for select
using (public.has_terminal_access(id));

create policy "User terminal access readable by self or admin"
on public.user_terminal_access for select
using (user_id = auth.uid() or public.is_admin());

create policy "Operational tables by terminal access"
on public.buses for select
using (public.has_terminal_access(terminal_id));

create policy "Personnel by terminal access"
on public.personnel for select
using (public.has_terminal_access(terminal_id));

create policy "Shifts by terminal access"
on public.shifts for select
using (public.has_terminal_access(terminal_id));

create policy "Tasks by terminal access"
on public.tasks for select
using (public.has_terminal_access(terminal_id));

create policy "Notifications by owner or admin"
on public.notifications for select
using (user_id = auth.uid() or public.is_admin());

create policy "Documents by bus terminal access"
on public.bus_documents for select
using (
  exists (
    select 1
    from public.buses b
    where b.id = bus_documents.bus_id
      and public.has_terminal_access(b.terminal_id)
  )
);

create policy "RTG by terminal access"
on public.rtg_processes for select
using (public.has_terminal_access(terminal_id));

create policy "Audit by admin only"
on public.audit_logs for select
using (public.is_admin());
