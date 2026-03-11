# Panel de Consultas

Aplicacin interna construida con Vite, React, TypeScript, TailwindCSS y Supabase para visualizar consultas recibidas desde la tabla `public.contacto` y gestionar su estado.

## Stack

- Vite
- React 19
- TypeScript
- TailwindCSS 4 con plugin de Vite
- `@supabase/supabase-js`

## Variables de entorno

La app necesita estas variables en un archivo `.env.local`:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon
VITE_PANEL_AUTH_USERNAME=admin
VITE_PANEL_AUTH_PASSWORD=panel1234
```

Puedes partir de `.env.example`.

Si no defines `VITE_PANEL_AUTH_USERNAME` y `VITE_PANEL_AUTH_PASSWORD`, el acceso local usa por defecto `admin / panel1234`.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Alcance funcional

- Listado ordenado por `created_at desc`
- Bsqueda por nombre o email
- Filtro por estado (`Pendiente`, `En progreso`, `Resuelta`)
- Tabla con headers fijos para escritorio
- Vista en cards para mvil
- Modal con mensaje completo
- Cambio de estado a `En progreso` o `Resuelta` desde el detalle
- Eliminacin irreversible de consultas desde el detalle
- Mtricas simples del panel

## Notas de integracin

- La app permite actualizar el campo `estado` y eliminar consultas desde el modal de detalle.
- Se asume que la tabla `public.contacto` tiene polticas RLS que permiten lectura, update del campo `estado` y delete con la anon key usada por el panel.
- Si faltan credenciales o la poltica RLS bloquea el acceso, el dashboard muestra un estado de error recuperable.
