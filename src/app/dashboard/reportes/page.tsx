import { BarChart3, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getMxTodayStr, getMxMonthStartEnd } from '@/lib/utils'
import DatePicker from './DatePicker'

export default async function ReportesPage(props: any) {
  const supabase = await createClient()

  const searchParams = props?.searchParams ? await props.searchParams : {}
  const urlDate = searchParams?.date

  // Fecha y fechas de mes en estricto horario México
  const defaultTodayStr = getMxTodayStr()
  const todayStr = (typeof urlDate === 'string' && urlDate) ? urlDate : defaultTodayStr
  const { firstDay, lastDay, monthName: mesNombre } = getMxMonthStartEnd()

  // ===== CORTE DIARIO =====
  const { data: pedidosHoy } = await supabase.from('orders').select('*').eq('date', todayStr)
  const { data: egresosHoy } = await supabase.from('expenses').select('*').eq('date', todayStr)

  const cobradosHoy = pedidosHoy?.filter(p => p.status === 'Pagado').reduce((s, p) => s + p.price, 0) || 0
  const fiadosHoy = pedidosHoy?.filter(p => p.status === 'Entregado').reduce((s, p) => s + p.price, 0) || 0
  const canceladosHoy = pedidosHoy?.filter(p => p.status === 'Cancelado').reduce((s, p) => s + p.price, 0) || 0
  const totalIngresosHoy = cobradosHoy
  const pedidosCobradosCount = pedidosHoy?.filter(p => p.status === 'Pagado').length || 0
  const totalEgresosHoy = egresosHoy?.reduce((s, e) => s + e.amount, 0) || 0
  const egresosCount = egresosHoy?.length || 0
  const utilidadHoy = totalIngresosHoy - totalEgresosHoy
  const margenHoy = totalIngresosHoy > 0 ? ((utilidadHoy / totalIngresosHoy) * 100).toFixed(1) : '0.0'

  // Desglose de egresos por categoría (hoy)
  const egresoCategorias: Record<string, number> = {}
  egresosHoy?.forEach(e => {
    const cat = e.category || 'Otros'
    egresoCategorias[cat] = (egresoCategorias[cat] || 0) + e.amount
  })

  // ===== RESUMEN MENSUAL =====
  const { data: pedidosMes } = await supabase.from('orders').select('*').gte('date', firstDay).lte('date', lastDay)
  const { data: egresosMes } = await supabase.from('expenses').select('*').gte('date', firstDay).lte('date', lastDay)

  const cobradosMes = pedidosMes?.filter(p => p.status === 'Pagado').reduce((s, p) => s + p.price, 0) || 0
  const fiadosMes = pedidosMes?.filter(p => p.status === 'Entregado').reduce((s, p) => s + p.price, 0) || 0
  const totalEgresosMes = egresosMes?.reduce((s, e) => s + e.amount, 0) || 0
  const utilidadMes = cobradosMes - totalEgresosMes
  const totalPedidosMes = pedidosMes?.length || 0

  const egresoCategMes: Record<string, number> = {}
  egresosMes?.forEach(e => {
    const cat = e.category || 'Otros'
    egresoCategMes[cat] = (egresoCategMes[cat] || 0) + e.amount
  })

  const categoryColors = ['bg-blue-500', 'bg-orange-500', 'bg-green-500', 'bg-red-500', 'bg-purple-500', 'bg-yellow-500']

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reportes Financieros</h1>

      {/* === CORTE DIARIO === */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
          📅 Corte Diario <DatePicker dateStr={todayStr} />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">

          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 p-2 rounded-lg text-green-600"><TrendingUp size={20} /></div>
              <h3 className="font-medium text-gray-700">Total Ingresos</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">${totalIngresosHoy.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
            <p className="text-sm text-gray-500 mt-1">{pedidosCobradosCount} pedidos cobrados</p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-red-100 p-2 rounded-lg text-red-600"><TrendingDown size={20} /></div>
              <h3 className="font-medium text-gray-700">Total Egresos</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">${totalEgresosHoy.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
            <p className="text-sm text-gray-500 mt-1">{egresosCount} gastos registrados</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-5 sm:p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-lg text-white"><DollarSign size={20} /></div>
              <h3 className="font-medium text-blue-50">Utilidad Neta</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">${utilidadHoy.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
            <p className="text-sm text-blue-100 mt-1">Margen: {margenHoy}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4 text-gray-700">
              <BarChart3 size={20} />
              <h2 className="font-semibold text-lg">Desglose de Pedidos</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-700">Cobrados</span>
                <span className="font-bold text-green-700">${cobradosHoy.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-orange-700">Fiados (pendientes de cobro)</span>
                <span className="font-bold text-orange-700">${fiadosHoy.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-red-700">Cancelados</span>
                <span className="font-bold text-red-700">${canceladosHoy.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4 text-gray-700">
              <BarChart3 size={20} />
              <h2 className="font-semibold text-lg">Desglose de Egresos</h2>
            </div>
            <div className="space-y-3">
              {Object.entries(egresoCategorias).length > 0 ? Object.entries(egresoCategorias).map(([cat, amount], i) => (
                <div key={cat} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${categoryColors[i % categoryColors.length]}`}></div>
                    <span className="text-gray-600">{cat}</span>
                  </div>
                  <span className="font-medium">${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
              )) : (
                <p className="text-sm text-gray-400 text-center py-4">Sin egresos registrados hoy</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* === RESUMEN MENSUAL === */}
      <div>
        <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2 capitalize">
          📊 Resumen Mensual <span className="text-sm font-normal text-gray-400">({mesNombre})</span>
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs font-medium text-gray-500">Total Pedidos</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">{totalPedidosMes}</p>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs font-medium text-gray-500">Cobrado</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">${cobradosMes.toLocaleString('es-MX')}</p>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs font-medium text-gray-500">Fiado</p>
            <p className="text-xl sm:text-2xl font-bold text-orange-600">${fiadosMes.toLocaleString('es-MX')}</p>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs font-medium text-gray-500">Egresos</p>
            <p className="text-xl sm:text-2xl font-bold text-red-600">${totalEgresosMes.toLocaleString('es-MX')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-5 sm:p-6 rounded-xl shadow-sm">
            <h3 className="font-medium text-blue-100 mb-1">Utilidad Mensual</h3>
            <p className="text-3xl sm:text-4xl font-black">${utilidadMes.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
            <p className="text-sm text-blue-200 mt-2">Cobrado - Egresos del mes</p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-3">Egresos por Categoría (Mes)</h3>
            <div className="space-y-3">
              {Object.entries(egresoCategMes).length > 0 ? Object.entries(egresoCategMes).map(([cat, amount], i) => (
                <div key={cat} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${categoryColors[i % categoryColors.length]}`}></div>
                    <span className="text-gray-600">{cat}</span>
                  </div>
                  <span className="font-medium">${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
              )) : (
                <p className="text-sm text-gray-400 text-center py-4">Sin egresos este mes</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
