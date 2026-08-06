# Despliegue en Render y Supabase

## Arquitectura

- `logicontrol360`: aplicacion web `Next.js 16` con `npm run build` y `npm run start`.
- `logicontrol360-ocr`: servicio OCR `FastAPI` ubicado en `services/revisiones-tecnicas-ocr`.
- `Supabase`: autenticacion, base de datos y storage.

## Variables clave

Las variables publicas `NEXT_PUBLIC_*` deben quedar definidas antes del build de la app web.

Variables obligatorias para la web:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`
- `SUPABASE_DB_URL`
- `BACKEND_URL`

Variables obligatorias para OCR:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`
- `FRONTEND_URL`
- `BACKEND_URL`

Variables con valor por defecto ya declaradas en `render.yaml`:

- `NEXT_PUBLIC_APP_NAME=LogiControl360`
- `SUPABASE_STORAGE_BUCKET=revisiones-tecnicas`
- `OCR_ENGINE=paddleocr`
- `OCR_LANGUAGE=es`
- `OCR_MIN_CONFIDENCE=0.75`
- `MAX_FILE_SIZE_MB=15`
- `ALLOWED_FILE_TYPES=application/pdf,image/jpeg,image/png`
- `ENVIRONMENT=production`
- `LOG_LEVEL=INFO`
- `APP_TIMEZONE=America/Santiago`

## Preparar Supabase

1. Crear el proyecto de Supabase para produccion.
2. Obtener `Project URL`, `anon key`, `service_role key` y `JWT secret`.
3. Crear el bucket privado `revisiones-tecnicas`.
4. Instalar y autenticar la CLI:

```bash
supabase login
supabase link --project-ref <project-ref>
```

5. Validar las migraciones localmente antes de tocar remoto:

```bash
supabase db reset
supabase migration list
```

6. Publicar el esquema al proyecto remoto:

```bash
supabase db push
```

## Preparar Render

1. Conectar el repositorio `metriccodevrv-creator/LogiControl360` en Render.
2. Crear un `Blueprint` usando el archivo `render.yaml`.
3. Completar todas las variables marcadas con `sync: false`.
4. Confirmar que la web use la URL publica del OCR en `BACKEND_URL`.
5. Confirmar que el OCR use la URL publica de la web en `FRONTEND_URL`.

## Flujo recomendado de despliegue

1. Subir cambios al branch `main`.
2. Ejecutar migraciones con `supabase db push`.
3. Verificar en Render que ambos servicios queden `healthy`.
4. Probar:
   - `/api/health` en la web.
   - `/health` en OCR.
   - login real con Supabase.
   - carga de flota desde archivo y deduplicacion antes de guardar.

## Notas operativas

- `render.yaml` deja secretos como placeholders para no versionar credenciales.
- Si cambias una variable `NEXT_PUBLIC_*`, Render debe reconstruir la web para reflejarla.
- Si ya existe un Blueprint en Render, las variables con `sync: false` se actualizan manualmente desde el panel.
