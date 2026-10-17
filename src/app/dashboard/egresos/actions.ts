'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createExpense(formData: FormData) {
  const supabase = await createClient()

  const data = {
    fecha: formData.get('date') as string,
    concepto: formData.get('concept') as string,
    categoria: formData.get('category') as string,
    monto: parseFloat(formData.get('amount') as string),
    notas: formData.get('notes') as string,
  }

  const { error } = await supabase.from('egresos').insert(data)

  if (error) {
    console.error('Error creating expense:', error)
    throw new Error('No se pudo crear el egreso')
  }

  revalidatePath('/dashboard/egresos')
  revalidatePath('/dashboard')
  redirect('/dashboard/egresos')
}

export async function deleteExpense(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('expenseId') as string

  const { error } = await supabase.from('egresos').delete().eq('id', id)

  if (error) {
    console.error('Error deleting expense:', error)
    throw new Error('No se pudo borrar el egreso')
  }

  revalidatePath('/dashboard/egresos')
  revalidatePath('/dashboard')
}

export async function updateExpense(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string

  const data = {
    fecha: formData.get('date') as string,
    concepto: formData.get('concept') as string,
    categoria: formData.get('category') as string,
    monto: parseFloat(formData.get('amount') as string),
    notas: formData.get('notes') as string,
  }

  const { error } = await supabase.from('egresos').update(data).eq('id', id)

  if (error) {
    console.error('Error updating expense:', error)
    throw new Error('No se pudo actualizar el egreso')
  }

  revalidatePath('/dashboard/egresos')
  revalidatePath('/dashboard')
  redirect('/dashboard/egresos')
}
