-- Agrega la categoría de compostaje y la vermicompostera de cuatro niveles.
alter table public.productos
drop constraint if exists productos_categoria_check;

alter table public.productos
add constraint productos_categoria_check
check (categoria in (
    'alimentos', 'cuidado', 'hogar', 'bolsas', 'rollos', 'papel',
    'contenedores', 'vasos', 'tapas', 'heladeria', 'cubiertos',
    'bombillas', 'compostaje'
));

insert into public.productos (
    id,
    nombre,
    precio,
    categoria,
    descripcion,
    emoji,
    etiqueta,
    estado,
    orden,
    medida,
    micras,
    presentaciones,
    imagen_path
)
values (
    'vermicompostera-4-niveles',
    'Vermicompostera de 4 niveles',
    21000,
    'compostaje',
    'Casa para lombrices californianas, diseñada para producir humus de lombriz a partir de residuos orgánicos.',
    '🪱',
    '4 niveles',
    'disponible',
    0,
    '4 niveles',
    null,
    '[{"id":"unidad","nombre":"Unidad","unidades":1,"unidad":"vermicompostera","precio":21000,"detalle":"1 unidad: vermicompostera de 4 niveles"}]'::jsonb,
    null
)
on conflict (id) do update set
    nombre = excluded.nombre,
    precio = excluded.precio,
    categoria = excluded.categoria,
    descripcion = excluded.descripcion,
    emoji = excluded.emoji,
    etiqueta = excluded.etiqueta,
    estado = excluded.estado,
    orden = excluded.orden,
    medida = excluded.medida,
    micras = excluded.micras,
    presentaciones = excluded.presentaciones;
