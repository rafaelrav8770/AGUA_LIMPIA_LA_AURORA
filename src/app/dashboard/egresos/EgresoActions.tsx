'use client'

import { deleteExpense } from './actions'
import Link from 'next/link'
import ConfirmFormButton from '@/components/ConfirmFormButton'

export default function EgresoActions({ id }: { id: string | number }) {
  return (
    <div className="flex justify-end gap-3 items-center">
      <Link 
        href={`/dashboard/egresos/${id}/editar`}
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Editar
      </Link>
      <ConfirmFormButton
        action={deleteExpense}
        hiddenFields={{ expenseId: String(id) }}
        buttonLabel="Borrar"
        buttonClassName="text-red-600 hover:text-red-800 font-medium"
        confirmMessage="¿Borrar este egreso?"
      />
    </div>
  )
}

