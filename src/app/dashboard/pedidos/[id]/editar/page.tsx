import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { updateOrder } from '../../actions'
import { getTimeOptions } from '@/lib/utils'

const TIME_OPTIONS = getTimeOptions()

export default async function EditarPedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: pedido, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !pedido) {
    return <div className="p-6 text-center text-red-500">Error al cargar el pedido</div>
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-3 sm:gap-4 mb-6">
        <Link href="/dashboard/pedidos" className="p-2 sm:p-2.5 hover:bg-gray-100 rounded-full transition-colors active:scale-95">
          <ArrowLeft size={24} className="text-gray-600" />
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Editar Pedido #{pedido.folio}</h1>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-8">
        <form action={updateOrder} className="space-y-6 sm:space-y-8">
          <input type="hidden" name="orderId" value={pedido.id} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Nombre del Cliente</label>
              <input type="text" name="client_name" defaultValue={pedido.client_name} required className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 sm:py-3 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-900" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Teléfono</label>
              <input type="tel" name="phone" defaultValue={pedido.phone || ''} className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 sm:py-3 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-900" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Ubicación</label>
              <input type="text" name="address" defaultValue={pedido.address} required className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 sm:py-3 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-900" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Fecha</label>
              <input type="date" name="date" defaultValue={pedido.date} required className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 sm:py-3 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-800" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1 block">Hora</label>
              <select name="time" defaultValue={pedido.time.substring(0,5)} required className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 sm:py-3 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-900">
                {TIME_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1 block">Precio</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                <input type="number" step="0.01" name="price" defaultValue={pedido.price} required className="w-full rounded-2xl border border-gray-200 pl-8 pr-4 py-3.5 sm:py-3 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-900" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1 block">Método de Pago</label>
              <select name="payment_method" defaultValue={pedido.payment_method} className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 sm:py-3 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-900">
                <option value="Pendiente">⏳ Pendiente</option>
                <option value="Efectivo">💵 Efectivo</option>
                <option value="Transferencia">💳 Transferencia</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1 block">Estado</label>
              <select name="status" defaultValue={pedido.status} className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 sm:py-3 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-900">
                <option value="Pendiente">🟠 Pendiente</option>
                <option value="Entregado">🔵 Entregado</option>
                <option value="Pagado">🟢 Pagado</option>
                <option value="Cancelado">🔴 Cancelado</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 ml-1 block">Notas Adicionales</label>
              <textarea name="notes" defaultValue={pedido.notes || ''} rows={3} className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 sm:py-3 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none font-medium text-gray-900"></textarea>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4 mt-6 border-t border-gray-100">
            <Link href="/dashboard/pedidos" className="w-full sm:w-auto text-center px-8 py-4 sm:py-3 rounded-2xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold transition-all active:scale-95">
              Cancelar
            </Link>
            <button type="submit" className="w-full sm:w-auto px-8 py-4 sm:py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-[0_8px_16px_-6px_rgba(37,99,235,0.4)] transition-all active:scale-95">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
