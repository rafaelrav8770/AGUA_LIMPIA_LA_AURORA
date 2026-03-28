'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createExpense(formData: FormData) {
  const supabase = await createClient()

  const data = {
    date: formData.get('date') as string,
    concept: formData.get('concept') as string,
    category: formData.get('category') as string,
    amount: parseFloat(formData.get('amount') as string),
    notes: formData.get('notes') as string,
  }

  const { error } = await supabase.from('expenses').insert(data)

  if (error) {
    console.error('Error creating expense:', error)
    throw new Error('No se pudo crear el egreso')
  }

  revalidatePath('/dashboard/egresos')
  revalidatePath('/dashboard')
  redirect('/dashboard/egresos')
}

export async function deleteExpense(id: string | number) {
  const supabase = await createClient()

  const { error } = await supabase.from('expenses').delete().eq('id', id)

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
    date: formData.get('date') as string,
    concept: formData.get('concept') as string,
    category: formData.get('category') as string,
    amount: parseFloat(formData.get('amount') as string),
    notes: formData.get('notes') as string,
  }

  const { error } = await supabase.from('expenses').update(data).eq('id', id)

  if (error) {
    console.error('Error updating expense:', error)
    throw new Error('No se pudo actualizar el egreso')
  }

  revalidatePath('/dashboard/egresos')
  revalidatePath('/dashboard')
  redirect('/dashboard/egresos')
}
