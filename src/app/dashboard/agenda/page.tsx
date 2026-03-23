import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { deleteOrder } from '../pedidos/actions'

export default async function AgendaPage() {
  const supabase = await createClient()
  
  // Obtener la fecha de hoy en formato YYYY-MM-DD
  const today = new Date()
  const offset = today.getTimezoneOffset()
  const localDate = new Date(today.getTime() - (offset * 60 * 1000))
  const todayStr = localDate.toISOString().split('T')[0]

  const { data: pedidos } = await supabase
    .from('orders')
    .select('*')
    .eq('date', todayStr)
    .order('time', { ascending: true })

  const dayLabel = localDate.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Agenda</h1>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex bg-white rounded-lg shadow-sm border border-gray-200">
            <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border-r border-gray-200 rounded-l-lg">
              Día
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-r-lg">
              Semana
            </button>
          </div>
          
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <button className="p-1 hover:bg-gray-100 rounded">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-2 px-2 font-medium text-gray-700">
              <CalendarIcon size={18} />
              <span>Hoy, {dayLabel}</span>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded">
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Lista del Día */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-700">Entregas Programadas</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {pedidos && pedidos.map((pedido) => (
            <div key={pedido.id} className="flex flex-col sm:flex-row sm:items-center p-4 hover:bg-gray-50 transition-colors gap-3 sm:gap-0">
              <div className="w-full sm:w-24 font-bold text-gray-700 text-sm sm:text-base flex sm:block items-center gap-2">
                <span>{pedido.time?.substring(0, 5)}</span>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <div>
                  <p className="font-medium text-gray-900">{pedido.client_name}</p>
                  {pedido.phone && <p className="text-xs text-gray-400">{pedido.phone}</p>}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{pedido.address}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <p className="font-medium text-gray-900">${pedido.price}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    pedido.status === 'Entregado' ? 'bg-blue-100 text-blue-800' :
                    pedido.status === 'Pagado' ? 'bg-green-100 text-green-800' :
                    pedido.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {pedido.status}
                  </span>
                </div>
              </div>
              <div className="flex sm:ml-4 justify-end">
                <form action={deleteOrder}>
                  <input type="hidden" name="orderId" value={pedido.id} />
                  <button type="submit" className="text-red-400 hover:text-red-600 font-bold text-sm px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors active:scale-95">
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          ))}
          {(!pedidos || pedidos.length === 0) && (
            <div className="p-8 text-center text-gray-500">
              <span className="text-3xl block mb-2">📭</span>
              <p className="font-medium">No hay entregas programadas para hoy.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
