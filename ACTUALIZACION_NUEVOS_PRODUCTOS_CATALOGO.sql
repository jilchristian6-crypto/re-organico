-- =========================================================
-- RE ORGÁNICO: NUEVOS PRODUCTOS COMPOSTABLES
-- Catálogo entregado en CamScanner 07-08-26 (4 páginas).
-- Agrega 50 productos nuevos con Pack + Caja completa.
-- Seguro de ejecutar más de una vez (UPSERT por id).
-- =========================================================

alter table public.productos add column if not exists medida text;
alter table public.productos add column if not exists micras integer;
alter table public.productos add column if not exists presentaciones jsonb not null default '[]'::jsonb;

alter table public.productos
    drop constraint if exists productos_categoria_check;

alter table public.productos
    add constraint productos_categoria_check
    check (categoria in ('alimentos', 'cuidado', 'hogar', 'bolsas', 'rollos', 'papel', 'contenedores', 'vasos', 'tapas', 'heladeria', 'cubiertos', 'bombillas'));

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('pulpa-fast-food-191x136-ydb001','Contenedor con tapa de pulpa de celulosa Fast Food 191 × 136 mm',6817,'contenedores','Contenedor compostable de pulpa de celulosa con tapa, formato rectangular pequeño alto. Código YDB001. Venta mínima: 1 pack de 25 contenedores.','🥡','Pulpa celulosa','disponible',14,'191 × 136 mm',null,'[{"id":"pack-25","nombre":"Pack","unidades":25,"unidad":"contenedores","precio":6817,"detalle":"1 pack = 25 contenedores"},{"id":"caja","nombre":"Caja completa","unidades":500,"unidad":"contenedores","precio":123560,"detalle":"1 caja = 500 contenedores"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('pulpa-fast-food-251x162-ydb0030','Contenedor con tapa de pulpa de celulosa Fast Food 251 × 162 mm',20557,'contenedores','Contenedor compostable de pulpa de celulosa con tapa, formato rectangular grande. Código YDB0030. Venta mínima: 1 pack de 50 contenedores.','🥡','Pulpa celulosa','disponible',15,'251 × 162 mm',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"contenedores","precio":20557,"detalle":"1 pack = 50 contenedores"},{"id":"caja","nombre":"Caja completa","unidades":500,"unidad":"contenedores","precio":186302,"detalle":"1 caja = 500 contenedores"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('pulpa-fast-food-240x160-ydb040','Contenedor con tapa de pulpa de celulosa Fast Food 240 × 160 mm',21880,'contenedores','Contenedor compostable de pulpa de celulosa con tapa, formato rectangular. Código YDB040. Venta mínima: 1 pack de 50 contenedores.','🥡','Pulpa celulosa','disponible',16,'240 × 160 mm',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"contenedores","precio":21880,"detalle":"1 pack = 50 contenedores"},{"id":"caja","nombre":"Caja completa","unidades":250,"unidad":"contenedores","precio":99144,"detalle":"1 caja = 250 contenedores"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('pulpa-fast-food-153x147-ydb003','Contenedor con tapa de pulpa de celulosa Fast Food 153 × 147 mm',7754,'contenedores','Contenedor compostable de pulpa de celulosa con tapa, formato cuadrado. Código YDB003. Venta mínima: 1 pack de 25 contenedores.','🥡','Pulpa celulosa','disponible',17,'153 × 147 mm',null,'[{"id":"pack-25","nombre":"Pack","unidades":25,"unidad":"contenedores","precio":7754,"detalle":"1 pack = 25 contenedores"},{"id":"caja","nombre":"Caja completa","unidades":500,"unidad":"contenedores","precio":140542,"detalle":"1 caja = 500 contenedores"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('pulpa-fast-food-172x113-ydb004','Contenedor con tapa de pulpa de celulosa Fast Food 172 × 113 mm',12220,'contenedores','Contenedor compostable de pulpa de celulosa con tapa, formato pequeño bajo. Código YDB004. Venta mínima: 1 pack de 50 contenedores.','🥡','Pulpa celulosa','disponible',18,'172 × 113 mm',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"contenedores","precio":12220,"detalle":"1 pack = 50 contenedores"},{"id":"caja","nombre":"Caja completa","unidades":1000,"unidad":"contenedores","precio":221485,"detalle":"1 caja = 1.000 contenedores"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('pulpa-fast-food-145x141-ydb024','Contenedor con tapa de pulpa de celulosa para sándwich 145 × 141 mm',12220,'contenedores','Contenedor compostable de pulpa de celulosa con tapa para sándwich. Código YDB024. Venta mínima: 1 pack de 50 contenedores.','🥪','Pulpa celulosa','disponible',19,'145 × 141 mm',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"contenedores","precio":12220,"detalle":"1 pack = 50 contenedores"},{"id":"caja","nombre":"Caja completa","unidades":500,"unidad":"contenedores","precio":110743,"detalle":"1 caja = 500 contenedores"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('pulpa-fast-food-218x207-ydb026','Contenedor con tapa de pulpa de celulosa Fast Food 218 × 207 mm',25858,'contenedores','Contenedor compostable de pulpa de celulosa con tapa, formato cuadrado grande bajo. Código YDB026. Venta mínima: 1 pack de 50 contenedores.','🥡','Pulpa celulosa','disponible',20,'218 × 207 mm',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"contenedores","precio":25858,"detalle":"1 pack = 50 contenedores"},{"id":"caja","nombre":"Caja completa","unidades":250,"unidad":"contenedores","precio":117170,"detalle":"1 caja = 250 contenedores"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('bambu-pote-ensalada-1200-1bg055','Pote ensalada Bio-Eco bambú 1.200 cc',34540,'contenedores','Pote redondo de bambú para ensalada, capacidad 1.200 cc. Código 1BG055. Venta mínima: 1 pack de 50 potes.','🥗','Bambú','disponible',21,'1.200 cc',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"potes","precio":34540,"detalle":"1 pack = 50 potes"},{"id":"caja","nombre":"Caja completa","unidades":300,"unidad":"potes","precio":187814,"detalle":"1 caja = 300 potes"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('bambu-tapa-cpla-1200-1bg056','Tapa transparente C-PLA para pote de 1.200 cc',23449,'tapas','Tapa transparente C-PLA compatible con el pote Bio-Eco bambú 1BG055 de 1.200 cc. Código 1BG056. Venta mínima: 1 pack de 50 tapas.','🥣','C-PLA','disponible',22,'1.200 cc',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"tapas","precio":23449,"detalle":"1 pack = 50 tapas"},{"id":"caja","nombre":"Caja completa","unidades":300,"unidad":"tapas","precio":127502,"detalle":"1 caja = 300 tapas"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('bambu-pote-ensalada-750-1bg052','Pote ensalada Bio-Eco bambú 750 cc',23946,'contenedores','Pote redondo de bambú para ensalada, capacidad 750 cc. Código 1BG052. Venta mínima: 1 pack de 50 potes.','🥗','Bambú','disponible',23,'750 cc',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"potes","precio":23946,"detalle":"1 pack = 50 potes"},{"id":"caja","nombre":"Caja completa","unidades":300,"unidad":"potes","precio":130205,"detalle":"1 caja = 300 potes"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('bambu-tapa-cpla-750-1bg053','Tapa transparente C-PLA para pote de 750 cc',17667,'tapas','Tapa transparente C-PLA compatible con el pote Bio-Eco bambú 1BG052 de 750 cc. Código 1BG053. Venta mínima: 1 pack de 50 tapas.','🥣','C-PLA','disponible',24,'750 cc',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"tapas","precio":17667,"detalle":"1 pack = 50 tapas"},{"id":"caja","nombre":"Caja completa","unidades":300,"unidad":"tapas","precio":96065,"detalle":"1 caja = 300 tapas"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('bambu-soup-bucket-500-1bg606','Soup Bucket compostable Bio-Eco bambú + PLA 500 cc',10764,'contenedores','Pote tipo soup bucket compostable de bambú + PLA, capacidad 500 cc. Código 1BG606. Venta mínima: 1 pack de 25 potes.','🍲','Bambú + PLA','disponible',25,'500 cc',null,'[{"id":"pack-25","nombre":"Pack","unidades":25,"unidad":"potes","precio":10764,"detalle":"1 pack = 25 potes"},{"id":"caja","nombre":"Caja completa","unidades":500,"unidad":"potes","precio":195105,"detalle":"1 caja = 500 potes"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('bambu-tapa-soup-bucket-500-1bg607','Tapa para Soup Bucket bambú + PLA 500 cc',10064,'tapas','Tapa compatible con Soup Bucket Bio-Eco de 500 cc. Código 1BG607. Venta mínima: 1 pack de 25 tapas.','🥣','Bambú + PLA','disponible',26,'500 cc',null,'[{"id":"pack-25","nombre":"Pack","unidades":25,"unidad":"tapas","precio":10064,"detalle":"1 pack = 25 tapas"},{"id":"caja","nombre":"Caja completa","unidades":500,"unidad":"tapas","precio":182417,"detalle":"1 caja = 500 tapas"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('vaso-biopla-200-1vp185','Vaso Kristal BioPLA 200 cc',8033,'vasos','Vaso transparente BioPLA de 200 cc. Código 1VP185. Venta mínima: 1 pack de 50 vasos.','🥤','BioPLA','disponible',27,'200 cc',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"vasos","precio":8033,"detalle":"1 pack = 50 vasos"},{"id":"caja","nombre":"Caja completa","unidades":1250,"unidad":"vasos","precio":183733,"detalle":"1 caja = 1.250 vasos"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('vaso-biopla-400-1vp184','Vaso Kristal BioPLA 400 cc',9954,'vasos','Vaso transparente BioPLA de 400 cc. Código 1VP184. Venta mínima: 1 pack de 50 vasos.','🥤','BioPLA','disponible',28,'400 cc',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"vasos","precio":9954,"detalle":"1 pack = 50 vasos"},{"id":"caja","nombre":"Caja completa","unidades":1000,"unidad":"vasos","precio":180418,"detalle":"1 caja = 1.000 vasos"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('vaso-biopla-500-1vp180','Vaso Kristal BioPLA 500 cc',11946,'vasos','Vaso transparente BioPLA de 500 cc. Código 1VP180. Venta mínima: 1 pack de 50 vasos.','🥤','BioPLA','disponible',29,'500 cc',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"vasos","precio":11946,"detalle":"1 pack = 50 vasos"},{"id":"caja","nombre":"Caja completa","unidades":800,"unidad":"vasos","precio":173210,"detalle":"1 caja = 800 vasos"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('tapa-domo-biopla-400-1vp189','Tapa domo BioPLA para vaso 400 cc Ø85 mm',7925,'tapas','Tapa domo transparente BioPLA para vaso de 400 cc, disponible con o sin perforación. Código 1VP189. Venta mínima: 1 pack de 50 tapas.','🥤','Tapa domo','disponible',30,'Ø85 mm',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"tapas","precio":7925,"detalle":"1 pack = 50 tapas"},{"id":"caja","nombre":"Caja completa","unidades":600,"unidad":"tapas","precio":86189,"detalle":"1 caja = 600 tapas"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('tapa-plana-biopla-400-1vp191','Tapa plana BioPLA para vaso 400 cc Ø85 mm',7660,'tapas','Tapa plana transparente BioPLA para vaso de 400 cc con corte cruz. Código 1VP191. Venta mínima: 1 pack de 50 tapas.','🥤','Tapa plana','disponible',31,'Ø85 mm',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"tapas","precio":7660,"detalle":"1 pack = 50 tapas"},{"id":"caja","nombre":"Caja completa","unidades":800,"unidad":"tapas","precio":111067,"detalle":"1 caja = 800 tapas"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('tapa-domo-biopla-500-1vp176','Tapa domo BioPLA para vaso 500 cc Ø95 mm',8936,'tapas','Tapa domo transparente BioPLA para vaso de 500 cc, disponible con o sin perforación. Código 1VP176. Venta mínima: 1 pack de 50 tapas.','🥤','Tapa domo','disponible',32,'Ø95 mm',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"tapas","precio":8936,"detalle":"1 pack = 50 tapas"},{"id":"caja","nombre":"Caja completa","unidades":800,"unidad":"tapas","precio":129578,"detalle":"1 caja = 800 tapas"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('tapa-plana-biopla-500-1vp177','Tapa plana BioPLA para vaso 500 cc Ø95 mm',8722,'tapas','Tapa plana transparente BioPLA para vaso de 500 cc con corte cruz. Código 1VP177. Venta mínima: 1 pack de 50 tapas.','🥤','Tapa plana','disponible',33,'Ø95 mm',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"tapas","precio":8722,"detalle":"1 pack = 50 tapas"},{"id":"caja","nombre":"Caja completa","unidades":800,"unidad":"tapas","precio":126472,"detalle":"1 caja = 800 tapas"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('vaso-papel-bambu-2-5oz-1bg668','Vaso papel bambú + PLA Bio-Eco 2,5 oz / 75 cc',7214,'vasos','Vaso de papel bambú + PLA Bio-Eco de 2,5 oz, capacidad aproximada 75 cc. Código 1BG668. Venta mínima: 1 pack de 100 vasos.','☕','Bambú + PLA','disponible',34,'2,5 oz / 75 cc',null,'[{"id":"pack-100","nombre":"Pack","unidades":100,"unidad":"vasos","precio":7214,"detalle":"1 pack = 100 vasos"},{"id":"caja","nombre":"Caja completa","unidades":2000,"unidad":"vasos","precio":130758,"detalle":"1 caja = 2.000 vasos"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('vaso-papel-bambu-4oz-1bg669','Vaso papel bambú + PLA Bio-Eco 4 oz / 120 cc',4337,'vasos','Vaso de papel bambú + PLA Bio-Eco de 4 oz, capacidad 120 cc. Código 1BG669. Venta mínima: 1 pack de 50 vasos.','☕','Bambú + PLA','disponible',35,'4 oz / 120 cc',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"vasos","precio":4337,"detalle":"1 pack = 50 vasos"},{"id":"caja","nombre":"Caja completa","unidades":2000,"unidad":"vasos","precio":157221,"detalle":"1 caja = 2.000 vasos"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('vaso-papel-bambu-7oz-1bg670','Vaso papel bambú + PLA Bio-Eco 7 oz / 200 cc',5607,'vasos','Vaso de papel bambú + PLA Bio-Eco de 7 oz, capacidad 200 cc. Código 1BG670. Venta mínima: 1 pack de 50 vasos.','☕','Bambú + PLA','disponible',36,'7 oz / 200 cc',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"vasos","precio":5607,"detalle":"1 pack = 50 vasos"},{"id":"caja","nombre":"Caja completa","unidades":2000,"unidad":"vasos","precio":203264,"detalle":"1 caja = 2.000 vasos"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('vaso-papel-bambu-8oz-1bg672','Vaso papel bambú + PLA Bio-Eco 8 oz / 250 cc',6764,'vasos','Vaso de papel bambú + PLA Bio-Eco de 8 oz, capacidad 250 cc. Código 1BG672. Venta mínima: 1 pack de 50 vasos.','☕','Bambú + PLA','disponible',37,'8 oz / 250 cc',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"vasos","precio":6764,"detalle":"1 pack = 50 vasos"},{"id":"caja","nombre":"Caja completa","unidades":1000,"unidad":"vasos","precio":122590,"detalle":"1 caja = 1.000 vasos"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('vaso-papel-bambu-10oz-1bg674','Vaso papel bambú + PLA Bio-Eco 10 oz / 300 cc',9742,'vasos','Vaso de papel bambú + PLA Bio-Eco de 10 oz, capacidad 300 cc. Código 1BG674. Venta mínima: 1 pack de 50 vasos.','☕','Bambú + PLA','disponible',38,'10 oz / 300 cc',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"vasos","precio":9742,"detalle":"1 pack = 50 vasos"},{"id":"caja","nombre":"Caja completa","unidades":1000,"unidad":"vasos","precio":176570,"detalle":"1 caja = 1.000 vasos"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('vaso-papel-bambu-12oz-1bg676','Vaso papel bambú + PLA Bio-Eco 12 oz / 350 cc',10745,'vasos','Vaso de papel bambú + PLA Bio-Eco de 12 oz, capacidad 350 cc. Código 1BG676. Venta mínima: 1 pack de 50 vasos.','☕','Bambú + PLA','disponible',39,'12 oz / 350 cc',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"vasos","precio":10745,"detalle":"1 pack = 50 vasos"},{"id":"caja","nombre":"Caja completa","unidades":1000,"unidad":"vasos","precio":187113,"detalle":"1 caja = 1.000 vasos"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('vaso-papel-blanco-16oz-1bg039','Vaso papel blanco + PLA Bio-Eco 16 oz / 470 cc',13356,'vasos','Vaso de papel blanco + PLA Bio-Eco de 16 oz, capacidad aproximada 470 cc. Código 1BG039. Venta mínima: 1 pack de 50 vasos.','☕','Blanco + PLA','disponible',40,'16 oz / 470 cc',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"vasos","precio":13356,"detalle":"1 pack = 50 vasos"},{"id":"caja","nombre":"Caja completa","unidades":1000,"unidad":"vasos","precio":242074,"detalle":"1 caja = 1.000 vasos"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('tapa-pico-dm80-1bg3358','Tapa con pico C-PLA Bio-Eco DM80 para vaso 8 oz',12733,'tapas','Tapa C-PLA Bio-Eco con pico DM80 para vaso de 8 oz. Código 1BG3358. Venta mínima: 1 pack de 100 tapas.','🥤','C-PLA','disponible',41,'DM80 / 8 oz',null,'[{"id":"pack-100","nombre":"Pack","unidades":100,"unidad":"tapas","precio":12733,"detalle":"1 pack = 100 tapas"},{"id":"caja","nombre":"Caja completa","unidades":1000,"unidad":"tapas","precio":125616,"detalle":"1 caja = 1.000 tapas"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('tapa-pico-dm90-1bg359','Tapa con pico C-PLA Bio-Eco DM90 para vasos 10, 12 y 16 oz',13090,'tapas','Tapa C-PLA Bio-Eco con pico DM90 compatible con vasos de 10, 12 y 16 oz. Código 1BG359. Venta mínima: 1 pack de 100 tapas.','🥤','C-PLA','disponible',42,'DM90 / 10-16 oz',null,'[{"id":"pack-100","nombre":"Pack","unidades":100,"unidad":"tapas","precio":13090,"detalle":"1 pack = 100 tapas"},{"id":"caja","nombre":"Caja completa","unidades":1000,"unidad":"tapas","precio":129413,"detalle":"1 caja = 1.000 tapas"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('pote-helado-bambu-160-1bg174','Pote helado Bio-Eco bambú + PLA 160 cc',36446,'heladeria','Pote para helado Bio-Eco de bambú + PLA, capacidad 160 cc. Código 1BG174. Venta mínima: 1 pack de 200 potes.','🍨','Bambú + PLA','disponible',43,'160 cc',null,'[{"id":"pack-200","nombre":"Pack","unidades":200,"unidad":"potes","precio":36446,"detalle":"1 pack = 200 potes"},{"id":"caja","nombre":"Caja completa","unidades":1400,"unidad":"potes","precio":231207,"detalle":"1 caja = 1.400 potes"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('pote-helado-blanco-80-1bg090','Pote helado Bio-Eco blanco + PLA 80 cc',43260,'heladeria','Pote para helado Bio-Eco blanco + PLA, capacidad 80 cc. Código 1BG090. Venta mínima: 1 pack de 250 potes.','🍨','Blanco + PLA','disponible',44,'80 cc',null,'[{"id":"pack-250","nombre":"Pack","unidades":250,"unidad":"potes","precio":43260,"detalle":"1 pack = 250 potes"},{"id":"caja","nombre":"Caja completa","unidades":2250,"unidad":"potes","precio":352838,"detalle":"1 caja = 2.250 potes"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('pote-helado-blanco-120-1bg092','Pote helado Bio-Eco blanco + PLA 120 cc',46644,'heladeria','Pote para helado Bio-Eco blanco + PLA, capacidad 120 cc. Código 1BG092. Venta mínima: 1 pack de 250 potes.','🍨','Blanco + PLA','disponible',45,'120 cc',null,'[{"id":"pack-250","nombre":"Pack","unidades":250,"unidad":"potes","precio":46644,"detalle":"1 pack = 250 potes"},{"id":"caja","nombre":"Caja completa","unidades":2000,"unidad":"potes","precio":338170,"detalle":"1 caja = 2.000 potes"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('pote-helado-blanco-160-1bg094','Pote helado Bio-Eco blanco + PLA 160 cc',42490,'heladeria','Pote para helado Bio-Eco blanco + PLA, capacidad 160 cc. Código 1BG094. Venta mínima: 1 pack de 200 potes.','🍨','Blanco + PLA','disponible',46,'160 cc',null,'[{"id":"pack-200","nombre":"Pack","unidades":200,"unidad":"potes","precio":42490,"detalle":"1 pack = 200 potes"},{"id":"caja","nombre":"Caja completa","unidades":1400,"unidad":"potes","precio":269544,"detalle":"1 caja = 1.400 potes"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('pote-helado-blanco-200-1bg096','Pote helado Bio-Eco blanco + PLA 200 cc',42935,'heladeria','Pote para helado Bio-Eco blanco + PLA, capacidad 200 cc. Código 1BG096. Venta mínima: 1 pack de 200 potes.','🍨','Blanco + PLA','disponible',47,'200 cc',null,'[{"id":"pack-200","nombre":"Pack","unidades":200,"unidad":"potes","precio":42935,"detalle":"1 pack = 200 potes"},{"id":"caja","nombre":"Caja completa","unidades":1400,"unidad":"potes","precio":269092,"detalle":"1 caja = 1.400 potes"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('pote-helado-blanco-230-1bg097','Pote helado Bio-Eco blanco + PLA 230 cc',46034,'heladeria','Pote para helado Bio-Eco blanco + PLA, capacidad 230 cc. Código 1BG097. Venta mínima: 1 pack de 180 potes.','🍨','Blanco + PLA','disponible',48,'230 cc',null,'[{"id":"pack-180","nombre":"Pack","unidades":180,"unidad":"potes","precio":46034,"detalle":"1 pack = 180 potes"},{"id":"caja","nombre":"Caja completa","unidades":1260,"unidad":"potes","precio":292029,"detalle":"1 caja = 1.260 potes"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('tenedor-pla-16-5-1vp220','Tenedor Bio-Eco PLA 16,5 cm',5457,'cubiertos','Tenedor compostable Bio-Eco PLA de 16,5 cm. Código 1VP220. Venta mínima: 1 pack de 50 tenedores.','🍴','PLA','disponible',49,'16,5 cm',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"tenedores","precio":5457,"detalle":"1 pack = 50 tenedores"},{"id":"caja","nombre":"Caja completa","unidades":1000,"unidad":"tenedores","precio":98907,"detalle":"1 caja = 1.000 tenedores"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('cuchillo-pla-16-5-1vp224','Cuchillo Bio-Eco PLA 16,5 cm',5457,'cubiertos','Cuchillo compostable Bio-Eco PLA de 16,5 cm. Código 1VP224. Venta mínima: 1 pack de 50 cuchillos.','🍴','PLA','disponible',50,'16,5 cm',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"cuchillos","precio":5457,"detalle":"1 pack = 50 cuchillos"},{"id":"caja","nombre":"Caja completa","unidades":1000,"unidad":"cuchillos","precio":98907,"detalle":"1 caja = 1.000 cuchillos"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('cuchara-pla-15-1vp222','Cuchara Bio-Eco PLA 15 cm',5457,'cubiertos','Cuchara compostable Bio-Eco PLA de 15 cm. Código 1VP222. Venta mínima: 1 pack de 50 cucharas.','🥄','PLA','disponible',51,'15 cm',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"cucharas","precio":5457,"detalle":"1 pack = 50 cucharas"},{"id":"caja","nombre":"Caja completa","unidades":1000,"unidad":"cucharas","precio":98907,"detalle":"1 caja = 1.000 cucharas"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('pack-tenedor-servilleta-1vp125','Pack Bio-Eco PLA tenedor + servilleta',5955,'cubiertos','Set en bolsita con tenedor y servilleta Bio-Eco PLA. Código 1VP125. Venta mínima: 1 pack de 25 sets.','🍴','En bolsita','disponible',52,null,null,'[{"id":"pack-25","nombre":"Pack","unidades":25,"unidad":"sets","precio":5955,"detalle":"1 pack = 25 sets"},{"id":"caja","nombre":"Caja completa","unidades":500,"unidad":"sets","precio":107938,"detalle":"1 caja = 500 sets"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('pack-bis-servilleta-1vp126','Pack Bio-Eco PLA tenedor + cuchillo + servilleta',9156,'cubiertos','Set en bolsita con tenedor, cuchillo y servilleta Bio-Eco PLA. Código 1VP126. Venta mínima: 1 pack de 25 sets.','🍴','En bolsita','disponible',53,null,null,'[{"id":"pack-25","nombre":"Pack","unidades":25,"unidad":"sets","precio":9156,"detalle":"1 pack = 25 sets"},{"id":"caja","nombre":"Caja completa","unidades":250,"unidad":"sets","precio":82978,"detalle":"1 caja = 250 sets"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('pack-tris-servilleta-1vp129','Pack Bio-Eco PLA tenedor + cuchillo + cuchara + servilleta',13736,'cubiertos','Set en bolsita con tenedor, cuchillo, cuchara y servilleta Bio-Eco PLA. Código 1VP129. Venta mínima: 1 pack de 25 sets.','🍴','En bolsita','disponible',54,null,null,'[{"id":"pack-25","nombre":"Pack","unidades":25,"unidad":"sets","precio":13736,"detalle":"1 pack = 25 sets"},{"id":"caja","nombre":"Caja completa","unidades":250,"unidad":"sets","precio":124481,"detalle":"1 caja = 250 sets"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('paletita-helado-pla-10cm-1bg153','Paletita para helado PLA Bio-Eco 10 cm',24607,'heladeria','Paletita compostable para helado PLA Bio-Eco de 10 cm. Código 1BG153. Venta mínima: 1 pack de 500 paletitas.','🍦','Accesorio helado','disponible',55,'10 cm',null,'[{"id":"pack-500","nombre":"Pack","unidades":500,"unidad":"paletitas","precio":24607,"detalle":"1 pack = 500 paletitas"},{"id":"caja","nombre":"Caja completa","unidades":5000,"unidad":"paletitas","precio":223004,"detalle":"1 caja = 5.000 paletitas"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('cucharita-helado-pla-10-5-1vp226','Cucharita Bio-Eco PLA 10,5 cm',5979,'heladeria','Cucharita compostable Bio-Eco PLA de 10,5 cm, ideal para helados y postres. Código 1VP226. Venta mínima: 1 pack de 100 cucharitas.','🥄','Accesorio helado','disponible',56,'10,5 cm',null,'[{"id":"pack-100","nombre":"Pack","unidades":100,"unidad":"cucharitas","precio":5979,"detalle":"1 pack = 100 cucharitas"},{"id":"caja","nombre":"Caja completa","unidades":2000,"unidad":"cucharitas","precio":108365,"detalle":"1 caja = 2.000 cucharitas"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('bombilla-pla-blanca-1can41','Bombilla Bio-Eco PLA sin fuelle blanca Ø6 × 210 mm',3619,'bombillas','Bombilla compostable Bio-Eco PLA sin fuelle, color blanco. Código 1CAN41. Venta mínima: 1 pack de 150 bombillas.','🥤','Blanca','disponible',57,'Ø6 × 210 mm',null,'[{"id":"pack-150","nombre":"Pack","unidades":150,"unidad":"bombillas","precio":3619,"detalle":"1 pack = 150 bombillas"},{"id":"caja","nombre":"Caja completa","unidades":3450,"unidad":"bombillas","precio":75436,"detalle":"1 caja = 3.450 bombillas"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('bombilla-pla-negra-1can60','Bombilla Bio-Eco PLA sin fuelle negra Ø6 × 210 mm',3969,'bombillas','Bombilla compostable Bio-Eco PLA sin fuelle, color negro. Código 1CAN60. Venta mínima: 1 pack de 150 bombillas.','🥤','Negra','disponible',58,'Ø6 × 210 mm',null,'[{"id":"pack-150","nombre":"Pack","unidades":150,"unidad":"bombillas","precio":3969,"detalle":"1 pack = 150 bombillas"},{"id":"caja","nombre":"Caja completa","unidades":3450,"unidad":"bombillas","precio":82723,"detalle":"1 caja = 3.450 bombillas"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('contenedor-pla-tapa-250-20500','Contenedor rectangular PLA compostable + tapa 250 cc',18098,'contenedores','Contenedor rectangular PLA compostable con tapa, capacidad 250 cc. Código 20500. Venta mínima: 1 pack de 50 contenedores.','🥡','PLA + tapa','disponible',59,'126 × 117 × 40 mm',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"contenedores","precio":18098,"detalle":"1 pack = 50 contenedores"},{"id":"caja","nombre":"Caja completa","unidades":700,"unidad":"contenedores","precio":229624,"detalle":"1 caja = 700 contenedores"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('contenedor-pla-tapa-370-20502','Contenedor rectangular PLA compostable + tapa 370 cc',18415,'contenedores','Contenedor rectangular PLA compostable con tapa, capacidad 370 cc. Código 20502. Venta mínima: 1 pack de 50 contenedores.','🥡','PLA + tapa','disponible',60,'126 × 117 × 56 mm',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"contenedores","precio":18415,"detalle":"1 pack = 50 contenedores"},{"id":"caja","nombre":"Caja completa","unidades":700,"unidad":"contenedores","precio":233647,"detalle":"1 caja = 700 contenedores"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('contenedor-pla-tapa-500-20504','Contenedor rectangular PLA compostable + tapa 500 cc',19215,'contenedores','Contenedor rectangular PLA compostable con tapa, capacidad 500 cc. Código 20504. Venta mínima: 1 pack de 50 contenedores.','🥡','PLA + tapa','disponible',61,'135 × 125 × 56 mm',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"contenedores","precio":19215,"detalle":"1 pack = 50 contenedores"},{"id":"caja","nombre":"Caja completa","unidades":600,"unidad":"contenedores","precio":208959,"detalle":"1 caja = 600 contenedores"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('contenedor-pla-tapa-750-20506','Contenedor rectangular PLA compostable + tapa 750 cc',28712,'contenedores','Contenedor rectangular PLA compostable con tapa, capacidad 750 cc. Código 20506. Venta mínima: 1 pack de 50 contenedores.','🥡','PLA + tapa','disponible',62,'188 × 143 × 52 mm',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"contenedores","precio":28712,"detalle":"1 pack = 50 contenedores"},{"id":"caja","nombre":"Caja completa","unidades":400,"unidad":"contenedores","precio":208164,"detalle":"1 caja = 400 contenedores"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

insert into public.productos (id,nombre,precio,categoria,descripcion,emoji,etiqueta,estado,orden,medida,micras,presentaciones)
values ('contenedor-pla-tapa-1000-20508','Contenedor rectangular PLA compostable + tapa 1.000 cc',34502,'contenedores','Contenedor rectangular PLA compostable con tapa, capacidad 1.000 cc. Código 20508. Venta mínima: 1 pack de 50 contenedores.','🥡','PLA + tapa','disponible',63,'188 × 143 × 67 mm',null,'[{"id":"pack-50","nombre":"Pack","unidades":50,"unidad":"contenedores","precio":34502,"detalle":"1 pack = 50 contenedores"},{"id":"caja","nombre":"Caja completa","unidades":400,"unidad":"contenedores","precio":250142,"detalle":"1 caja = 400 contenedores"}]'::jsonb)
on conflict (id) do update set
 nombre=excluded.nombre, precio=excluded.precio, categoria=excluded.categoria, descripcion=excluded.descripcion,
 emoji=excluded.emoji, etiqueta=excluded.etiqueta, estado=excluded.estado, orden=excluded.orden,
 medida=excluded.medida, micras=excluded.micras, presentaciones=excluded.presentaciones;

-- Verificación: el total de estas nuevas categorías debe sumar 50 productos.
select categoria, count(*) as cantidad
from public.productos
where categoria in ('contenedores','vasos','tapas','heladeria','cubiertos','bombillas')
group by categoria
order by categoria;
