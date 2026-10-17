-- Limpiamos tablas
truncate table public.pedidos restart identity cascade;
truncate table public.egresos restart identity cascade;

-- Insertamos pedidos de prueba
insert into public.pedidos (nombre_cliente, telefono, direccion, fecha, hora, precio, metodo_pago, estado, notas)
values 
  ('Abarrotes Don Pepe', '555-0101', 'Av. Universidad 100', current_date, '09:00:00', 800.00, 'Efectivo', 'Entregado', ''),
  ('Familia Gómez', '555-0102', 'Priv. Jazmines 45', current_date, '11:30:00', 800.00, 'Pendiente', 'Pendiente', 'Llamar al llegar a caseta'),
  ('Restaurante El Mar', '555-0103', 'Blvd. Costero 500', current_date, '14:00:00', 1600.00, 'Transferencia', 'Pendiente', 'Requieren 2 pipas seguidas');

-- Insertamos egresos de prueba
insert into public.egresos (fecha, concepto, categoria, monto, notas)
values
  (current_date, 'Gasolina Camión 1 (Placas XYZ)', 'Combustible', 1500.00, 'Factura solicitada'),
  (current_date, 'Mantenimiento Bomba', 'Mantenimiento', 850.00, 'Taller mecánico Don Juan'),
  (current_date - interval '1 day', 'Recarga Saldo Teléfono', 'Servicios', 200.00, 'Línea de atención');
