create or replace function public.can_manage_fleet()
returns boolean
language sql
stable
as $$
  select public.current_role_code() in ('admin', 'inspector_administrativo');
$$;

alter table public.bus_brands enable row level security;
alter table public.bus_models enable row level security;

drop policy if exists "Bus brands read for authenticated users" on public.bus_brands;
create policy "Bus brands read for authenticated users"
on public.bus_brands for select
using (auth.uid() is not null);

drop policy if exists "Bus brands manage by fleet managers" on public.bus_brands;
create policy "Bus brands manage by fleet managers"
on public.bus_brands for all
using (public.can_manage_fleet())
with check (public.can_manage_fleet());

drop policy if exists "Bus models read for authenticated users" on public.bus_models;
create policy "Bus models read for authenticated users"
on public.bus_models for select
using (auth.uid() is not null);

drop policy if exists "Bus models manage by fleet managers" on public.bus_models;
create policy "Bus models manage by fleet managers"
on public.bus_models for all
using (public.can_manage_fleet())
with check (public.can_manage_fleet());

drop policy if exists "Buses insert by fleet managers" on public.buses;
create policy "Buses insert by fleet managers"
on public.buses for insert
with check (
  public.can_manage_fleet()
  and public.has_terminal_access(terminal_id)
);

drop policy if exists "Buses update by fleet managers" on public.buses;
create policy "Buses update by fleet managers"
on public.buses for update
using (
  public.can_manage_fleet()
  and public.has_terminal_access(terminal_id)
)
with check (
  public.can_manage_fleet()
  and public.has_terminal_access(terminal_id)
);

drop policy if exists "Audit insert by fleet managers" on public.audit_logs;
create policy "Audit insert by fleet managers"
on public.audit_logs for insert
with check (public.can_manage_fleet());
