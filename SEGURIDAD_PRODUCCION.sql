-- RE ORGÁNICO - ENDURECIMIENTO PRODUCCIÓN (ejecutar al final)

create or replace function public.es_admin_aal2() returns boolean language sql stable security definer set search_path = public, pg_catalog as $$
select coalesce(auth.jwt()->>'aal','aal1')='aal2' and exists(select 1 from public.admin_users where user_id=auth.uid());
$$;
revoke all on function public.es_admin_aal2() from public, anon;
grant execute on function public.es_admin_aal2() to authenticated;

alter table public.productos enable row level security;
drop policy if exists "admin puede agregar productos" on public.productos;
drop policy if exists "admin puede editar productos" on public.productos;
drop policy if exists "admin puede eliminar productos" on public.productos;
create policy "admin puede agregar productos" on public.productos for insert to authenticated with check(public.es_admin_aal2());
create policy "admin puede editar productos" on public.productos for update to authenticated using(public.es_admin_aal2()) with check(public.es_admin_aal2());
create policy "admin puede eliminar productos" on public.productos for delete to authenticated using(public.es_admin_aal2());

alter table public.pedidos enable row level security;
alter table public.detalle_pedido enable row level security;
drop policy if exists "admin puede ver pedidos" on public.pedidos;
drop policy if exists "admin puede actualizar pedidos" on public.pedidos;
drop policy if exists "admin puede ver detalle pedidos" on public.detalle_pedido;
create policy "admin puede ver pedidos" on public.pedidos for select to authenticated using(public.es_admin_aal2());
create policy "admin puede actualizar pedidos" on public.pedidos for update to authenticated using(public.es_admin_aal2()) with check(public.es_admin_aal2());
create policy "admin puede ver detalle pedidos" on public.detalle_pedido for select to authenticated using(public.es_admin_aal2());
revoke update on public.pedidos from authenticated;
grant update (estado) on public.pedidos to authenticated;

alter table public.pedidos drop constraint if exists pedidos_telefono_formato_seguro;
alter table public.pedidos add constraint pedidos_telefono_formato_seguro check(telefono ~ '^[0-9+() .-]{8,25}$');
alter table public.pedidos drop constraint if exists pedidos_region_longitud_segura;
alter table public.pedidos add constraint pedidos_region_longitud_segura check(region is null or char_length(region)<=80);
alter table public.pedidos drop constraint if exists pedidos_comuna_longitud_segura;
alter table public.pedidos add constraint pedidos_comuna_longitud_segura check(comuna is null or char_length(comuna)<=80);
alter table public.pedidos drop constraint if exists pedidos_direccion_longitud_segura;
alter table public.pedidos add constraint pedidos_direccion_longitud_segura check(direccion is null or char_length(direccion)<=220);
alter table public.pedidos drop constraint if exists pedidos_empresa_longitud_segura;
alter table public.pedidos add constraint pedidos_empresa_longitud_segura check(empresa_envio is null or char_length(empresa_envio)<=80);
alter table public.pedidos drop constraint if exists pedidos_observaciones_longitud_segura;
alter table public.pedidos add constraint pedidos_observaciones_longitud_segura check(observaciones is null or char_length(observaciones)<=600);

create table if not exists public.auditoria_admin(id bigint generated always as identity primary key, tabla text not null check(tabla in('productos','pedidos')), registro_id text not null, accion text not null check(accion in('INSERT','UPDATE','DELETE')), usuario_id uuid, aal text, fecha timestamptz not null default now(), datos_anteriores jsonb, datos_nuevos jsonb);
alter table public.auditoria_admin enable row level security;
revoke all on public.auditoria_admin from anon, authenticated;
grant select on public.auditoria_admin to authenticated;
drop policy if exists "admin aal2 puede ver auditoria" on public.auditoria_admin;
create policy "admin aal2 puede ver auditoria" on public.auditoria_admin for select to authenticated using(public.es_admin_aal2());
create or replace function public.registrar_auditoria_admin() returns trigger language plpgsql security definer set search_path=public,pg_catalog as $$
declare v_id text; begin v_id:=case when tg_op='DELETE' then old.id::text else new.id::text end; insert into public.auditoria_admin(tabla,registro_id,accion,usuario_id,aal,datos_anteriores,datos_nuevos) values(tg_table_name,v_id,tg_op,auth.uid(),coalesce(auth.jwt()->>'aal','sin-aal'),case when tg_op in('UPDATE','DELETE') then to_jsonb(old) end,case when tg_op in('INSERT','UPDATE') then to_jsonb(new) end); return coalesce(new,old); end; $$;
revoke all on function public.registrar_auditoria_admin() from public,anon,authenticated;
drop trigger if exists auditoria_productos_admin on public.productos;
create trigger auditoria_productos_admin after insert or update or delete on public.productos for each row execute function public.registrar_auditoria_admin();
drop trigger if exists auditoria_pedidos_admin on public.pedidos;
create trigger auditoria_pedidos_admin after update or delete on public.pedidos for each row execute function public.registrar_auditoria_admin();

revoke all on public.admin_users from anon;
revoke insert,update,delete on public.admin_users from authenticated;
grant select on public.admin_users to authenticated;

-- NOTA: crear_pedido sigue abierto a anon para que la tienda funcione.
-- Para bloquear spam a nivel alto, activar Turnstile + Edge Function y luego revocar EXECUTE a anon.
