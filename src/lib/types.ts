export type OrderStatus = 'Pendiente' | 'Entregado' | 'Pagado' | 'Cancelado'
export type PaymentMethod = 'Efectivo' | 'Transferencia' | 'Pendiente'

export interface Order {
  id: string
  folio: number
  nombre_cliente: string
  telefono: string | null
  direccion: string
  fecha: string
  hora: string
  precio: number
  metodo_pago: PaymentMethod
  estado: OrderStatus
  notas: string | null
  fecha_creacion: string
  fecha_actualizacion: string
}

export interface Expense {
  id: string
  fecha: string
  concepto: string
  categoria: string
  monto: number
  notas: string | null
  fecha_creacion: string
  fecha_actualizacion: string
}
