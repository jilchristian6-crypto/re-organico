-- =========================================================
-- RE ORGÁNICO: PRODUCTOS REALES + PACK / ROLLO / CAJA
-- Ejecuta TODO este archivo una sola vez en Supabase > SQL Editor.
-- Es seguro volver a ejecutarlo.
-- =========================================================

-- 1. Nuevos datos del producto.
alter table public.productos add column if not exists medida text;
alter table public.productos add column if not exists micras integer;
alter table public.productos add column if not exists presentaciones jsonb not null default '[]'::jsonb;

alter table public.detalle_pedido add column if not exists presentacion_id text;
alter table public.detalle_pedido add column if not exists presentacion_nombre text;
alter table public.detalle_pedido add column if not exists unidades_por_presentacion integer;
alter table public.detalle_pedido add column if not exists unidades_totales integer;


-- 1B. Actualizar las categorías permitidas del catálogo.
-- La base antigua solo aceptaba: alimentos, cuidado y hogar.
-- El catálogo nuevo usa: bolsas, rollos y papel.
alter table public.productos
    drop constraint if exists productos_categoria_check;

alter table public.productos
    add constraint productos_categoria_check
    check (categoria in ('alimentos', 'cuidado', 'hogar', 'bolsas', 'rollos', 'papel', 'contenedores', 'vasos', 'tapas', 'heladeria', 'cubiertos', 'bombillas'));

-- 2. Quitar solo los productos de demostración originales.
delete from public.productos
where id in ('palta-organica','miel-natural','jabon-artesanal','vela-aromatica');

-- 3. Catálogo real. El campo precio mantiene el precio de la presentación mínima.
insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('bolsa-pequena-36x40-my14','Bolsa compostable pequeña 36 × 40 cm',6969,'bolsas','Bolsa Bio Eco blanca, biodegradable y compostable. Ideal para compras pequeñas. Venta mínima: 1 pack de 100 bolsas.','🛍️','Pequeña','disponible',1,'36 × 40 cm',14,'[{"id":"pack-100","nombre":"Pack","unidades":100,"unidad":"bolsas","precio":6969,"detalle":"1 pack = 100 bolsas"},{"id":"caja","nombre":"Caja completa","unidades":500,"unidad":"bolsas","precio":32667,"detalle":"1 caja = 500 bolsas"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion, emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden, medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('bolsa-mediana-42x50-my14','Bolsa compostable mediana 42 × 50 cm MY14',10627,'bolsas','Bolsa Bio Eco blanca, biodegradable y compostable. Venta mínima: 1 pack de 100 bolsas.','🛍️','Mediana','disponible',2,'42 × 50 cm',14,'[{"id":"pack-100","nombre":"Pack","unidades":100,"unidad":"bolsas","precio":10627,"detalle":"1 pack = 100 bolsas"},{"id":"caja","nombre":"Caja completa","unidades":500,"unidad":"bolsas","precio":49813,"detalle":"1 caja = 500 bolsas"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion, emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden, medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('bolsa-mediana-42x50-my21','Bolsa compostable mediana 42 × 50 cm MY21',15939,'bolsas','Diseño “Salvemos el Planeta”. Biodegradable y compostable. Venta mínima: 1 pack de 100 bolsas.','🌎','Salvemos el Planeta','disponible',3,'42 × 50 cm',21,'[{"id":"pack-100","nombre":"Pack","unidades":100,"unidad":"bolsas","precio":15939,"detalle":"1 pack = 100 bolsas"},{"id":"caja","nombre":"Caja completa","unidades":500,"unidad":"bolsas","precio":76463,"detalle":"1 caja = 500 bolsas"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion, emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden, medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('bolsa-grande-48x55-my22','Bolsa compostable grande 48 × 55 cm MY22',20799,'bolsas','Diseño “Salvemos el Planeta”. Biodegradable y compostable. Venta mínima: 1 pack de 100 bolsas.','🌿','Grande','disponible',4,'48 × 55 cm',22,'[{"id":"pack-100","nombre":"Pack","unidades":100,"unidad":"bolsas","precio":20799,"detalle":"1 pack = 100 bolsas"},{"id":"caja","nombre":"Caja completa","unidades":500,"unidad":"bolsas","precio":100525,"detalle":"1 caja = 500 bolsas"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion, emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden, medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('bolsa-grande-48x60-my20','Bolsa compostable grande 48 × 60 cm MY20',21239,'bolsas','Diseño “Salvemos el Planeta”. Biodegradable y compostable. Venta mínima: 1 pack de 100 bolsas.','🌿','Grande','disponible',5,'48 × 60 cm',20,'[{"id":"pack-100","nombre":"Pack","unidades":100,"unidad":"bolsas","precio":21239,"detalle":"1 pack = 100 bolsas"},{"id":"caja","nombre":"Caja completa","unidades":500,"unidad":"bolsas","precio":102655,"detalle":"1 caja = 500 bolsas"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion, emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden, medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('bolsa-extra-grande-55x65-my25','Bolsa compostable extra grande 55 × 65 cm MY25',32104,'bolsas','Bolsa Biomade “Salvemos el Planeta”. Biodegradable y compostable. Venta mínima: 1 pack de 100 bolsas.','♻️','Extra grande','disponible',6,'55 × 65 cm',25,'[{"id":"pack-100","nombre":"Pack","unidades":100,"unidad":"bolsas","precio":32104,"detalle":"1 pack = 100 bolsas"},{"id":"caja","nombre":"Caja completa","unidades":300,"unidad":"bolsas","precio":93098,"detalle":"1 caja = 300 bolsas"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion, emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden, medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('bolsa-taco-25x35-my14','Bolsa compostable tipo taco 25 × 35 cm MY14',6055,'bolsas','Bolsa compostable tipo taco. Venta mínima: 1 pack de 100 bolsas.','🛍️','Taco','disponible',7,'25 × 35 cm',14,'[{"id":"pack-100","nombre":"Pack","unidades":100,"unidad":"bolsas","precio":6055,"detalle":"1 pack = 100 bolsas"},{"id":"caja","nombre":"Caja completa","unidades":2700,"unidad":"bolsas","precio":155220,"detalle":"1 caja = 2.700 bolsas"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion, emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden, medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('rollo-basura-50x60-my16','Bolsa de basura compostable blanca en rollo 50 × 60 cm MY16',4486,'rollos','Bolsa de basura compostable blanca en rollo. Cada rollo trae 25 bolsas.','🗑️','Rollo','disponible',8,'50 × 60 cm',16,'[{"id":"rollo","nombre":"Rollo","unidades":25,"unidad":"bolsas","precio":4486,"detalle":"1 rollo = 25 bolsas"},{"id":"caja","nombre":"Caja completa","unidades":600,"unidad":"bolsas","precio":104073,"detalle":"1 caja = 24 rollos = 600 bolsas","rollos":24}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion, emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden, medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('rollo-basura-70x90-my20','Bolsa de basura compostable blanca en rollo 70 × 90 cm MY20',9903,'rollos','Bolsa de basura compostable blanca en rollo. Cada rollo trae 20 bolsas.','🗑️','Rollo','disponible',9,'70 × 90 cm',20,'[{"id":"rollo","nombre":"Rollo","unidades":20,"unidad":"bolsas","precio":9903,"detalle":"1 rollo = 20 bolsas"},{"id":"caja","nombre":"Caja completa","unidades":200,"unidad":"bolsas","precio":95736,"detalle":"1 caja = 10 rollos = 200 bolsas","rollos":10}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion, emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden, medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('rollo-camiseta-34x50-my11','Bolsa compostable tipo camiseta en rollo 34 × 50 cm MY11',17148,'rollos','Bolsa compostable tipo camiseta en rollo. Cada rollo contiene 200 bolsas.','🧻','200 por rollo','disponible',10,'34 × 50 cm',11,'[{"id":"rollo","nombre":"Rollo","unidades":200,"unidad":"bolsas","precio":17148,"detalle":"1 rollo = 200 bolsas"},{"id":"caja","nombre":"Caja completa","unidades":1200,"unidad":"bolsas","precio":99446,"detalle":"1 caja = 6 rollos = 1.200 bolsas","rollos":6}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion, emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden, medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('papel-compost-25x37','Papel compost Biomade 25 × 37 cm',117139,'papel','Papel compost Biomade. Caja de 10 kg con aproximadamente 2.200 unidades.','📄','Caja 10 kg','disponible',11,'25 × 37 cm',null,'[{"id":"caja-10kg","nombre":"Caja 10 kg","unidades":2200,"unidad":"unidades aprox.","precio":117139,"detalle":"1 caja de 10 kg ≈ 2.200 unidades"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion, emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden, medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('papel-compost-37x50','Papel compost Biomade 37 × 50 cm',117139,'papel','Papel compost Biomade. Caja de 10 kg con aproximadamente 1.100 unidades.','📄','Caja 10 kg','disponible',12,'37 × 50 cm',null,'[{"id":"caja-10kg","nombre":"Caja 10 kg","unidades":1100,"unidad":"unidades aprox.","precio":117139,"detalle":"1 caja de 10 kg ≈ 1.100 unidades"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion, emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden, medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('papel-compost-50x75','Papel compost Biomade 50 × 75 cm',117139,'papel','Papel compost Biomade. Caja de 10 kg con aproximadamente 550 unidades.','📄','Caja 10 kg','disponible',13,'50 × 75 cm',null,'[{"id":"caja-10kg","nombre":"Caja 10 kg","unidades":550,"unidad":"unidades aprox.","precio":117139,"detalle":"1 caja de 10 kg ≈ 550 unidades"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion, emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden, medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

-- 4. Función de cotización: el precio se obtiene de Supabase según la presentación elegida.
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
    v_producto public.productos%rowtype;
    v_cantidad integer;
    v_producto_id text;
    v_presentacion_id text;
    v_presentacion jsonb;
    v_precio integer;
    v_unidades integer;
    v_presentacion_nombre text;
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

    if p_tipo_entrega = 'despacho' and p_forma_pago <> 'transferencia' then
        raise exception 'Los despachos por transportista se pagan solo por transferencia.';
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
    else
        if p_region is null or p_comuna is null then
            raise exception 'Región y comuna son obligatorias para despacho.';
        end if;
        if p_empresa_envio is null then p_empresa_envio := 'Por coordinar'; end if;
        if p_empresa_envio not in ('Por coordinar','Starken','Blue Express','CorreosChile') then
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

        if coalesce(v_item ->> 'cantidad', '') !~ '^[0-9]+$' then
            raise exception 'Una cantidad de la cotización no es válida.';
        end if;
        v_cantidad := (v_item ->> 'cantidad')::integer;
        if v_cantidad not between 1 and 99 then
            raise exception 'Cada cantidad debe estar entre 1 y 99.';
        end if;

        select * into v_producto from public.productos where id = v_producto_id;
        if not found then raise exception 'Uno de los productos ya no existe.'; end if;
        if v_producto.estado = 'agotado' then raise exception 'El producto % está agotado.', v_producto.nombre; end if;

        if jsonb_array_length(v_producto.presentaciones) > 0 then
            select elem into v_presentacion
            from jsonb_array_elements(v_producto.presentaciones) elem
            where elem ->> 'id' = v_presentacion_id
            limit 1;
            if v_presentacion is null then
                raise exception 'La presentación elegida para % no es válida.', v_producto.nombre;
            end if;
            v_precio := (v_presentacion ->> 'precio')::integer;
            v_unidades := (v_presentacion ->> 'unidades')::integer;
            v_presentacion_nombre := coalesce(v_presentacion ->> 'nombre', 'Presentación');
        else
            v_precio := v_producto.precio;
            v_unidades := 1;
            v_presentacion_nombre := 'Presentación';
            v_presentacion_id := 'base';
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

    update public.pedidos set total_referencial = v_total where id = v_pedido_id;
    return query select v_pedido_id, v_codigo, v_total;
end;
$$;

revoke all on function public.crear_pedido(
    text,text,text,text,text,text,text,text,text,jsonb
) from public;

grant execute on function public.crear_pedido(
    text,text,text,text,text,text,text,text,text,jsonb
) to anon, authenticated;

-- LISTO: si Supabase muestra "Success. No rows returned", quedó aplicado.
