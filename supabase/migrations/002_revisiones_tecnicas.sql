create or replace function public.rt_user_can_read()
returns boolean
language sql
stable
as $$
  select public.current_role_code() in (
    'admin',
    'supervisor',
    'inspector',
    'inspector_administrativo',
    'consulta'
  );
$$;

create or replace function public.rt_user_can_operate()
returns boolean
language sql
stable
as $$
  select public.current_role_code() in (
    'admin',
    'supervisor',
    'inspector_administrativo'
  );
$$;

create or replace function public.rt_user_can_validate()
returns boolean
language sql
stable
as $$
  select public.current_role_code() in (
    'admin',
    'supervisor',
    'inspector_administrativo'
  );
$$;

create or replace function public.rt_user_can_admin()
returns boolean
language sql
stable
as $$
  select public.current_role_code() = 'admin';
$$;

create or replace function public.rt_bus_terminal_id(target_bus_id uuid)
returns uuid
language sql
stable
as $$
  select terminal_id
  from public.buses
  where id = target_bus_id;
$$;

create or replace function public.rt_has_access_to_bus(target_bus_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.buses b
    where b.id = target_bus_id
      and public.has_terminal_access(b.terminal_id)
  );
$$;

create table if not exists public.rt_plantas_revisoras (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  codigo text not null unique,
  direccion text,
  comuna text,
  region text,
  telefono text,
  correo text,
  activa boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.rt_envios (
  id uuid primary key default gen_random_uuid(),
  bus_id uuid not null references public.buses(id),
  envio_origen_id uuid references public.rt_envios(id),
  rechazo_origen_id uuid,
  tipo_envio text not null check (tipo_envio in ('PRIMERA_REVISION', 'REINSPECCION')),
  fecha_hora_salida timestamptz not null,
  planta_revisora_id uuid not null references public.rt_plantas_revisoras(id),
  terminal_salida_id uuid not null references public.terminals(id),
  conductor_id uuid references public.personnel(id),
  conductor_nombre text not null,
  kilometraje_salida integer not null check (kilometraje_salida >= 0),
  motivo_envio text not null,
  observaciones text,
  estado text not null check (
    estado in (
      'PENDIENTE_ENVIO',
      'ENVIADO_PRIMERA_REVISION',
      'ENVIADO_REINSPECCION',
      'EN_PLANTA_REVISORA',
      'RECIBIDO_PENDIENTE_DOCUMENTO',
      'DOCUMENTO_PENDIENTE_VALIDACION',
      'RECHAZADO',
      'EN_REPARACION',
      'REPARACION_FINALIZADA',
      'APROBADO',
      'VIGENTE',
      'PROXIMO_A_VENCER',
      'VENCIDO',
      'ENVIO_CANCELADO'
    )
  ),
  usuario_registro_id uuid not null references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  cancelled_at timestamptz,
  cancelled_by uuid references public.profiles(id),
  motivo_cancelacion text
);

create table if not exists public.rt_recepciones (
  id uuid primary key default gen_random_uuid(),
  envio_id uuid not null unique references public.rt_envios(id),
  fecha_hora_llegada timestamptz not null,
  terminal_recepcion_id uuid not null references public.terminals(id),
  kilometraje_llegada integer not null check (kilometraje_llegada >= 0),
  resultado text not null check (resultado in ('APROBADO', 'RECHAZADO', 'PENDIENTE')),
  fecha_revision date,
  fecha_vencimiento date,
  folio_documento text,
  numero_certificado text,
  planta_detectada text,
  observaciones text,
  usuario_registro_id uuid not null references public.profiles(id),
  validado_por_id uuid references public.profiles(id),
  fecha_validacion timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.rt_motivos_rechazo (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  categoria text not null,
  componente text not null,
  descripcion text not null,
  gravedad text not null check (gravedad in ('BAJA', 'MEDIA', 'ALTA', 'CRITICA')),
  activo boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.rt_rechazos (
  id uuid primary key default gen_random_uuid(),
  recepcion_id uuid not null references public.rt_recepciones(id) on delete cascade,
  motivo_rechazo_id uuid references public.rt_motivos_rechazo(id),
  codigo_documento text,
  categoria text not null,
  componente text not null,
  descripcion text not null,
  gravedad text not null check (gravedad in ('BAJA', 'MEDIA', 'ALTA', 'CRITICA')),
  estado_reparacion text not null default 'PENDIENTE' check (
    estado_reparacion in (
      'PENDIENTE',
      'EN_REPARACION',
      'REPARACION_FINALIZADA',
      'PENDIENTE_REINSPECCION',
      'CERRADO'
    )
  ),
  responsable_reparacion_id uuid references public.personnel(id),
  fecha_inicio_reparacion timestamptz,
  fecha_fin_reparacion timestamptz,
  observaciones_reparacion text,
  evidencia_reparacion_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.rt_envios
  add constraint rt_envios_rechazo_origen_fk
  foreign key (rechazo_origen_id) references public.rt_rechazos(id);

create table if not exists public.rt_documentos (
  id uuid primary key default gen_random_uuid(),
  envio_id uuid references public.rt_envios(id) on delete set null,
  recepcion_id uuid references public.rt_recepciones(id) on delete set null,
  bus_id uuid not null references public.buses(id),
  storage_bucket text not null default 'revisiones-tecnicas',
  storage_path text not null,
  nombre_original text not null,
  nombre_generado text not null,
  extension text not null,
  mime_type text not null,
  tamano_bytes bigint not null check (tamano_bytes >= 0),
  hash_sha256 text not null,
  tipo_documento text not null,
  estado_procesamiento text not null check (
    estado_procesamiento in (
      'PENDIENTE',
      'PROCESANDO',
      'PROCESADO',
      'REQUIERE_REVISION',
      'VALIDADO',
      'ERROR'
    )
  ),
  estado_validacion text not null check (
    estado_validacion in ('PENDIENTE', 'VALIDADO', 'RECHAZADO')
  ),
  motor_ocr text,
  version_motor_ocr text,
  texto_extraido text,
  resultado_ocr jsonb not null default '{}'::jsonb,
  confianza_general numeric(5,4) check (confianza_general between 0 and 1),
  usuario_carga_id uuid not null references public.profiles(id),
  fecha_carga timestamptz not null default timezone('utc', now()),
  procesado_at timestamptz,
  validado_at timestamptz,
  validado_por_id uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.rt_campos_extraidos (
  id uuid primary key default gen_random_uuid(),
  documento_id uuid not null references public.rt_documentos(id) on delete cascade,
  nombre_campo text not null,
  valor_ocr text,
  valor_confirmado text,
  confianza numeric(5,4) check (confianza between 0 and 1),
  pagina integer not null default 1 check (pagina > 0),
  coordenadas jsonb,
  corregido_manualmente boolean not null default false,
  corregido_por_id uuid references public.profiles(id),
  corregido_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.rt_historial_estados (
  id uuid primary key default gen_random_uuid(),
  bus_id uuid not null references public.buses(id),
  envio_id uuid references public.rt_envios(id) on delete set null,
  recepcion_id uuid references public.rt_recepciones(id) on delete set null,
  estado_anterior text,
  estado_nuevo text not null,
  motivo text,
  observaciones text,
  usuario_id uuid references public.profiles(id),
  fecha_hora timestamptz not null default timezone('utc', now()),
  datos_adicionales jsonb not null default '{}'::jsonb
);

create table if not exists public.rt_configuracion (
  id uuid primary key default gen_random_uuid(),
  config_key text not null unique,
  config_value jsonb not null,
  descripcion text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_rt_plantas_codigo on public.rt_plantas_revisoras(codigo);
create index if not exists idx_rt_envios_bus on public.rt_envios(bus_id);
create index if not exists idx_rt_envios_terminal on public.rt_envios(terminal_salida_id);
create index if not exists idx_rt_envios_estado on public.rt_envios(estado);
create index if not exists idx_rt_envios_salida on public.rt_envios(fecha_hora_salida desc);
create unique index if not exists uq_rt_envios_bus_abierto
  on public.rt_envios(bus_id)
  where cancelled_at is null
    and estado in (
      'PENDIENTE_ENVIO',
      'ENVIADO_PRIMERA_REVISION',
      'ENVIADO_REINSPECCION',
      'EN_PLANTA_REVISORA',
      'RECIBIDO_PENDIENTE_DOCUMENTO',
      'DOCUMENTO_PENDIENTE_VALIDACION',
      'EN_REPARACION',
      'REPARACION_FINALIZADA',
      'PROXIMO_A_VENCER'
    );
create index if not exists idx_rt_recepciones_llegada on public.rt_recepciones(fecha_hora_llegada desc);
create index if not exists idx_rt_recepciones_resultado on public.rt_recepciones(resultado);
create unique index if not exists uq_rt_recepciones_folio
  on public.rt_recepciones(folio_documento)
  where folio_documento is not null;
create unique index if not exists uq_rt_recepciones_certificado
  on public.rt_recepciones(numero_certificado)
  where numero_certificado is not null;
create index if not exists idx_rt_rechazos_recepcion on public.rt_rechazos(recepcion_id);
create index if not exists idx_rt_rechazos_estado_reparacion on public.rt_rechazos(estado_reparacion);
create index if not exists idx_rt_documentos_bus on public.rt_documentos(bus_id);
create index if not exists idx_rt_documentos_recepcion on public.rt_documentos(recepcion_id);
create index if not exists idx_rt_documentos_hash on public.rt_documentos(hash_sha256);
create unique index if not exists uq_rt_documentos_hash_sha256 on public.rt_documentos(hash_sha256);
create index if not exists idx_rt_documentos_estado_procesamiento on public.rt_documentos(estado_procesamiento);
create index if not exists idx_rt_campos_extraidos_documento on public.rt_campos_extraidos(documento_id);
create index if not exists idx_rt_historial_estados_bus_fecha on public.rt_historial_estados(bus_id, fecha_hora desc);

create trigger set_updated_at_rt_plantas_revisoras before update on public.rt_plantas_revisoras
for each row execute function public.set_updated_at();
create trigger set_updated_at_rt_envios before update on public.rt_envios
for each row execute function public.set_updated_at();
create trigger set_updated_at_rt_recepciones before update on public.rt_recepciones
for each row execute function public.set_updated_at();
create trigger set_updated_at_rt_motivos_rechazo before update on public.rt_motivos_rechazo
for each row execute function public.set_updated_at();
create trigger set_updated_at_rt_rechazos before update on public.rt_rechazos
for each row execute function public.set_updated_at();
create trigger set_updated_at_rt_documentos before update on public.rt_documentos
for each row execute function public.set_updated_at();
create trigger set_updated_at_rt_campos_extraidos before update on public.rt_campos_extraidos
for each row execute function public.set_updated_at();
create trigger set_updated_at_rt_configuracion before update on public.rt_configuracion
for each row execute function public.set_updated_at();

create or replace function public.rt_log_envio_state_change()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' or old.estado is distinct from new.estado then
    insert into public.rt_historial_estados (
      bus_id,
      envio_id,
      estado_anterior,
      estado_nuevo,
      motivo,
      observaciones,
      usuario_id,
      datos_adicionales
    )
    values (
      new.bus_id,
      new.id,
      case when tg_op = 'INSERT' then null else old.estado end,
      new.estado,
      'CAMBIO_ESTADO_ENVIO',
      new.observaciones,
      coalesce(new.usuario_registro_id, auth.uid()),
      jsonb_build_object(
        'tipo_envio', new.tipo_envio,
        'terminal_salida_id', new.terminal_salida_id,
        'planta_revisora_id', new.planta_revisora_id
      )
    );
  end if;

  return new;
end;
$$;

create or replace function public.rt_log_recepcion_state_change()
returns trigger
language plpgsql
as $$
declare
  current_bus_id uuid;
  previous_state text;
  next_state text;
begin
  select e.bus_id, e.estado
  into current_bus_id, previous_state
  from public.rt_envios e
  where e.id = new.envio_id;

  next_state := case
    when new.resultado = 'APROBADO' then 'APROBADO'
    when new.resultado = 'RECHAZADO' then 'RECHAZADO'
    else 'DOCUMENTO_PENDIENTE_VALIDACION'
  end;

  if tg_op = 'INSERT' or old.resultado is distinct from new.resultado then
    insert into public.rt_historial_estados (
      bus_id,
      envio_id,
      recepcion_id,
      estado_anterior,
      estado_nuevo,
      motivo,
      observaciones,
      usuario_id,
      datos_adicionales
    )
    values (
      current_bus_id,
      new.envio_id,
      new.id,
      previous_state,
      next_state,
      'REGISTRO_RECEPCION',
      new.observaciones,
      coalesce(new.usuario_registro_id, auth.uid()),
      jsonb_build_object(
        'resultado', new.resultado,
        'folio_documento', new.folio_documento,
        'numero_certificado', new.numero_certificado
      )
    );
  end if;

  return new;
end;
$$;

drop trigger if exists rt_log_envio_state_change on public.rt_envios;
create trigger rt_log_envio_state_change
after insert or update on public.rt_envios
for each row execute function public.rt_log_envio_state_change();

drop trigger if exists rt_log_recepcion_state_change on public.rt_recepciones;
create trigger rt_log_recepcion_state_change
after insert or update on public.rt_recepciones
for each row execute function public.rt_log_recepcion_state_change();

create or replace view public.rt_envios_abiertos as
select
  e.id,
  e.bus_id,
  b.ppu,
  b.internal_number,
  b.terminal_id,
  e.tipo_envio,
  e.fecha_hora_salida,
  e.estado,
  e.planta_revisora_id
from public.rt_envios e
join public.buses b on b.id = e.bus_id
where e.cancelled_at is null
  and e.estado in (
    'PENDIENTE_ENVIO',
    'ENVIADO_PRIMERA_REVISION',
    'ENVIADO_REINSPECCION',
    'EN_PLANTA_REVISORA',
    'RECIBIDO_PENDIENTE_DOCUMENTO',
    'DOCUMENTO_PENDIENTE_VALIDACION',
    'EN_REPARACION',
    'REPARACION_FINALIZADA'
  );

create or replace view public.rt_resumen_flotas as
select
  b.id as bus_id,
  b.terminal_id,
  b.ppu,
  b.internal_number,
  latest_envio.estado as estado_actual,
  latest_recepcion.resultado as ultimo_resultado,
  latest_recepcion.fecha_vencimiento,
  (
    select count(*)
    from public.rt_envios re
    where re.bus_id = b.id
  ) as cantidad_intentos,
  (
    select count(*)
    from public.rt_rechazos rr
    join public.rt_recepciones r on r.id = rr.recepcion_id
    join public.rt_envios e on e.id = r.envio_id
    where e.bus_id = b.id
  ) as cantidad_rechazos
from public.buses b
left join lateral (
  select estado
  from public.rt_envios e
  where e.bus_id = b.id
  order by e.fecha_hora_salida desc
  limit 1
) latest_envio on true
left join lateral (
  select resultado, fecha_vencimiento
  from public.rt_recepciones r
  join public.rt_envios e on e.id = r.envio_id
  where e.bus_id = b.id
  order by r.fecha_hora_llegada desc
  limit 1
) latest_recepcion on true;

insert into public.rt_configuracion (config_key, config_value, descripcion)
values
  ('warning_days', '{"days":21}'::jsonb, 'Dias de advertencia para proximos vencimientos.'),
  ('max_file_size_mb', '{"value":15}'::jsonb, 'Tamano maximo permitido por archivo.'),
  ('allowed_formats', '{"items":["application/pdf","image/jpeg","image/png"]}'::jsonb, 'Tipos de archivo permitidos para OCR.'),
  ('ocr_min_confidence', '{"value":0.75}'::jsonb, 'Confianza minima para marcar campos sin revision manual.'),
  ('validation_required', '{"value":true}'::jsonb, 'La confirmacion humana es obligatoria para cerrar la recepcion.'),
  ('document_types', '{"items":["CERTIFICADO_APROBADO","INFORME_RECHAZO","CERTIFICADO_REINSPECCION","OTRO_RESPALDO"]}'::jsonb, 'Catalogo de tipos documentales.'),
  ('states', '{"items":["PENDIENTE_ENVIO","ENVIADO_PRIMERA_REVISION","ENVIADO_REINSPECCION","EN_PLANTA_REVISORA","RECIBIDO_PENDIENTE_DOCUMENTO","DOCUMENTO_PENDIENTE_VALIDACION","RECHAZADO","EN_REPARACION","REPARACION_FINALIZADA","APROBADO","VIGENTE","PROXIMO_A_VENCER","VENCIDO","ENVIO_CANCELADO"]}'::jsonb, 'Estados base del modulo.'),
  ('alert_parameters', '{"notify_once":true,"late_repair_days":2}'::jsonb, 'Ajustes de alertas del modulo.')
on conflict (config_key) do update
set config_value = excluded.config_value,
    descripcion = excluded.descripcion;

alter table public.rt_plantas_revisoras enable row level security;
alter table public.rt_envios enable row level security;
alter table public.rt_recepciones enable row level security;
alter table public.rt_motivos_rechazo enable row level security;
alter table public.rt_rechazos enable row level security;
alter table public.rt_documentos enable row level security;
alter table public.rt_campos_extraidos enable row level security;
alter table public.rt_historial_estados enable row level security;
alter table public.rt_configuracion enable row level security;

drop policy if exists "RT plantas read" on public.rt_plantas_revisoras;
create policy "RT plantas read"
on public.rt_plantas_revisoras for select
using (public.rt_user_can_read() or public.rt_user_can_operate() or public.rt_user_can_admin());

drop policy if exists "RT plantas admin" on public.rt_plantas_revisoras;
create policy "RT plantas admin"
on public.rt_plantas_revisoras for all
using (public.rt_user_can_admin())
with check (public.rt_user_can_admin());

drop policy if exists "RT envios read" on public.rt_envios;
create policy "RT envios read"
on public.rt_envios for select
using (public.rt_has_access_to_bus(bus_id));

drop policy if exists "RT envios write" on public.rt_envios;
create policy "RT envios write"
on public.rt_envios for all
using (public.rt_user_can_operate() and public.rt_has_access_to_bus(bus_id))
with check (
  public.rt_user_can_operate()
  and public.rt_has_access_to_bus(bus_id)
  and public.has_terminal_access(terminal_salida_id)
);

drop policy if exists "RT recepciones read" on public.rt_recepciones;
create policy "RT recepciones read"
on public.rt_recepciones for select
using (
  exists (
    select 1
    from public.rt_envios e
    where e.id = rt_recepciones.envio_id
      and public.rt_has_access_to_bus(e.bus_id)
  )
);

drop policy if exists "RT recepciones write" on public.rt_recepciones;
create policy "RT recepciones write"
on public.rt_recepciones for all
using (
  public.rt_user_can_operate()
  and exists (
    select 1
    from public.rt_envios e
    where e.id = rt_recepciones.envio_id
      and public.rt_has_access_to_bus(e.bus_id)
  )
)
with check (
  public.rt_user_can_operate()
  and public.has_terminal_access(terminal_recepcion_id)
);

drop policy if exists "RT motivos read" on public.rt_motivos_rechazo;
create policy "RT motivos read"
on public.rt_motivos_rechazo for select
using (public.rt_user_can_read() or public.rt_user_can_operate() or public.rt_user_can_admin());

drop policy if exists "RT motivos admin" on public.rt_motivos_rechazo;
create policy "RT motivos admin"
on public.rt_motivos_rechazo for all
using (public.rt_user_can_admin())
with check (public.rt_user_can_admin());

drop policy if exists "RT rechazos read" on public.rt_rechazos;
create policy "RT rechazos read"
on public.rt_rechazos for select
using (
  exists (
    select 1
    from public.rt_recepciones r
    join public.rt_envios e on e.id = r.envio_id
    where r.id = rt_rechazos.recepcion_id
      and public.rt_has_access_to_bus(e.bus_id)
  )
);

drop policy if exists "RT rechazos write" on public.rt_rechazos;
create policy "RT rechazos write"
on public.rt_rechazos for all
using (
  public.rt_user_can_operate()
  and exists (
    select 1
    from public.rt_recepciones r
    join public.rt_envios e on e.id = r.envio_id
    where r.id = rt_rechazos.recepcion_id
      and public.rt_has_access_to_bus(e.bus_id)
  )
)
with check (public.rt_user_can_operate());

drop policy if exists "RT documentos read" on public.rt_documentos;
create policy "RT documentos read"
on public.rt_documentos for select
using (public.rt_has_access_to_bus(bus_id));

drop policy if exists "RT documentos write" on public.rt_documentos;
create policy "RT documentos write"
on public.rt_documentos for all
using (
  (public.rt_user_can_operate() or public.rt_user_can_validate())
  and public.rt_has_access_to_bus(bus_id)
)
with check (
  (public.rt_user_can_operate() or public.rt_user_can_validate())
  and public.rt_has_access_to_bus(bus_id)
);

drop policy if exists "RT campos read" on public.rt_campos_extraidos;
create policy "RT campos read"
on public.rt_campos_extraidos for select
using (
  exists (
    select 1
    from public.rt_documentos d
    where d.id = rt_campos_extraidos.documento_id
      and public.rt_has_access_to_bus(d.bus_id)
  )
);

drop policy if exists "RT campos write" on public.rt_campos_extraidos;
create policy "RT campos write"
on public.rt_campos_extraidos for all
using (
  public.rt_user_can_validate()
  and exists (
    select 1
    from public.rt_documentos d
    where d.id = rt_campos_extraidos.documento_id
      and public.rt_has_access_to_bus(d.bus_id)
  )
)
with check (public.rt_user_can_validate());

drop policy if exists "RT historial read" on public.rt_historial_estados;
create policy "RT historial read"
on public.rt_historial_estados for select
using (public.rt_has_access_to_bus(bus_id));

drop policy if exists "RT historial write" on public.rt_historial_estados;
create policy "RT historial write"
on public.rt_historial_estados for insert
with check (
  (public.rt_user_can_operate() or public.rt_user_can_validate())
  and public.rt_has_access_to_bus(bus_id)
);

drop policy if exists "RT config read" on public.rt_configuracion;
create policy "RT config read"
on public.rt_configuracion for select
using (public.rt_user_can_read() or public.rt_user_can_operate() or public.rt_user_can_admin());

drop policy if exists "RT config admin" on public.rt_configuracion;
create policy "RT config admin"
on public.rt_configuracion for all
using (public.rt_user_can_admin())
with check (public.rt_user_can_admin());

insert into storage.buckets (id, name, public)
values ('revisiones-tecnicas', 'revisiones-tecnicas', false)
on conflict (id) do nothing;

drop policy if exists "RT storage read" on storage.objects;
create policy "RT storage read"
on storage.objects for select
using (
  bucket_id = 'revisiones-tecnicas'
  and public.has_terminal_access(((storage.foldername(name))[1])::uuid)
);

drop policy if exists "RT storage insert" on storage.objects;
create policy "RT storage insert"
on storage.objects for insert
with check (
  bucket_id = 'revisiones-tecnicas'
  and (public.rt_user_can_operate() or public.rt_user_can_validate())
  and public.has_terminal_access(((storage.foldername(name))[1])::uuid)
);

drop policy if exists "RT storage update" on storage.objects;
create policy "RT storage update"
on storage.objects for update
using (
  bucket_id = 'revisiones-tecnicas'
  and (public.rt_user_can_operate() or public.rt_user_can_validate())
  and public.has_terminal_access(((storage.foldername(name))[1])::uuid)
);

drop policy if exists "RT storage delete" on storage.objects;
create policy "RT storage delete"
on storage.objects for delete
using (
  bucket_id = 'revisiones-tecnicas'
  and public.rt_user_can_admin()
);
