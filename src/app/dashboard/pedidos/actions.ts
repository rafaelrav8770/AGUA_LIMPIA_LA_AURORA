'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OrderStatus, PaymentMethod } from '@/lib/types'

export async function createOrder(formData: FormData) {
  const supabase = await createClient()

  const data = {
    client_name: formData.get('client_name') as string,
    phone: formData.get('phone') as string,
    address: formData.get('address') as string,
    date: formData.get('date') as string,
    time: formData.get('time') as string,
    price: parseFloat(formData.get('price') as string),
    payment_method: formData.get('payment_method') as PaymentMethod,
    status: formData.get('status') as OrderStatus,
    notes: formData.get('notes') as string,
  }

  const { error } = await supabase.from('orders').insert(data)

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

  const updateData: { status: OrderStatus; payment_method?: PaymentMethod } = { status: newStatus }
  if (newPaymentMethod) {
    updateData.payment_method = newPaymentMethod
  }

  const { error } = await supabase
    .from('orders')
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
    client_name: formData.get('client_name') as string,
    phone: formData.get('phone') as string,
    address: formData.get('address') as string,
    date: formData.get('date') as string,
    time: formData.get('time') as string,
    price: parseFloat(formData.get('price') as string),
    payment_method: formData.get('payment_method') as PaymentMethod,
    status: formData.get('status') as OrderStatus,
    notes: formData.get('notes') as string,
  }

  const { error } = await supabase
    .from('orders')
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
    .from('orders')
    .delete()
    .eq('id', orderId)

  if (error) {
    throw new Error('No se pudo eliminar el pedido')
  }

  revalidatePath('/dashboard/pedidos')
  revalidatePath('/dashboard')
}
