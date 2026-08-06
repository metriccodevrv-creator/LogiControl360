insert into public.roles (code, name)
values
  ('admin', 'Administrador general'),
  ('supervisor', 'Supervisor'),
  ('inspector', 'Inspector'),
  ('inspector_administrativo', 'Inspector administrativo'),
  ('planillero', 'Planillero'),
  ('cleaner', 'Cleaner'),
  ('consulta', 'Usuario de consulta')
on conflict (code) do nothing;

insert into public.terminals (code, name, zone, shift_window, is_active)
values
  ('ERB', 'El Roble', 'Zona Norte', '06:00 - 14:00 / 14:00 - 22:00 / 22:00 - 06:00', true),
  ('LEC', 'Lo Echevers', 'Zona Poniente', '07:00 - 15:00 / 15:00 - 23:00 / 23:00 - 07:00', true),
  ('CCL', 'Colo Colo', 'Zona Centro', '06:30 - 14:30 / 14:30 - 22:30 / 22:30 - 06:30', true),
  ('ESA', 'El Salto', 'Zona Oriente', '06:00 - 14:00 / 14:00 - 22:00 / 22:00 - 06:00', false)
on conflict (code) do nothing;
