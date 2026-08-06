# Diseño de Base de Datos

## Enfoque general

- `UUID` como clave primaria.
- `created_at`, `updated_at`, `created_by`, `updated_by` en tablas principales.
- `deleted_at` para borrado lógico cuando aplique.
- Índices por `terminal_id`, `status`, `scheduled_date`, `bus_id` y `personnel_id`.

## Núcleo fundacional incluido en la migración inicial

- `roles`
- `profiles`
- `terminals`
- `user_terminal_access`
- `bus_brands`
- `bus_models`
- `buses`
- `personnel`
- `shifts`
- `tasks`
- `task_evidences`
- `audit_logs`
- `notifications`
- `document_types`
- `bus_documents`
- `rtg_processes`

## Tablas proyectadas por módulo

### Seguridad y administración

- `permissions`
- `role_permissions`
- `app_settings`

### Turnos y tareas

- `shift_personnel`
- `task_categories`
- `task_templates`
- `task_assignments`
- `task_status_history`
- `shift_handover_items`

### Asistencia

- `attendance_records`

### Cargas

- `diesel_loads`
- `electric_charges`
- `bus_shift_programming`
- `bus_no_load_reviews`

### Checklists y levantamientos

- `checklist_templates`
- `checklist_template_items`
- `bus_checklists`
- `bus_checklist_results`
- `inspection_campaigns`
- `inspections`
- `inspection_results`

### Reuniones

- `meetings`
- `meeting_attendees`
- `meeting_documents`
- `meeting_commitments`

### Combustible y contenedores

- `fuel_suppliers`
- `fuel_truck_receptions`
- `fuel_reception_evidences`
- `waste_containers`
- `waste_container_changes`

### RTG y documentación

- `bus_document_status_history`
- `rtg_status_history`
- `rtg_evidences`

### Informes e importaciones

- `report_exports`
- `data_imports`
- `data_import_errors`

## Reglas importantes

- `buses`: unicidad combinada `internal_number + ppu`.
- `terminals`: código único por terminal.
- `personnel`: correo único solo cuando exista.
- `tasks`: estado, prioridad, terminal y turno siempre consultables por índice.
- `bus_documents`: alertas calculables por fecha de vencimiento.

## RLS

- Cada tabla operativa con `terminal_id` debe filtrar por terminal autorizado.
- `profiles` y `user_terminal_access` deben ser administrados por roles con alcance superior.
- Evidencias y documentos no deben exponerse públicamente.

## Observación de esta etapa

La migración actual prioriza la base técnica necesaria para levantar los módulos iniciales. Las tablas restantes deben agregarse por entregas sucesivas, manteniendo versionado SQL y pruebas de regresión.
