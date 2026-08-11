-- =========================================================
-- RE ORGÁNICO: DESPACHOS SOLO CON TRANSFERENCIA
-- Ejecuta este archivo una sola vez en Supabase > SQL Editor.
-- =========================================================

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
