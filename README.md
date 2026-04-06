# Panel de Consultas y Noticias

Aplicacion interna construida con Vite, React, TypeScript, TailwindCSS y Supabase para visualizar consultas recibidas desde la tabla `public.contacto` y gestionar su estado, y para administrar noticias almacenadas en `public.noticias`.

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

- Navbar superior simple con accesos a `Consultas` y `Noticias`
- Ruta raiz `/` dedicada a consultas
- Listado ordenado por `created_at desc`
- Bsqueda por nombre o email
- Filtro por estado (`Pendiente`, `En progreso`, `Resuelta`)
- Tabla con headers fijos para escritorio
- Vista en cards para mvil
- Modal con mensaje completo
- Cambio de estado a `En progreso` o `Resuelta` desde el detalle
- Eliminacin irreversible de consultas desde el detalle
- Mtricas simples del panel
- CRUD completo de noticias con `titulo`, `descripcion`, `fecha` e imagen unica
- Upload de imagenes de noticias a Supabase Storage en el bucket `noticias`
- Orden de noticias por `fecha desc`, y por `created_at desc` como desempate

## Notas de integracin

- La app permite actualizar el campo `estado` y eliminar consultas desde el modal de detalle.
- Se asume que la tabla `public.contacto` tiene polticas RLS que permiten lectura, update del campo `estado` y delete con la anon key usada por el panel.
- La seccion `Noticias` espera una tabla `public.noticias` y un bucket publico `noticias` creados desde las migraciones de `supabase/migrations`.
- La web externa puede consumir las noticias directamente desde Supabase usando la tabla `public.noticias` y el campo `imageUrl`.
- Las politicas de `noticias` y del bucket `noticias` permiten escrituras con `anon`, por lo que el login visual del panel no constituye una proteccion fuerte por si solo.
- Si faltan credenciales o la poltica RLS bloquea el acceso, el dashboard muestra un estado de error recuperable.
