# LogiControl360

Plataforma integral para la gestion logistica, operacional y administrativa de terminales de buses.

## Stack base

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Tailwind CSS`
- `Supabase`
- `React Hook Form + Zod`
- `Recharts`

## Estado actual

Base inicial entregada el jueves 30 de julio de 2026 con:

- arquitectura y documentacion fundacional;
- branding SVG y guia interna de marca;
- layout operativo y dashboard inicial;
- auth preparada para Supabase;
- rutas principales de la plataforma;
- modulos base de administracion para terminales, flota y personal;
- migracion fundacional para Supabase.

## Comandos

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Variables de entorno

Usa `.env.example` como base.

## Documentacion

- `docs/architecture.md`
- `docs/database-design.md`
- `docs/permissions-matrix.md`
- `docs/development-plan.md`
- `docs/deployment-render-supabase.md`

## Despliegue

- `render.yaml` deja preparados los servicios de web y OCR para Render.
- `docs/deployment-render-supabase.md` describe variables, buckets y migraciones.
- Las migraciones de Supabase viven en `supabase/migrations/` y se publican con `supabase db push`.
- `/api/health` expone un health check simple.
