# Matriz de Permisos

## Roles

- `admin`
- `supervisor`
- `inspector`
- `inspector_administrativo`
- `planillero`
- `cleaner`
- `consulta`

## Resumen por capacidad

| Capacidad | admin | supervisor | inspector | inspector_administrativo | planillero | cleaner | consulta |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Dashboard | Si | Si | Si | Si | Si | Si | Si |
| Gestión de turnos | Si | Si | No | No | No | No | No |
| Gestión de tareas | Si | Si | Ejecuta propias | No | Ejecuta propias | Ejecuta propias | No |
| Flota | Si | Lectura | Lectura | Admin documental | Lectura | Lectura | Lectura |
| Personal | Si | Lectura | No | No | No | No | No |
| Terminales | Si | Lectura | No | No | No | No | No |
| Documentación | Si | Lectura | Lectura acotada | Si | No | No | Lectura |
| RTG | Si | Lectura | No | Si | No | No | Lectura |
| Administración | Si | Lectura parcial | No | No | No | No | No |
| Informes | Si | Si | No | Si | No | No | Si |
| Auditoría | Si | No | No | No | No | No | No |

## Permisos técnicos usados en la base inicial

- `dashboard.read`
- `brand.read`
- `notifications.read`
- `reports.read`
- `shifts.read`
- `shifts.manage`
- `tasks.read`
- `tasks.manage`
- `tasks.execute`
- `fleet.read`
- `fleet.manage`
- `personnel.read`
- `personnel.manage`
- `terminals.read`
- `terminals.manage`
- `documents.read`
- `documents.manage`
- `rtg.read`
- `rtg.manage`
- `administration.read`
- `administration.manage`

## Regla de seguridad

- Todo permiso UI debe tener espejo en servidor y, cuando corresponda, en políticas RLS.
- La UI no es una barrera suficiente por sí sola.
