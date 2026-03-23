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
