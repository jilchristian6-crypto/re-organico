-- =========================================================
-- RE ORGÁNICO - ACTUALIZACIÓN DE PRECIOS POR CAJA
-- Ejecutar en Supabase > SQL Editor > New query > Run
-- Solo modifica el precio de la presentación "Caja completa".
-- No cambia los precios por pack/rollo ni las cantidades.
-- =========================================================

update public.productos
set presentaciones = jsonb_set(presentaciones, '{1,precio}', to_jsonb(76463), false)
where id = 'bolsa-mediana-42x50-my21';

update public.productos
set presentaciones = jsonb_set(presentaciones, '{1,precio}', to_jsonb(100525), false)
where id = 'bolsa-grande-48x55-my22';

update public.productos
set presentaciones = jsonb_set(presentaciones, '{1,precio}', to_jsonb(102655), false)
where id = 'bolsa-grande-48x60-my20';

update public.productos
set presentaciones = jsonb_set(presentaciones, '{1,precio}', to_jsonb(93098), false)
where id = 'bolsa-extra-grande-55x65-my25';

update public.productos
set presentaciones = jsonb_set(presentaciones, '{1,precio}', to_jsonb(155220), false)
where id = 'bolsa-taco-25x35-my14';

update public.productos
set presentaciones = jsonb_set(presentaciones, '{1,precio}', to_jsonb(99446), false)
where id = 'rollo-camiseta-34x50-my11';

update public.productos
set presentaciones = jsonb_set(presentaciones, '{1,precio}', to_jsonb(104073), false)
where id = 'rollo-basura-50x60-my16';

update public.productos
set presentaciones = jsonb_set(presentaciones, '{1,precio}', to_jsonb(95736), false)
where id = 'rollo-basura-70x90-my20';
