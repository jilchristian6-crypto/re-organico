-- Refuerzo de seguridad Re Orgánico
-- Este mismo cambio fue preparado para aplicarse como migración en Supabase.

begin;

-- Las funciones usadas por RLS quedan fuera del esquema público de la API.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated, service_role;

create or replace function private.es_admin_aal2()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
    select
        coalesce(auth.jwt()->>'aal', 'aal1') = 'aal2'
        and exists (
            select 1
            from public.admin_users
            where user_id = auth.uid()
        );
$$;

revoke all on function private.es_admin_aal2() from public, anon;
grant execute on function private.es_admin_aal2() to authenticated, service_role;

alter policy "admin aal2 puede ver auditoria"
on public.auditoria_admin
using ((select private.es_admin_aal2()));

alter policy "admin puede agregar contenido"
on public.contenido_galeria
with check ((select private.es_admin_aal2()));

alter policy "admin puede editar contenido"
on public.contenido_galeria
using ((select private.es_admin_aal2()))
with check ((select private.es_admin_aal2()));

alter policy "admin puede eliminar contenido"
on public.contenido_galeria
using ((select private.es_admin_aal2()));

alter policy "admin puede ver toda la galeria"
on public.contenido_galeria
using ((select private.es_admin_aal2()));

alter policy "admin puede ver detalle pedidos"
on public.detalle_pedido
using ((select private.es_admin_aal2()));

alter policy "admin puede actualizar pedidos"
on public.pedidos
using ((select private.es_admin_aal2()))
with check ((select private.es_admin_aal2()));

alter policy "admin puede ver pedidos"
on public.pedidos
using ((select private.es_admin_aal2()));

alter policy "admin puede agregar productos"
on public.productos
with check ((select private.es_admin_aal2()));

alter policy "admin puede editar productos"
on public.productos
using ((select private.es_admin_aal2()))
with check ((select private.es_admin_aal2()));

alter policy "admin puede eliminar productos"
on public.productos
using ((select private.es_admin_aal2()));

alter policy "admin galeria puede editar archivos"
on storage.objects
using ((bucket_id = 'galeria') and (select private.es_admin_aal2()))
with check ((bucket_id = 'galeria') and (select private.es_admin_aal2()));

alter policy "admin galeria puede eliminar archivos"
on storage.objects
using ((bucket_id = 'galeria') and (select private.es_admin_aal2()));

alter policy "admin galeria puede subir archivos"
on storage.objects
with check ((bucket_id = 'galeria') and (select private.es_admin_aal2()));

alter policy "admin galeria puede ver archivos"
on storage.objects
using ((bucket_id = 'galeria') and (select private.es_admin_aal2()));

alter policy "admin productos puede editar fotos"
on storage.objects
using ((bucket_id = 'productos') and (select private.es_admin_aal2()))
with check ((bucket_id = 'productos') and (select private.es_admin_aal2()));

alter policy "admin productos puede eliminar fotos"
on storage.objects
using ((bucket_id = 'productos') and (select private.es_admin_aal2()));

alter policy "admin productos puede subir fotos"
on storage.objects
with check ((bucket_id = 'productos') and (select private.es_admin_aal2()));

alter policy "admin productos puede ver fotos"
on storage.objects
using ((bucket_id = 'productos') and (select private.es_admin_aal2()));

drop function if exists public.es_admin_aal2();

-- El visitante anónimo ve solo contenido publicado; el administrador usa su política MFA.
alter policy "galeria publica activa"
on public.contenido_galeria
to anon
using (activo = true);

-- Registro interno, sin IP ni teléfono en texto plano.
create table if not exists private.intentos_pedido (
    id bigint generated always as identity primary key,
    tipo text not null check (tipo in ('ip', 'telefono')),
    clave_hash text not null check (clave_hash ~ '^[a-f0-9]{64}$'),
    creado_en timestamptz not null default now()
);

alter table private.intentos_pedido enable row level security;
revoke all on table private.intentos_pedido from public, anon, authenticated;
revoke all on sequence private.intentos_pedido_id_seq from public, anon, authenticated;

create index if not exists intentos_pedido_tipo_hash_fecha_idx
on private.intentos_pedido (tipo, clave_hash, creado_en desc);

create index if not exists intentos_pedido_fecha_idx
on private.intentos_pedido (creado_en);

create or replace function public.verificar_limite_pedido(
    p_tipo text,
    p_hash text
)
returns table (
    permitido boolean,
    reintentar_en integer,
    motivo text
)
language plpgsql
security definer
set search_path = pg_catalog, private
as $$
declare
    v_ahora timestamptz := clock_timestamp();
    v_ventana interval;
    v_maximo integer;
    v_cantidad integer;
    v_primero timestamptz;
    v_reintentar integer;
begin
    if p_tipo not in ('ip', 'telefono') then
        raise exception 'Tipo de límite no válido.';
    end if;

    if coalesce(p_hash, '') !~ '^[a-f0-9]{64}$' then
        raise exception 'Identificador de límite no válido.';
    end if;

    if p_tipo = 'ip' then
        v_ventana := interval '10 minutes';
        v_maximo := 10;
    else
        v_ventana := interval '60 minutes';
        v_maximo := 3;
    end if;

    perform pg_advisory_xact_lock(
        hashtextextended(p_tipo || ':' || p_hash, 0)
    );

    delete from private.intentos_pedido
    where creado_en < v_ahora - interval '24 hours';

    select count(*)::integer, min(creado_en)
    into v_cantidad, v_primero
    from private.intentos_pedido
    where tipo = p_tipo
      and clave_hash = p_hash
      and creado_en > v_ahora - v_ventana;

    if v_cantidad >= v_maximo then
        v_reintentar := greatest(
            1,
            ceil(extract(epoch from (v_primero + v_ventana - v_ahora)))::integer
        );

        return query select false, v_reintentar, p_tipo;
        return;
    end if;

    insert into private.intentos_pedido (tipo, clave_hash)
    values (p_tipo, p_hash);

    return query select true, 0, p_tipo;
end;
$$;

revoke all on function public.verificar_limite_pedido(text, text)
from public, anon, authenticated;
grant execute on function public.verificar_limite_pedido(text, text)
to service_role;

create index if not exists detalle_pedido_producto_id_idx
on public.detalle_pedido (producto_id);

commit;
