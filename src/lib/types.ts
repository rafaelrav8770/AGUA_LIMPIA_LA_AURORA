export type OrderStatus = 'Pendiente' | 'Entregado' | 'Pagado' | 'Cancelado'
export type PaymentMethod = 'Efectivo' | 'Transferencia' | 'Pendiente'

export interface Order {
  id: string
  folio: number
  client_name: string
  phone: string | null
  address: string
  date: string
  time: string
  price: number
  payment_method: PaymentMethod
  status: OrderStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Expense {
  id: string
  date: string
  concept: string
  category: string
  amount: number
  notes: string | null
  created_at: string
  updated_at: string
}
