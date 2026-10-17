-- Renombra tablas, columnas y tipos de la base de datos al español.
-- Conserva todos los datos: solo cambia nombres (ALTER ... RENAME).
-- Ejecutar UNA sola vez en Supabase > SQL Editor, justo cuando se publique
-- la versión del código que usa los nombres nuevos. Hacer respaldo antes.

begin;

-- PERFILES
alter table public.profiles rename to perfiles;
alter table public.perfiles rename column email to correo;
alter table public.perfiles rename column created_at to fecha_creacion;

-- La función del trigger de registro inserta en la tabla de perfiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.perfiles (id, correo)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- TIPOS
alter type public.payment_method_type rename to tipo_metodo_pago;
alter type public.order_status_type rename to tipo_estado_pedido;

-- PEDIDOS
alter table public.orders rename to pedidos;
alter table public.pedidos rename column client_name to nombre_cliente;
alter table public.pedidos rename column phone to telefono;
alter table public.pedidos rename column address to direccion;
alter table public.pedidos rename column date to fecha;
alter table public.pedidos rename column time to hora;
alter table public.pedidos rename column price to precio;
alter table public.pedidos rename column payment_method to metodo_pago;
alter table public.pedidos rename column status to estado;
alter table public.pedidos rename column notes to notas;
alter table public.pedidos rename column created_at to fecha_creacion;
alter table public.pedidos rename column updated_at to fecha_actualizacion;

-- EGRESOS
alter table public.expenses rename to egresos;
alter table public.egresos rename column date to fecha;
alter table public.egresos rename column concept to concepto;
alter table public.egresos rename column category to categoria;
alter table public.egresos rename column amount to monto;
alter table public.egresos rename column notes to notas;
alter table public.egresos rename column created_at to fecha_creacion;
alter table public.egresos rename column updated_at to fecha_actualizacion;

-- Las políticas RLS siguen ligadas a las tablas; solo se renombran para que se lean en español
alter policy "Only authenticated users can view profiles" on public.perfiles rename to "Solo usuarios autenticados pueden ver perfiles";
alter policy "Only authenticated users can update profiles" on public.perfiles rename to "Solo usuarios autenticados pueden actualizar perfiles";
alter policy "Only authenticated users can perform CRUD on orders" on public.pedidos rename to "Solo usuarios autenticados pueden gestionar pedidos";
alter policy "Only authenticated users can perform CRUD on expenses" on public.egresos rename to "Solo usuarios autenticados pueden gestionar egresos";

commit;

-- Avisar a la API de Supabase (PostgREST) que recargue el esquema
notify pgrst, 'reload schema';
