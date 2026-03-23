import { createClient } from '@/lib/supabase/server'
import { updateOrderStatus } from '../pedidos/actions'
import { Phone, MapPin } from 'lucide-react'

interface FiadoGroup {
  client_name: string
  phone: string | null
  total: number
  orders: {
    id: string
    folio: number
    address: string
    date: string
    price: number
  }[]
}

export default async function FiadosPage() {
  const supabase = await createClient()

  // Traer todos los pedidos que están "Entregados" (fiados - entregados pero no pagados)
  const { data: fiadoOrders } = await supabase
    .from('orders')
    .select('*')
    .eq('status', 'Entregado')
    .order('date', { ascending: false })

  // Agrupar por nombre + teléfono
  const groups: FiadoGroup[] = []
  if (fiadoOrders) {
    const map = new Map<string, FiadoGroup>()
    for (const order of fiadoOrders) {
      const key = `${(order.client_name || '').toLowerCase().trim()}|${(order.phone || '').trim()}`
      if (!map.has(key)) {
        map.set(key, {
          client_name: order.client_name,
          phone: order.phone,
          total: 0,
          orders: [],
        })
      }
      const group = map.get(key)!
      group.total += order.price
      group.orders.push({
        id: order.id,
        folio: order.folio,
        address: order.address,
        date: order.date,
        price: order.price,
      })
    }
    groups.push(...Array.from(map.values()).sort((a, b) => b.total - a.total))
  }

  const totalFiado = groups.reduce((sum, g) => sum + g.total, 0)

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Fiados</h1>
          <p className="text-sm text-gray-500 mt-1">Clientes con entregas pendientes de pago</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-3 text-center">
          <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Total por cobrar</p>
          <p className="text-2xl font-black text-red-700">${totalFiado.toLocaleString('es-MX')}</p>
        </div>
      </div>

      {groups.length === 0 && (
        <div className="bg-green-50 rounded-3xl p-12 text-center border-2 border-dashed border-green-200">
          <span className="text-4xl block mb-4">✅</span>
          <p className="font-bold text-lg text-green-800">¡No hay fiados pendientes!</p>
          <p className="text-sm text-green-600">Todos los pedidos entregados han sido cobrados.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group, idx) => (
          <div key={idx} className="bg-white rounded-3xl md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header del cliente */}
            <div className="bg-red-50/50 p-5 border-b border-red-100/50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{group.client_name}</h3>
                  {group.phone && (
                    <div className="flex items-center gap-1.5 mt-1 text-gray-500 text-sm">
                      <Phone size={14} />
                      <span>{group.phone}</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Debe</p>
                  <p className="text-xl font-black text-red-700">${group.total.toLocaleString('es-MX')}</p>
                  <p className="text-[11px] text-gray-400">{group.orders.length} entrega{group.orders.length > 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            {/* Lista de pedidos individuales */}
            <div className="divide-y divide-gray-50">
              {group.orders.map((order) => (
                <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-gray-400">#{order.folio}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500">{order.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-600">
                      <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{order.address}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-between sm:justify-end">
                    <span className="font-bold text-gray-800">${order.price}</span>
                    <div className="flex gap-2">
                      <form action={updateOrderStatus}>
                        <input type="hidden" name="orderId" value={order.id} />
                        <input type="hidden" name="newStatus" value="Pagado" />
                        <input type="hidden" name="newPaymentMethod" value="Transferencia" />
                        <button type="submit" className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-xl text-xs border border-blue-200/50 transition-colors active:scale-95">
                          Transf.
                        </button>
                      </form>
                      <form action={updateOrderStatus}>
                        <input type="hidden" name="orderId" value={order.id} />
                        <input type="hidden" name="newStatus" value="Pagado" />
                        <input type="hidden" name="newPaymentMethod" value="Efectivo" />
                        <button type="submit" className="bg-green-50 hover:bg-green-100 text-green-700 font-bold px-3 py-1.5 rounded-xl text-xs border border-green-200/50 transition-colors active:scale-95">
                          Efectivo
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
