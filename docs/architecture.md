# LogiControl360 · Arquitectura Inicial

## Objetivo

LogiControl360 se plantea como una plataforma web multi-terminal para coordinar operaciones, documentación, trazabilidad y control administrativo de terminales de buses.

## Principios técnicos

- `Next.js` con `App Router` para separar flujos autenticados y públicos.
- `TypeScript` estricto con reglas enfocadas en dominio y mantenibilidad.
- UI modular por capas:
  - `src/app`: composición de rutas y layouts.
  - `src/components`: piezas visuales reutilizables.
  - `src/features`: lógica específica por dominio o módulo.
  - `src/lib`: infraestructura transversal, auth, permisos, fechas y Supabase.
- Base de datos en `Supabase/PostgreSQL` con RLS desde el inicio.
- Almacenamiento privado para evidencias y documentos con URLs firmadas.

## Estructura de alto nivel

```text
src/
  app/
    (auth)/
    (app)/
    api/
  components/
    brand/
    charts/
    forms/
    layout/
    tables/
    ui/
  config/
  constants/
  features/
  lib/
    auth/
    dates/
    permissions/
    supabase/
  types/
docs/
supabase/
  migrations/
  seed/
public/
  brand/
  icons/
tests/
```

## Estrategia de autenticación

- `Supabase Auth` como sistema principal.
- Si las variables de entorno no están presentes, la app no habilita acceso autenticado hasta completar la configuración.
- En entorno real:
  - Login por correo y contraseña.
  - Protección por layout en el grupo `(app)`.
  - Resolución de rol y terminales desde metadatos o tablas de perfil.

## Estrategia de permisos

- Matriz basada en permisos explícitos por rol.
- RLS en tablas operacionales.
- Validación adicional en servidor para acciones sensibles.
- Las rutas de lectura se preparan desde el inicio; los flujos de escritura se conectarán por etapas.

## Multi-terminal

- Cada usuario puede tener acceso a uno o más terminales.
- El terminal se considera un filtro de seguridad y de operación.
- Toda entidad operacional relevante debe llevar `terminal_id`.

## Diseño de frontend

- Layout lateral para escritorio con área central de trabajo.
- Jerarquía visual corporativa basada en azul oscuro, turquesa y superficies claras.
- Componentes pequeños, sin concentrar reglas de negocio en vistas.
- Estados vacíos y rutas reservadas listos para crecer módulo por módulo.

## Estrategia de backend

- Operaciones críticas: `Server Actions` o `Route Handlers`.
- Consultas: clientes server-side de Supabase.
- Reportes y generación documental: desde servidor.
- Auditoría: capa transversal asociada a todas las acciones relevantes.

## Etapas ya cubiertas en esta base

- Scaffold de aplicación.
- Layout operativo y branding base.
- Dashboard inicial.
- Auth lista para Supabase.
- Rutas principales declaradas.
- Módulos base de administración para terminales, flota y personal.
- Documentación fundacional.
- Migración SQL fundacional.

## Siguientes decisiones operativas

1. Activar proyecto Supabase real y variables de entorno.
2. Ejecutar migración `001_initial_foundation.sql`.
3. Implementar CRUD real de terminales, personal y flota.
4. Continuar con turnos, tareas y evidencias.
