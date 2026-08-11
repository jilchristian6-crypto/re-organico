-- =========================================================
-- RE ORGÁNICO - ENDURECIMIENTO DE SEGURIDAD PARA PRODUCCIÓN
-- Ejecutar UNA VEZ en Supabase > SQL Editor > New query > Run
-- No borra productos ni pedidos.
-- =========================================================

-- 1) Confirmar RLS en tablas expuestas por la API.
alter table public.productos enable row level security;
alter table public.admin_users enable row level security;
alter table public.pedidos enable row level security;
alter table public.detalle_pedido enable row level security;

-- 2) Mantener los datos privados fuera del rol público.
revoke all on public.admin_users from anon;
revoke all on public.pedidos from anon;
revoke all on public.detalle_pedido from anon;

revoke insert, update, delete on public.admin_users from authenticated;
revoke insert, delete on public.pedidos from authenticated;
revoke insert, update, delete on public.detalle_pedido from authenticated;

-- El panel autorizado necesita solo estas operaciones.
grant select on public.admin_users to authenticated;
grant select, update on public.pedidos to authenticated;
grant select on public.detalle_pedido to authenticated;
grant select on public.productos to anon, authenticated;
grant insert, update, delete on public.productos to authenticated;

-- 3) Reemplazar la función pública de cotización por una versión más estricta.
--    - usa search_path vacío
--    - toma precios desde la base de datos
--    - valida presentación, cantidades y longitudes
--    - limita ráfagas de cotizaciones repetidas por teléfono
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
set search_path = ''
as $$
declare
    v_pedido_id uuid := gen_random_uuid();
    v_codigo text;
    v_total integer := 0;
    v_item jsonb;
    v_producto public.productos%rowtype;
    v_cantidad integer;
    v_producto_id text;
    v_presentacion_id text;
    v_presentacion jsonb;
    v_precio integer;
    v_unidades integer;
    v_presentacion_nombre text;
    v_recientes integer;
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

    if char_length(p_telefono) not between 8 and 25
       or p_telefono !~ '^[0-9+() .-]+$' then
        raise exception 'El teléfono no es válido.';
    end if;

    if p_tipo_entrega not in ('ruta', 'despacho') then
        raise exception 'La forma de entrega no es válida.';
    end if;

    if p_forma_pago not in ('efectivo', 'transferencia') then
        raise exception 'La forma de pago no es válida.';
    end if;

    if p_direccion is null or char_length(p_direccion) not between 3 and 180 then
        raise exception 'La dirección o sucursal de destino no es válida.';
    end if;

    if p_observaciones is not null and char_length(p_observaciones) > 500 then
        raise exception 'Las observaciones son demasiado largas.';
    end if;

    if p_tipo_entrega = 'ruta' then
        if p_comuna is null or p_comuna not in (
            'Llay Llay','Catemu','San Felipe','Panquehue','Putaendo','Santa María',
            'Los Andes','Rinconada','Calle Larga','San Esteban','Ocoa','Hijuelas',
            'Romeral','El Melón','Puchuncaví','Maitencillo','Laguna Zapallar',
            'Catapilco','Papudo','Pullally','La Ligua','Petorca'
        ) then
            raise exception 'La localidad de la ruta no es válida.';
        end if;
        p_region := 'Valparaíso';
        p_empresa_envio := 'Ruta Re Orgánico';
    else
        if p_region is null or char_length(p_region) > 80
           or p_comuna is null or char_length(p_comuna) > 100 then
            raise exception 'Región y comuna no son válidas.';
        end if;

        if p_empresa_envio is null then
            p_empresa_envio := 'Por coordinar';
        end if;

        if p_empresa_envio not in ('Por coordinar','Starken','Blue Express','CorreosChile') then
            raise exception 'La empresa de envío no es válida.';
        end if;

        if p_forma_pago <> 'transferencia' then
            raise exception 'Los despachos por transportista se pagan solo por transferencia.';
        end if;
    end if;

    if jsonb_typeof(p_items) <> 'array'
       or jsonb_array_length(p_items) < 1
       or jsonb_array_length(p_items) > 40 then
        raise exception 'La cotización debe contener entre 1 y 40 productos.';
    end if;

    -- Protección básica contra envíos repetidos automatizados.
    select count(*)::integer
    into v_recientes
    from public.pedidos
    where telefono = p_telefono
      and created_at >= now() - interval '10 minutes';

    if v_recientes >= 8 then
        raise exception 'Se han enviado demasiadas cotizaciones en poco tiempo. Intenta nuevamente más tarde.';
    end if;

    v_codigo := 'REO-' || to_char(clock_timestamp(), 'YYMMDD') || '-'
        || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

    insert into public.pedidos (
        id,codigo,nombre_cliente,telefono,tipo_entrega,region,comuna,direccion,
        empresa_envio,forma_pago,observaciones,total_referencial,estado
    ) values (
        v_pedido_id,v_codigo,p_nombre_cliente,p_telefono,p_tipo_entrega,p_region,p_comuna,p_direccion,
        p_empresa_envio,p_forma_pago,p_observaciones,0,'cotizacion'
    );

    for v_item in select value from jsonb_array_elements(p_items)
    loop
        v_producto_id := nullif(btrim(v_item ->> 'producto_id'), '');
        v_presentacion_id := nullif(btrim(v_item ->> 'presentacion_id'), '');

        if v_producto_id is null or char_length(v_producto_id) > 120 then
            raise exception 'Uno de los productos no es válido.';
        end if;

        if coalesce(v_item ->> 'cantidad', '') !~ '^[0-9]+$' then
            raise exception 'Una cantidad de la cotización no es válida.';
        end if;

        v_cantidad := (v_item ->> 'cantidad')::integer;
        if v_cantidad not between 1 and 99 then
            raise exception 'Cada cantidad debe estar entre 1 y 99.';
        end if;

        select *
        into v_producto
        from public.productos
        where id = v_producto_id;

        if not found then
            raise exception 'Uno de los productos ya no existe.';
        end if;

        if v_producto.estado = 'agotado' then
            raise exception 'El producto % está agotado.', v_producto.nombre;
        end if;

        if jsonb_array_length(v_producto.presentaciones) > 0 then
            select elem
            into v_presentacion
            from jsonb_array_elements(v_producto.presentaciones) as elem
            where elem ->> 'id' = v_presentacion_id
            limit 1;

            if v_presentacion is null then
                raise exception 'La presentación elegida para % no es válida.', v_producto.nombre;
            end if;

            if coalesce(v_presentacion ->> 'precio', '') !~ '^[0-9]+$'
               or coalesce(v_presentacion ->> 'unidades', '') !~ '^[0-9]+$' then
                raise exception 'La presentación de % tiene datos inválidos.', v_producto.nombre;
            end if;

            v_precio := (v_presentacion ->> 'precio')::integer;
            v_unidades := (v_presentacion ->> 'unidades')::integer;
            v_presentacion_nombre := left(coalesce(v_presentacion ->> 'nombre', 'Presentación'), 80);
        else
            v_precio := v_producto.precio;
            v_unidades := 1;
            v_presentacion_nombre := 'Presentación';
            v_presentacion_id := 'base';
        end if;

        if v_precio < 0 or v_unidades < 1 then
            raise exception 'El producto % tiene una presentación inválida.', v_producto.nombre;
        end if;

        insert into public.detalle_pedido (
            pedido_id,producto_id,nombre_producto,precio_unitario,cantidad,subtotal,
            presentacion_id,presentacion_nombre,unidades_por_presentacion,unidades_totales
        ) values (
            v_pedido_id,v_producto.id,v_producto.nombre,v_precio,v_cantidad,v_precio*v_cantidad,
            v_presentacion_id,v_presentacion_nombre,v_unidades,v_unidades*v_cantidad
        );

        v_total := v_total + (v_precio * v_cantidad);
        v_presentacion := null;
    end loop;

    update public.pedidos
    set total_referencial = v_total
    where id = v_pedido_id;

    return query select v_pedido_id, v_codigo, v_total;
end;
$$;

revoke all on function public.crear_pedido(
    text,text,text,text,text,text,text,text,text,jsonb
) from public;

grant execute on function public.crear_pedido(
    text,text,text,text,text,text,text,text,text,jsonb
) to anon, authenticated;

-- 4) Verificación rápida. Debe mostrar las 4 tablas con RLS = true.
select relname as tabla, relrowsecurity as rls_activo
from pg_class
where relname in ('productos','admin_users','pedidos','detalle_pedido')
order by relname;
