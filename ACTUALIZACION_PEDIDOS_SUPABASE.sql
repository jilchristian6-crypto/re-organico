-- =========================================================
-- RE ORGÁNICO: SISTEMA DE PEDIDOS + WHATSAPP
-- Ejecuta TODO este archivo una sola vez en:
-- Supabase > SQL Editor > New query > Run
-- Es seguro volver a ejecutarlo: usa IF NOT EXISTS y reemplaza políticas/funciones.
-- =========================================================

-- 1. Tabla principal de pedidos.
create table if not exists public.pedidos (
    id uuid primary key default gen_random_uuid(),
    codigo text not null unique,
    nombre_cliente text not null check (char_length(nombre_cliente) between 2 and 100),
    telefono text not null check (char_length(telefono) between 8 and 25),
    tipo_entrega text not null check (tipo_entrega in ('retiro', 'despacho')),
    region text,
    comuna text,
    direccion text,
    empresa_envio text,
    observaciones text,
    total_referencial integer not null default 0 check (total_referencial >= 0),
    estado text not null default 'pendiente'
        check (estado in (
            'pendiente',
            'confirmado',
            'esperando_pago',
            'pago_confirmado',
            'preparando',
            'enviado',
            'entregado',
            'cancelado'
        )),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 2. Productos incluidos en cada pedido.
create table if not exists public.detalle_pedido (
    id bigint generated always as identity primary key,
    pedido_id uuid not null references public.pedidos(id) on delete cascade,
    producto_id text references public.productos(id) on delete set null,
    nombre_producto text not null,
    precio_unitario integer not null check (precio_unitario >= 0),
    cantidad integer not null check (cantidad between 1 and 99),
    subtotal integer not null check (subtotal >= 0),
    created_at timestamptz not null default now()
);

create index if not exists pedidos_created_at_idx
on public.pedidos (created_at desc);

create index if not exists pedidos_estado_idx
on public.pedidos (estado);

create index if not exists detalle_pedido_pedido_id_idx
on public.detalle_pedido (pedido_id);

-- 3. Mantener updated_at actualizado.
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

drop trigger if exists pedidos_actualizar_fecha on public.pedidos;
create trigger pedidos_actualizar_fecha
before update on public.pedidos
for each row
execute function public.actualizar_updated_at();

-- 4. Seguridad por filas.
alter table public.pedidos enable row level security;
alter table public.detalle_pedido enable row level security;

-- El público NO puede leer los pedidos.
revoke all on public.pedidos from anon;
revoke all on public.detalle_pedido from anon;

-- Los usuarios autenticados solo reciben permisos mínimos.
revoke all on public.pedidos from authenticated;
revoke all on public.detalle_pedido from authenticated;
grant select, update on public.pedidos to authenticated;
grant select on public.detalle_pedido to authenticated;

-- 5. Políticas para administradores autorizados.
drop policy if exists "admin puede ver pedidos" on public.pedidos;
drop policy if exists "admin puede actualizar pedidos" on public.pedidos;
drop policy if exists "admin puede ver detalle pedidos" on public.detalle_pedido;

create policy "admin puede ver pedidos"
on public.pedidos
for select
to authenticated
using (
    exists (
        select 1
        from public.admin_users
        where admin_users.user_id = (select auth.uid())
    )
);

create policy "admin puede actualizar pedidos"
on public.pedidos
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

create policy "admin puede ver detalle pedidos"
on public.detalle_pedido
for select
to authenticated
using (
    exists (
        select 1
        from public.admin_users
        where admin_users.user_id = (select auth.uid())
    )
);

-- 6. Función segura y transaccional para crear un pedido desde la tienda pública.
-- El total se calcula usando los precios guardados en la base de datos,
-- no usando valores enviados por el navegador.
create or replace function public.crear_pedido(
    p_nombre_cliente text,
    p_telefono text,
    p_tipo_entrega text,
    p_region text,
    p_comuna text,
    p_direccion text,
    p_empresa_envio text,
    p_observaciones text,
    p_items jsonb
)
returns table (
    pedido_id uuid,
    codigo text,
    total_referencial integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
    v_pedido_id uuid := gen_random_uuid();
    v_codigo text;
    v_total integer := 0;
    v_item jsonb;
    v_producto record;
    v_cantidad integer;
    v_producto_id text;
begin
    p_nombre_cliente := btrim(coalesce(p_nombre_cliente, ''));
    p_telefono := btrim(coalesce(p_telefono, ''));
    p_tipo_entrega := lower(btrim(coalesce(p_tipo_entrega, '')));
    p_region := nullif(btrim(coalesce(p_region, '')), '');
    p_comuna := nullif(btrim(coalesce(p_comuna, '')), '');
    p_direccion := nullif(btrim(coalesce(p_direccion, '')), '');
    p_empresa_envio := nullif(btrim(coalesce(p_empresa_envio, '')), '');
    p_observaciones := nullif(btrim(coalesce(p_observaciones, '')), '');

    if char_length(p_nombre_cliente) not between 2 and 100 then
        raise exception 'El nombre del cliente no es válido.';
    end if;

    if char_length(p_telefono) not between 8 and 25 then
        raise exception 'El teléfono no es válido.';
    end if;

    if p_tipo_entrega not in ('retiro', 'despacho') then
        raise exception 'La forma de entrega no es válida.';
    end if;

    if p_tipo_entrega = 'despacho' and (p_region is null or p_comuna is null) then
        raise exception 'Región y comuna son obligatorias para despacho.';
    end if;

    if p_tipo_entrega = 'retiro' then
        p_region := null;
        p_comuna := null;
        p_direccion := null;
        p_empresa_envio := null;
    end if;

    if jsonb_typeof(p_items) <> 'array'
       or jsonb_array_length(p_items) < 1
       or jsonb_array_length(p_items) > 40 then
        raise exception 'El pedido debe contener entre 1 y 40 productos.';
    end if;

    v_codigo := 'REO-' || to_char(clock_timestamp(), 'YYMMDD') || '-'
        || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

    insert into public.pedidos (
        id,
        codigo,
        nombre_cliente,
        telefono,
        tipo_entrega,
        region,
        comuna,
        direccion,
        empresa_envio,
        observaciones,
        total_referencial,
        estado
    ) values (
        v_pedido_id,
        v_codigo,
        p_nombre_cliente,
        p_telefono,
        p_tipo_entrega,
        p_region,
        p_comuna,
        p_direccion,
        p_empresa_envio,
        p_observaciones,
        0,
        'pendiente'
    );

    for v_item in
        select value from jsonb_array_elements(p_items)
    loop
        v_producto_id := nullif(btrim(v_item ->> 'producto_id'), '');

        if coalesce(v_item ->> 'cantidad', '') !~ '^[0-9]+$' then
            raise exception 'Una cantidad del pedido no es válida.';
        end if;

        v_cantidad := (v_item ->> 'cantidad')::integer;

        if v_cantidad not between 1 and 99 then
            raise exception 'Cada cantidad debe estar entre 1 y 99.';
        end if;

        select p.id, p.nombre, p.precio, p.estado
        into v_producto
        from public.productos p
        where p.id = v_producto_id;

        if not found then
            raise exception 'Uno de los productos ya no existe.';
        end if;

        if v_producto.estado = 'agotado' then
            raise exception 'El producto % está agotado.', v_producto.nombre;
        end if;

        insert into public.detalle_pedido (
            pedido_id,
            producto_id,
            nombre_producto,
            precio_unitario,
            cantidad,
            subtotal
        ) values (
            v_pedido_id,
            v_producto.id,
            v_producto.nombre,
            v_producto.precio,
            v_cantidad,
            v_producto.precio * v_cantidad
        );

        v_total := v_total + (v_producto.precio * v_cantidad);
    end loop;

    update public.pedidos
    set total_referencial = v_total
    where id = v_pedido_id;

    return query
    select v_pedido_id, v_codigo, v_total;
end;
$$;

revoke all on function public.crear_pedido(
    text, text, text, text, text, text, text, text, jsonb
) from public;

grant execute on function public.crear_pedido(
    text, text, text, text, text, text, text, text, jsonb
) to anon, authenticated;

-- =========================================================
-- LISTO.
-- Después de ejecutar este archivo, reemplaza los archivos web
-- por la versión actualizada y prueba un pedido de ejemplo.
-- =========================================================
