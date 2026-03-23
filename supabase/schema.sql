-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for profiles
alter table public.profiles enable row level security;
create policy "Only authenticated users can view profiles" on public.profiles for select using (auth.role() = 'authenticated');
create policy "Only authenticated users can update profiles" on public.profiles for update using (auth.role() = 'authenticated');

-- Trigger to create profile on signup
create or function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ORDERS
create type payment_method_type as enum ('Efectivo', 'Transferencia', 'Pendiente');
create type order_status_type as enum ('Pendiente', 'Entregado', 'Pagado', 'Cancelado');

create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  folio serial,
  client_name text not null,
  phone text,
  address text not null,
  date date not null,
  time time not null,
  price numeric(10, 2) not null,
  payment_method payment_method_type default 'Pendiente',
  status order_status_type default 'Pendiente',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for orders
alter table public.orders enable row level security;
create policy "Only authenticated users can perform CRUD on orders" on public.orders for all using (auth.role() = 'authenticated');


-- EXPENSES
create table public.expenses (
  id uuid default uuid_generate_v4() primary key,
  date date not null,
  concept text not null,
  category text not null,
  amount numeric(10, 2) not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for expenses
alter table public.expenses enable row level security;
create policy "Only authenticated users can perform CRUD on expenses" on public.expenses for all using (auth.role() = 'authenticated');
