-- =========================================================
-- RE ORGÁNICO: BASE DE DATOS Y SEGURIDAD DEL PANEL ADMIN
-- Ejecuta este archivo en Supabase > SQL Editor.
-- =========================================================

-- 1. Tabla que define quién tiene permiso administrativo.
create table if not exists public.admin_users (
    user_id uuid primary key references auth.users(id) on delete cascade,
    created_at timestamptz not null default now()
);

-- 2. Catálogo público.
create table if not exists public.productos (
    id text primary key,
    nombre text not null check (char_length(nombre) between 1 and 80),
    precio integer not null default 0 check (precio >= 0),
    categoria text not null check (categoria in ('alimentos', 'cuidado', 'hogar')),
    descripcion text not null check (char_length(descripcion) between 1 and 350),
    emoji text not null default '🌿',
    etiqueta text,
    estado text not null default 'disponible'
        check (estado in ('disponible', 'ultimas', 'pedido', 'agotado')),
    orden integer not null default 0 check (orden >= 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 3. Actualizar automáticamente updated_at.
create or replace function public.actualizar_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists productos_actualizar_fecha on public.productos;
create trigger productos_actualizar_fecha
before update on public.productos
for each row
execute function public.actualizar_updated_at();

-- 4. Permisos mínimos para la API.
grant select on public.productos to anon, authenticated;
grant insert, update, delete on public.productos to authenticated;
grant select on public.admin_users to authenticated;

revoke all on public.admin_users from anon;
revoke insert, update, delete on public.admin_users from authenticated;

-- 5. Activar Row Level Security.
alter table public.productos enable row level security;
alter table public.admin_users enable row level security;

-- 6. Borrar políticas anteriores con estos mismos nombres.
drop policy if exists "catalogo visible para todos" on public.productos;
drop policy if exists "admin puede agregar productos" on public.productos;
drop policy if exists "admin puede editar productos" on public.productos;
drop policy if exists "admin puede eliminar productos" on public.productos;
drop policy if exists "usuario puede comprobar su permiso admin" on public.admin_users;

-- 7. Cualquier visitante puede ver el catálogo.
create policy "catalogo visible para todos"
on public.productos
for select
to anon, authenticated
using (true);

-- 8. Cada usuario autenticado solo puede comprobar si su propio ID es admin.
create policy "usuario puede comprobar su permiso admin"
on public.admin_users
for select
to authenticated
using ((select auth.uid()) = user_id);

-- 9. Solo un usuario registrado en admin_users puede modificar productos.
create policy "admin puede agregar productos"
on public.productos
for insert
to authenticated
with check (
    exists (
        select 1
        from public.admin_users
        where admin_users.user_id = (select auth.uid())
    )
);

create policy "admin puede editar productos"
on public.productos
for update
to authenticated
using (
    exists (
        select 1
        from public.admin_users
        where admin_users.user_id = (select auth.uid())
    )
)
with check (
    exists (
        select 1
        from public.admin_users
        where admin_users.user_id = (select auth.uid())
    )
);

create policy "admin puede eliminar productos"
on public.productos
for delete
to authenticated
using (
    exists (
        select 1
        from public.admin_users
        where admin_users.user_id = (select auth.uid())
    )
);

-- 10. Productos iniciales.
insert into public.productos
    (id, nombre, precio, categoria, descripcion, emoji, etiqueta, estado, orden)
values
    ('palta-organica', 'Palta orgánica', 3500, 'alimentos',
     'Producto fresco, seleccionado y de excelente calidad.', '🥑', 'Destacado', 'disponible', 1),
    ('miel-natural', 'Miel natural', 5990, 'alimentos',
     'Miel pura y natural, ideal para acompañar tus desayunos.', '🍯', 'Natural', 'ultimas', 2),
    ('jabon-artesanal', 'Jabón artesanal', 3490, 'cuidado',
     'Elaborado con ingredientes naturales para cuidar tu piel.', '🧼', 'Artesanal', 'disponible', 3),
    ('vela-aromatica', 'Vela aromática', 6990, 'hogar',
     'Aroma suave y natural para crear un ambiente más agradable.', '🕯️', 'Ecológico', 'pedido', 4)
on conflict (id) do nothing;

-- =========================================================
-- ÚLTIMO PASO: AUTORIZAR AL ADMINISTRADOR
--
-- Primero crea al usuario en:
-- Supabase > Authentication > Users > Add user
--
-- Después cambia el correo de abajo y ejecuta SOLO estas líneas:
--
-- insert into public.admin_users (user_id)
-- select id from auth.users
-- where email = 'TU_CORREO_ADMIN@EJEMPLO.COM'
-- on conflict (user_id) do nothing;
-- =========================================================
