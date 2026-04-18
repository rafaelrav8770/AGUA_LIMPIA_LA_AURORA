'use client'

import ConfirmFormButton from '@/components/ConfirmFormButton'
import { updateOrderStatus } from '../pedidos/actions'

interface FiadoActionsProps {
  orderId: string
}

export default function FiadoActions({ orderId }: FiadoActionsProps) {
  return (
    <div className="flex gap-2">
      <ConfirmFormButton
        action={updateOrderStatus}
        hiddenFields={{ orderId, newStatus: 'Pagado', newPaymentMethod: 'Transferencia' }}
        buttonLabel="Transf."
        buttonClassName="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-xl text-xs border border-blue-200/50 transition-colors active:scale-95"
        confirmMessage="¿Cobrar por transferencia?"
      />
      <ConfirmFormButton
        action={updateOrderStatus}
        hiddenFields={{ orderId, newStatus: 'Pagado', newPaymentMethod: 'Efectivo' }}
        buttonLabel="Efectivo"
        buttonClassName="bg-green-50 hover:bg-green-100 text-green-700 font-bold px-3 py-1.5 rounded-xl text-xs border border-green-200/50 transition-colors active:scale-95"
        confirmMessage="¿Cobrar en efectivo?"
      />
    </div>
  )
}
