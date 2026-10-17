-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.perfiles (
  id uuid references auth.users not null primary key,
  correo text,
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for profiles
alter table public.perfiles enable row level security;
create policy "Solo usuarios autenticados pueden ver perfiles" on public.perfiles for select using (auth.role() = 'authenticated');
create policy "Solo usuarios autenticados pueden actualizar perfiles" on public.perfiles for update using (auth.role() = 'authenticated');

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.perfiles (id, correo)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ORDERS
create type tipo_metodo_pago as enum ('Efectivo', 'Transferencia', 'Pendiente');
create type tipo_estado_pedido as enum ('Pendiente', 'Entregado', 'Pagado', 'Cancelado');

create table public.pedidos (
  id uuid default uuid_generate_v4() primary key,
  folio serial,
  nombre_cliente text not null,
  telefono text,
  direccion text not null,
  fecha date not null,
  hora time not null,
  precio numeric(10, 2) not null,
  metodo_pago tipo_metodo_pago default 'Pendiente',
  estado tipo_estado_pedido default 'Pendiente',
  notas text,
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null,
  fecha_actualizacion timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for orders
alter table public.pedidos enable row level security;
create policy "Solo usuarios autenticados pueden gestionar pedidos" on public.pedidos for all using (auth.role() = 'authenticated');


-- EXPENSES
create table public.egresos (
  id uuid default uuid_generate_v4() primary key,
  fecha date not null,
  concepto text not null,
  categoria text not null,
  monto numeric(10, 2) not null,
  notas text,
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null,
  fecha_actualizacion timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for expenses
alter table public.egresos enable row level security;
create policy "Solo usuarios autenticados pueden gestionar egresos" on public.egresos for all using (auth.role() = 'authenticated');
