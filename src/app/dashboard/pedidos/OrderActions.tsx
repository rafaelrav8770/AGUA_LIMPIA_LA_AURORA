'use client'

import ConfirmFormButton from '@/components/ConfirmFormButton'
import { updateOrderStatus, deleteOrder } from './actions'
import Link from 'next/link'

interface OrderActionsProps {
  pedido: {
    id: string
    status: string
  }
}

export default function OrderActions({ pedido }: OrderActionsProps) {
  return (
    <div className="pt-2 flex flex-wrap gap-2 items-center justify-between">
      <div className="flex gap-2 w-full sm:w-auto">
        {pedido.status === 'Pendiente' && (
          <div className="flex w-full gap-2">
            <ConfirmFormButton
              action={updateOrderStatus}
              hiddenFields={{ orderId: pedido.id, newStatus: 'Entregado', newPaymentMethod: 'Pendiente' }}
              buttonLabel="Fiar"
              buttonClassName="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold px-2 py-2.5 rounded-xl transition-colors active:scale-95 text-xs border border-orange-200/50"
              confirmMessage="¿Fiar pedido?"
            />
            <ConfirmFormButton
              action={updateOrderStatus}
              hiddenFields={{ orderId: pedido.id, newStatus: 'Pagado', newPaymentMethod: 'Transferencia' }}
              buttonLabel="Transf."
              buttonClassName="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-2 py-2.5 rounded-xl transition-colors active:scale-95 text-xs border border-blue-200/50"
              confirmMessage="¿Marcar como pagado (Transf.)?"
            />
            <ConfirmFormButton
              action={updateOrderStatus}
              hiddenFields={{ orderId: pedido.id, newStatus: 'Pagado', newPaymentMethod: 'Efectivo' }}
              buttonLabel="Efectivo"
              buttonClassName="w-full bg-green-50 hover:bg-green-100 text-green-700 font-bold px-2 py-2.5 rounded-xl transition-colors active:scale-95 text-xs border border-green-200/50"
              confirmMessage="¿Marcar como pagado (Efectivo)?"
            />
          </div>
        )}
        {pedido.status === 'Entregado' && (
          <div className="flex w-full gap-2">
            <ConfirmFormButton
              action={updateOrderStatus}
              hiddenFields={{ orderId: pedido.id, newStatus: 'Pagado', newPaymentMethod: 'Transferencia' }}
              buttonLabel="Cobro Transf."
              buttonClassName="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-2.5 rounded-xl transition-colors active:scale-95 text-xs border border-blue-200/50"
              confirmMessage="¿Cobrar por transferencia?"
            />
            <ConfirmFormButton
              action={updateOrderStatus}
              hiddenFields={{ orderId: pedido.id, newStatus: 'Pagado', newPaymentMethod: 'Efectivo' }}
              buttonLabel="Cobro Efect."
              buttonClassName="w-full bg-green-50 hover:bg-green-100 text-green-700 font-bold px-3 py-2.5 rounded-xl transition-colors active:scale-95 text-xs border border-green-200/50"
              confirmMessage="¿Cobrar en efectivo?"
            />
          </div>
        )}
      </div>
      <div className="flex gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0 items-center">
        <Link href={`/dashboard/pedidos/${pedido.id}/editar`} className="text-gray-500 hover:text-gray-800 font-bold px-3 py-2 text-sm transition-colors">Modificar</Link>
        <ConfirmFormButton
          action={deleteOrder}
          hiddenFields={{ orderId: pedido.id }}
          buttonLabel="X"
          buttonClassName="text-red-400 hover:text-red-700 font-bold px-3 py-2 text-sm transition-colors"
          confirmMessage="¿Eliminar pedido?"
        />
      </div>
    </div>
  )
}
