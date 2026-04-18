'use client'

import ConfirmFormButton from '@/components/ConfirmFormButton'
import { deleteOrder } from '../pedidos/actions'

interface AgendaActionsProps {
  pedidoId: string
}

export default function AgendaActions({ pedidoId }: AgendaActionsProps) {
  return (
    <div className="flex sm:ml-4 justify-end">
      <ConfirmFormButton
        action={deleteOrder}
        hiddenFields={{ orderId: pedidoId }}
        buttonLabel="Eliminar"
        buttonClassName="text-red-400 hover:text-red-600 font-bold text-sm px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors active:scale-95"
        confirmMessage="¿Eliminar pedido?"
      />
    </div>
  )
}
