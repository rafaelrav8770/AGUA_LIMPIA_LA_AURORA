'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OrderStatus, PaymentMethod } from '@/lib/types'

export async function createOrder(formData: FormData) {
  const supabase = await createClient()

  const data = {
    nombre_cliente: formData.get('client_name') as string,
    telefono: formData.get('phone') as string,
    direccion: formData.get('address') as string,
    fecha: formData.get('date') as string,
    hora: formData.get('time') as string,
    precio: parseFloat(formData.get('price') as string),
    metodo_pago: formData.get('payment_method') as PaymentMethod,
    estado: formData.get('status') as OrderStatus,
    notas: formData.get('notes') as string,
  }

  const { error } = await supabase.from('pedidos').insert(data)

  if (error) {
    console.error('Error creating order:', error)
    throw new Error('No se pudo crear el pedido')
  }

  revalidatePath('/dashboard/pedidos')
  revalidatePath('/dashboard')
  redirect('/dashboard/pedidos')
}

export async function updateOrderStatus(formData: FormData) {
  const supabase = await createClient()
  const orderId = formData.get('orderId') as string
  const newStatus = formData.get('newStatus') as OrderStatus
  const newPaymentMethod = formData.get('newPaymentMethod') as PaymentMethod | null

  const updateData: { estado: OrderStatus; metodo_pago?: PaymentMethod } = { estado: newStatus }
  if (newPaymentMethod) {
    updateData.metodo_pago = newPaymentMethod
  }

  const { error } = await supabase
    .from('pedidos')
    .update(updateData)
    .eq('id', orderId)

  if (error) {
    console.error('Error updating order:', error)
    throw new Error('No se pudo actualizar el estado')
  }

  revalidatePath('/dashboard/pedidos')
  revalidatePath('/dashboard')
}

export async function updateOrder(formData: FormData) {
  const supabase = await createClient()
  const orderId = formData.get('orderId') as string
  
  const data = {
    nombre_cliente: formData.get('client_name') as string,
    telefono: formData.get('phone') as string,
    direccion: formData.get('address') as string,
    fecha: formData.get('date') as string,
    hora: formData.get('time') as string,
    precio: parseFloat(formData.get('price') as string),
    metodo_pago: formData.get('payment_method') as PaymentMethod,
    estado: formData.get('status') as OrderStatus,
    notas: formData.get('notes') as string,
  }

  const { error } = await supabase
    .from('pedidos')
    .update(data)
    .eq('id', orderId)

  if (error) {
    throw new Error('No se pudo actualizar el pedido')
  }

  revalidatePath('/dashboard/pedidos')
  revalidatePath('/dashboard')
  redirect('/dashboard/pedidos')
}

export async function deleteOrder(formData: FormData) {
  const supabase = await createClient()
  const orderId = formData.get('orderId') as string

  const { error } = await supabase
    .from('pedidos')
    .delete()
    .eq('id', orderId)

  if (error) {
    throw new Error('No se pudo eliminar el pedido')
  }

  revalidatePath('/dashboard/pedidos')
  revalidatePath('/dashboard')
}

export async function getOccupiedTimes(date: string): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('pedidos')
    .select('hora')
    .eq('fecha', date)
    .not('estado', 'eq', 'Cancelado')

  return (data || []).map((o) => o.hora?.substring(0, 5)).filter(Boolean) as string[]
}
