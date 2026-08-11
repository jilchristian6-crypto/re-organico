-- =========================================================
-- RE ORGÁNICO: ACTUALIZACIÓN DE DATOS REALES Y COTIZACIONES
-- Ejecuta TODO este archivo en:
-- Supabase > SQL Editor > New query > Run
--
-- Este script actualiza el sistema ya instalado:
-- - elimina "retiro en tienda" del flujo
-- - agrega rutas Re Orgánico
-- - agrega forma de pago (efectivo / transferencia)
-- - cambia el estado inicial a "cotizacion"
-- - mantiene Starken, Blue Express y CorreosChile
-- =========================================================

-- 1. Agregar forma de pago a pedidos existentes.
alter table public.pedidos
add column if not exists forma_pago text;

update public.pedidos
set forma_pago = 'transferencia'
where forma_pago is null or btrim(forma_pago) = '';

alter table public.pedidos
alter column forma_pago set default 'transferencia';

alter table public.pedidos
alter column forma_pago set not null;

alter table public.pedidos
drop constraint if exists pedidos_forma_pago_check;

alter table public.pedidos
add constraint pedidos_forma_pago_check
check (forma_pago in ('efectivo', 'transferencia'));

-- 2. Actualizar las formas de entrega.
-- Los registros antiguos de "retiro" se conservan como despacho por coordinar.
alter table public.pedidos
drop constraint if exists pedidos_tipo_entrega_check;

update public.pedidos
set
    tipo_entrega = 'despacho',
    empresa_envio = coalesce(nullif(empresa_envio, ''), 'Por coordinar')
where tipo_entrega = 'retiro';

alter table public.pedidos
add constraint pedidos_tipo_entrega_check
check (tipo_entrega in ('ruta', 'despacho'));

-- 3. Cambiar el estado inicial de las solicitudes a "cotizacion".
alter table public.pedidos
drop constraint if exists pedidos_estado_check;

update public.pedidos
set estado = 'cotizacion'
where estado = 'pendiente';

alter table public.pedidos
alter column estado set default 'cotizacion';

alter table public.pedidos
add constraint pedidos_estado_check
check (estado in (
    'cotizacion',
    'confirmado',
    'esperando_pago',
    'pago_confirmado',
    'preparando',
    'enviado',
    'entregado',
    'cancelado'
));

-- 4. Reemplazar la función anterior de creación de pedidos/cotizaciones.
drop function if exists public.crear_pedido(
    text, text, text, text, text, text, text, text, jsonb
);

drop function if exists public.crear_pedido(
    text, text, text, text, text, text, text, text, text, jsonb
);

create or replace function public.crear_pedido(
    p_nombre_cliente text,
    p_telefono text,
    p_tipo_entrega text,
    p_region text,
    p_comuna text,
    p_direccion text,
    p_empresa_envio text,
    p_forma_pago text,
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
    p_forma_pago := lower(btrim(coalesce(p_forma_pago, '')));
    p_observaciones := nullif(btrim(coalesce(p_observaciones, '')), '');

    if char_length(p_nombre_cliente) not between 2 and 100 then
        raise exception 'El nombre del cliente no es válido.';
    end if;

    if char_length(p_telefono) not between 8 and 25 then
        raise exception 'El teléfono no es válido.';
    end if;

    if p_tipo_entrega not in ('ruta', 'despacho') then
        raise exception 'La forma de entrega no es válida.';
    end if;

    if p_forma_pago not in ('efectivo', 'transferencia') then
        raise exception 'La forma de pago no es válida.';
    end if;

    if p_direccion is null then
        raise exception 'La dirección o sucursal de destino es obligatoria.';
    end if;

    if p_tipo_entrega = 'ruta' then
        if p_comuna is null then
            raise exception 'Debes seleccionar una localidad de las rutas Re Orgánico.';
        end if;

        p_region := 'Valparaíso';
        p_empresa_envio := 'Ruta Re Orgánico';
    end if;

    if p_tipo_entrega = 'despacho' then
        if p_region is null or p_comuna is null then
            raise exception 'Región y comuna son obligatorias para despacho.';
        end if;

        if p_empresa_envio is null then
            p_empresa_envio := 'Por coordinar';
        end if;

        if p_empresa_envio not in ('Por coordinar', 'Starken', 'Blue Express', 'CorreosChile') then
            raise exception 'La empresa de envío no es válida.';
        end if;
    end if;

    if jsonb_typeof(p_items) <> 'array'
       or jsonb_array_length(p_items) < 1
       or jsonb_array_length(p_items) > 40 then
        raise exception 'La cotización debe contener entre 1 y 40 productos.';
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
        forma_pago,
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
        p_forma_pago,
        p_observaciones,
        0,
        'cotizacion'
    );

    for v_item in
        select value from jsonb_array_elements(p_items)
    loop
        v_producto_id := nullif(btrim(v_item ->> 'producto_id'), '');

        if coalesce(v_item ->> 'cantidad', '') !~ '^[0-9]+$' then
            raise exception 'Una cantidad de la cotización no es válida.';
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
    text, text, text, text, text, text, text, text, text, jsonb
) from public;

grant execute on function public.crear_pedido(
    text, text, text, text, text, text, text, text, text, jsonb
) to anon, authenticated;

-- =========================================================
-- LISTO.
-- Si Supabase muestra "Success. No rows returned", quedó aplicado.
-- =========================================================


-- 8. Regla de pago: los despachos por transportista son solo por transferencia.

-- Corrige cualquier registro anterior de despacho que tenga efectivo.
update public.pedidos
set forma_pago = 'transferencia'
where tipo_entrega = 'despacho'
  and forma_pago <> 'transferencia';

-- La base de datos también impide guardar un despacho con efectivo.
alter table public.pedidos
drop constraint if exists pedidos_pago_segun_entrega_check;

alter table public.pedidos
add constraint pedidos_pago_segun_entrega_check
check (tipo_entrega <> 'despacho' or forma_pago = 'transferencia');
