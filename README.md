# LogiControl360

Plataforma integral para la gestión logística, operacional y administrativa de terminales de buses.

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

- arquitectura y documentación fundacional;
- branding SVG y guía interna de marca;
- layout operativo y dashboard inicial;
- auth preparada para Supabase;
- rutas principales de la plataforma;
- módulos base de administración para terminales, flota y personal;
- migración fundacional para Supabase.

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

## Documentación

- `docs/architecture.md`
- `docs/database-design.md`
- `docs/permissions-matrix.md`
- `docs/development-plan.md`

## Despliegue

- `render.yaml` deja preparado el despliegue en Render.
- `/api/health` expone un health check simple.
