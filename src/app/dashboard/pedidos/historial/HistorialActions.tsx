'use client'

import ConfirmFormButton from '@/components/ConfirmFormButton'
import { deleteOrder } from '../actions'
import Link from 'next/link'

interface HistorialActionsProps {
  pedidoId: string
}

export default function HistorialActions({ pedidoId }: HistorialActionsProps) {
  return (
    <div className="flex gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0 items-center">
      <Link href={`/dashboard/pedidos/${pedidoId}/editar`} className="text-gray-500 hover:text-gray-800 font-bold px-3 py-2 text-sm transition-colors">Modificar</Link>
      <ConfirmFormButton
        action={deleteOrder}
        hiddenFields={{ orderId: pedidoId }}
        buttonLabel="X"
        buttonClassName="text-red-400 hover:text-red-700 font-bold px-3 py-2 text-sm transition-colors"
        confirmMessage="¿Eliminar pedido?"
      />
    </div>
  )
}
