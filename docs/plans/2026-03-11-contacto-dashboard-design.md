# Diseo: Dashboard de Consultas de Contacto

## Objetivo

Construir un panel interno para visualizar las consultas almacenadas en `public.contacto`, con foco en lectura rpida, bsqueda por nombre o email, detalle completo del mensaje y actualizacin simple de estado.

## Decisiones

- SPA con Vite, React, TypeScript y TailwindCSS.
- Integracin cliente directo con Supabase mediante `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
- Orden por `created_at desc` resuelto en la query.
- Bsqueda server-side por `nombrecompleto` y `email`.
- Paleta anclada en `#2596be` y `#fff`, usando transparencias del azul como soporte visual.

## UX

- Header editorial con contexto del panel y origen de datos.
- Tarjetas de mtricas simples para total, ltimas 24 horas, resultados actuales y ltima recepcin.
- Tabla con headers fijos en escritorio.
- Cards en mvil para mantener legibilidad.
- Modal para ver el mensaje completo y metadatos.
- Cambio de estado desde el modal a `En progreso` o `Resuelta`.

## Verificacin prevista

- Carga correcta desde Supabase.
- Bsqueda por nombre y email.
- Orden descendente por fecha.
- Responsive en escritorio y mvil.
- Build de produccin sin errores.