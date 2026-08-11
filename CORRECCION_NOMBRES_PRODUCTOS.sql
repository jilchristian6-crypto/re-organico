-- Corrección de nombres de productos Re Orgánico
-- Opcional: la web ya muestra estos nombres correctamente, pero este SQL deja Supabase también actualizado.

update public.productos
set nombre = 'Bolsa compostable tipo taco 25 × 35 cm MY14',
    descripcion = 'Bolsa compostable tipo taco. Venta mínima: 1 pack de 100 bolsas.'
where id = 'bolsa-taco-25x35-my14';

update public.productos
set nombre = 'Bolsa de basura compostable blanca en rollo 50 × 60 cm MY16',
    descripcion = 'Bolsa de basura compostable blanca en rollo. Cada rollo trae 25 bolsas.'
where id = 'rollo-basura-50x60-my16';

update public.productos
set nombre = 'Bolsa de basura compostable blanca en rollo 70 × 90 cm MY20',
    descripcion = 'Bolsa de basura compostable blanca en rollo. Cada rollo trae 20 bolsas.'
where id = 'rollo-basura-70x90-my20';

update public.productos
set nombre = 'Bolsa compostable tipo camiseta en rollo 34 × 50 cm MY11',
    descripcion = 'Bolsa compostable tipo camiseta en rollo. Cada rollo contiene 200 bolsas.'
where id = 'rollo-camiseta-34x50-my11';
