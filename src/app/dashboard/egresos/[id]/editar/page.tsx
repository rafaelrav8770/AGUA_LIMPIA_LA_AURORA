import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EditarForm from './EditarForm'

export default async function EditarEgresoPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { id } = await params

  const { data: egreso } = await supabase
    .from('expenses')
    .select('*')
    .eq('id', id)
    .single()

  if (!egreso) {
    redirect('/dashboard/egresos')
  }

  return <EditarForm egreso={egreso} />
}
