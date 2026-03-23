import { Droplet, DollarSign, TrendingUp, Clock, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fecha de hoy
  const now = new Date()
  const offset = now.getTimezoneOffset()
  const localDate = new Date(now.getTime() - (offset * 60 * 1000))
  const todayStr = localDate.toISOString().split('T')[0]

  // Pedidos de hoy
  const { data: pedidosHoy } = await supabase
    .from('orders')
    .select('*')
    .eq('date', todayStr)

  // Egresos de hoy
  const { data: egresosHoy } = await supabase
    .from('expenses')
    .select('*')
    .eq('date', todayStr)

  // Fiados (Entregados sin pagar)
  const { data: fiados } = await supabase
    .from('orders')
    .select('*')
    .eq('status', 'Entregado')
    .order('date', { ascending: false })
    .limit(5)

  // Próximo pedido pendiente de hoy
  const nowTime = localDate.toTimeString().substring(0, 5)
  const { data: proximoPedido } = await supabase
    .from('orders')
    .select('*')
    .eq('date', todayStr)
    .eq('status', 'Pendiente')
    .gte('time', nowTime)
    .order('time', { ascending: true })
    .limit(1)

  // Calcular totales
  const totalPedidos = pedidosHoy?.length || 0
  const ingresos = pedidosHoy?.filter(p => p.status === 'Pagado').reduce((sum, p) => sum + p.price, 0) || 0
  const egresos = egresosHoy?.reduce((sum, e) => sum + e.amount, 0) || 0
  const ganancia = ingresos - egresos

  const totalFiados = fiados?.reduce((sum, f) => sum + f.price, 0) || 0

  const proximo = proximoPedido?.[0] || null

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Resumen del Día</h1>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500">Pedidos Hoy</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">{totalPedidos}</p>
          </div>
          <div className="bg-blue-100 p-2.5 sm:p-3 rounded-lg text-blue-600">
            <Droplet size={20} />
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500">Ingresos Hoy</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">${ingresos.toLocaleString('es-MX')}</p>
          </div>
          <div className="bg-green-100 p-2.5 sm:p-3 rounded-lg text-green-600">
            <DollarSign size={20} />
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500">Egresos Hoy</p>
            <p className="text-xl sm:text-2xl font-bold text-red-600">${egresos.toLocaleString('es-MX')}</p>
          </div>
          <div className="bg-red-100 p-2.5 sm:p-3 rounded-lg text-red-600">
            <TrendingUp size={20} className="rotate-180" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500">Ganancia</p>
            <p className={`text-xl sm:text-2xl font-bold ${ganancia >= 0 ? 'text-blue-600' : 'text-red-600'}`}>${ganancia.toLocaleString('es-MX')}</p>
          </div>
          <div className="bg-blue-100 p-2.5 sm:p-3 rounded-lg text-blue-600">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fiados */}
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-orange-600 font-semibold">
              <AlertCircle size={20} />
              <h2>Fiados Pendientes</h2>
            </div>
            {totalFiados > 0 && (
              <Link href="/dashboard/fiados" className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full hover:bg-orange-100 transition-colors">
                Ver todos →
              </Link>
            )}
          </div>
          <div className="space-y-3">
            {fiados && fiados.length > 0 ? fiados.map((f) => (
              <div key={f.id} className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-medium text-gray-800">{f.client_name}</p>
                  <p className="text-xs text-gray-400">{f.address} • {f.date}</p>
                </div>
                <p className="font-bold text-orange-600">${f.price}</p>
              </div>
            )) : (
              <p className="text-sm text-gray-400 text-center py-4">✅ Sin fiados pendientes</p>
            )}
            {totalFiados > 0 && (
              <div className="flex justify-between items-center pt-2 font-bold text-sm border-t border-gray-100">
                <span className="text-gray-600">Total fiado:</span>
                <span className="text-red-600">${totalFiados.toLocaleString('es-MX')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Próximo Pedido */}
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-blue-600 font-semibold">
            <Clock size={20} />
            <h2>Próximo Pedido</h2>
          </div>
          {proximo ? (
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
              <div>
                <p className="font-bold text-blue-800 text-lg">{proximo.time?.substring(0, 5)}</p>
                <p className="font-medium text-blue-700">{proximo.client_name}</p>
                <p className="text-sm text-blue-600">{proximo.address}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-800">${proximo.price}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">📭 No hay más pedidos pendientes para hoy</p>
          )}
        </div>
      </div>
    </div>
  )
}
