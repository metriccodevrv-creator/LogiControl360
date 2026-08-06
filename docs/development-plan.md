# Plan de Desarrollo

## Etapa 1 · Base técnica

- `Next.js + TypeScript + Tailwind` configurado.
- Branding SVG y guía `/marca`.
- Layout principal y dashboard inicial.
- Auth preparada para Supabase.
- Migración fundacional de base de datos.

## Etapa 2 · Turnos y tareas

- CRUD de turnos.
- Asignación de personal por turno.
- Gestión de tareas y plantillas.
- Evidencias privadas y validación.
- Estado del turno y cierre auditado.

## Etapa 3 · Flota y personal

- CRUD real de buses.
- CRUD real de personal.
- Importaciones Excel/CSV.
- Historial por bus y por persona.

## Etapa 4 · Cargas y controles

- Diésel.
- Eléctricos.
- Buses sin carga.
- Checklists.
- Levantamientos.

## Etapa 5 · Complementarios

- Reuniones.
- Recepción de combustible.
- Contenedores.

## Etapa 6 · Documentación y RTG

- Tipos documentales.
- Alertas de vencimiento.
- Flujo completo RTG.

## Etapa 7 · Informes

- Dashboard general.
- Dashboard flota.
- Dashboard diésel.
- Dashboard eléctricos.
- Excel corporativo.
- PDF corporativo.

## Etapa 8 · Producción

- Pruebas.
- GitHub Actions.
- Render.
- Hardening de seguridad.
- Observabilidad.

## Criterio operativo

No avanzar de etapa si `lint`, `typecheck` o `build` quedan fallando.
