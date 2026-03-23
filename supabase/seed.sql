-- Limpiamos tablas
truncate table public.orders restart identity cascade;
truncate table public.expenses restart identity cascade;

-- Insertamos pedidos de prueba
insert into public.orders (client_name, phone, address, date, time, price, payment_method, status, notes)
values 
  ('Abarrotes Don Pepe', '555-0101', 'Av. Universidad 100', current_date, '09:00:00', 800.00, 'Efectivo', 'Entregado', ''),
  ('Familia Gómez', '555-0102', 'Priv. Jazmines 45', current_date, '11:30:00', 800.00, 'Pendiente', 'Pendiente', 'Llamar al llegar a caseta'),
  ('Restaurante El Mar', '555-0103', 'Blvd. Costero 500', current_date, '14:00:00', 1600.00, 'Transferencia', 'Pendiente', 'Requieren 2 pipas seguidas');

-- Insertamos egresos de prueba
insert into public.expenses (date, concept, category, amount, notes)
values
  (current_date, 'Gasolina Camión 1 (Placas XYZ)', 'Combustible', 1500.00, 'Factura solicitada'),
  (current_date, 'Mantenimiento Bomba', 'Mantenimiento', 850.00, 'Taller mecánico Don Juan'),
  (current_date - interval '1 day', 'Recarga Saldo Teléfono', 'Servicios', 200.00, 'Línea de atención');
