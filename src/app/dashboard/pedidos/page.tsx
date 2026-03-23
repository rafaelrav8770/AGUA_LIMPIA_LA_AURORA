import { Plus, Minus, MapPin, Calendar, Clock, Phone } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { updateOrderStatus, deleteOrder } from './actions'

export default async function PedidosPage() {
  const supabase = await createClient()
  const { data: pedidos } = await supabase.from('orders').select('*').order('date', { ascending: false }).order('time', { ascending: false })

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pedidos</h1>
        
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          <Link href="/dashboard/egresos/nuevo" className="flex items-center justify-center gap-2 bg-red-100 text-red-700 font-bold px-4 py-3.5 sm:py-3 rounded-2xl md:rounded-xl hover:bg-red-200 transition-colors shadow-sm active:scale-95 text-[15px]">
            <Minus size={20} />
            <span>Registrar Gasto</span>
          </Link>
          <Link href="/dashboard/pedidos/nuevo" className="flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-4 py-3.5 sm:py-3 rounded-2xl md:rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30 active:scale-95 text-[15px]">
            <Plus size={20} />
            <span>Nuevo Pedido</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pedidos && pedidos.map((pedido) => (
          <div key={pedido.id} className="bg-white rounded-3xl md:rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4 relative overflow-hidden">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <span className="text-xs font-bold text-gray-400 mb-1 block tracking-wider uppercase">Folio #{pedido.folio}</span>
                <h3 className="font-bold text-xl text-gray-800 leading-tight">{pedido.client_name}</h3>
                
                {pedido.phone && (
                  <div className="flex items-center gap-1.5 mt-2 text-gray-500 text-sm">
                    <Phone size={14} />
                    <span>{pedido.phone}</span>
                  </div>
                )}
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-sm ${
                  pedido.status === 'Pendiente' ? 'bg-orange-100 text-orange-800 border border-orange-200/50' :
                  pedido.status === 'Entregado' ? 'bg-blue-100 text-blue-800 border border-blue-200/50' :
                  pedido.status === 'Pagado' ? 'bg-green-100 text-green-800 border border-green-200/50' :
                  'bg-gray-100 text-gray-800 border border-gray-200/50'
                }`}>
                  {pedido.status === 'Pendiente' ? '🟠 Pendiente' :
                   pedido.status === 'Entregado' ? '🔵 Entregado' :
                   pedido.status === 'Pagado' ? '🟢 Pagado' :
                   '🔴 Cancelado'}
                </span>
                <span className="text-2xl font-black text-gray-900">${pedido.price}</span>
              </div>
            </div>

            <div className="bg-gray-50/80 rounded-2xl p-3.5 flex flex-col gap-2.5">
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <MapPin size={16} className="mt-0.5 text-blue-500 flex-shrink-0" />
                <span className="leading-snug">{pedido.address}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-gray-400" />
                  <span>{pedido.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-gray-400" />
                  <span>{pedido.time}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 items-center justify-between">
              <div className="flex gap-2 w-full sm:w-auto">
                {pedido.status === 'Pendiente' && (
                  <div className="flex w-full gap-2">
                    <form action={updateOrderStatus} className="flex-1">
                      <input type="hidden" name="orderId" value={pedido.id} />
                      <input type="hidden" name="newStatus" value="Entregado" />
                      <input type="hidden" name="newPaymentMethod" value="Pendiente" />
                      <button type="submit" className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold px-2 py-2.5 rounded-xl transition-colors active:scale-95 text-xs border border-orange-200/50">
                        Fiar
                      </button>
                    </form>
                    <form action={updateOrderStatus} className="flex-1">
                      <input type="hidden" name="orderId" value={pedido.id} />
                      <input type="hidden" name="newStatus" value="Pagado" />
                      <input type="hidden" name="newPaymentMethod" value="Transferencia" />
                      <button type="submit" className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-2 py-2.5 rounded-xl transition-colors active:scale-95 text-xs border border-blue-200/50">
                        Transf.
                      </button>
                    </form>
                    <form action={updateOrderStatus} className="flex-1">
                      <input type="hidden" name="orderId" value={pedido.id} />
                      <input type="hidden" name="newStatus" value="Pagado" />
                      <input type="hidden" name="newPaymentMethod" value="Efectivo" />
                      <button type="submit" className="w-full bg-green-50 hover:bg-green-100 text-green-700 font-bold px-2 py-2.5 rounded-xl transition-colors active:scale-95 text-xs border border-green-200/50">
                        Efectivo
                      </button>
                    </form>
                  </div>
                )}
                {pedido.status === 'Entregado' && (
                  <div className="flex w-full gap-2">
                    <form action={updateOrderStatus} className="flex-1">
                      <input type="hidden" name="orderId" value={pedido.id} />
                      <input type="hidden" name="newStatus" value="Pagado" />
                      <input type="hidden" name="newPaymentMethod" value="Transferencia" />
                      <button type="submit" className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-2.5 rounded-xl transition-colors active:scale-95 text-xs border border-blue-200/50">
                        Cobro Transf.
                      </button>
                    </form>
                    <form action={updateOrderStatus} className="flex-1">
                      <input type="hidden" name="orderId" value={pedido.id} />
                      <input type="hidden" name="newStatus" value="Pagado" />
                      <input type="hidden" name="newPaymentMethod" value="Efectivo" />
                      <button type="submit" className="w-full bg-green-50 hover:bg-green-100 text-green-700 font-bold px-3 py-2.5 rounded-xl transition-colors active:scale-95 text-xs border border-green-200/50">
                        Cobro Efect.
                      </button>
                    </form>
                  </div>
                )}
              </div>
              <div className="flex gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0 items-center">
                <Link href={`/dashboard/pedidos/${pedido.id}/editar`} className="text-gray-500 hover:text-gray-800 font-bold px-3 py-2 text-sm transition-colors">Modificar</Link>
                <form action={deleteOrder}>
                  <input type="hidden" name="orderId" value={pedido.id} />
                  <button type="submit" className="text-red-400 hover:text-red-700 font-bold px-3 py-2 text-sm transition-colors">X</button>
                </form>
              </div>
            </div>
          </div>
        ))}
        
        {(!pedidos || pedidos.length === 0) && (
          <div className="col-span-full bg-gray-50 rounded-3xl p-12 text-center text-gray-500 flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
            <span className="text-4xl mb-4">📭</span>
            <p className="font-medium text-lg text-gray-800">No hay pedidos registrados.</p>
            <p className="text-sm">Cuando crees uno nuevo aparecerá en esta lista para tu reparto.</p>
          </div>
        )}
      </div>
    </div>
  )
}
