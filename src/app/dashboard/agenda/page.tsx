import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { deleteOrder } from '../pedidos/actions'
import { formatTime, getMxTodayStr } from '@/lib/utils'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AgendaPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const resolvedSearchParams = await searchParams
  const dateParam = typeof resolvedSearchParams?.date === 'string' ? resolvedSearchParams.date : undefined
  const viewParam = typeof resolvedSearchParams?.view === 'string' ? resolvedSearchParams.view : 'day'
  const isWeekView = viewParam === 'week'
  
  // Fecha exacta tiempo de México
  const todayStr = getMxTodayStr()
  const currentDateStr = dateParam || todayStr

  // Calculate prev/next dates safely
  const currentDate = new Date(currentDateStr + 'T12:00:00')
  const daysStep = isWeekView ? 7 : 1
  
  const prevDate = new Date(currentDate)
  prevDate.setDate(currentDate.getDate() - daysStep)
  const prevDateStr = prevDate.toISOString().split('T')[0]
  
  const nextDate = new Date(currentDate)
  nextDate.setDate(currentDate.getDate() + daysStep)
  const nextDateStr = nextDate.toISOString().split('T')[0]

  const endDate = new Date(currentDate)
  endDate.setDate(currentDate.getDate() + 6)
  const endDateStr = endDate.toISOString().split('T')[0]

  const displayDate = new Intl.DateTimeFormat('es-MX', {
    timeZone: 'America/Mexico_City',
    day: 'numeric',
    month: 'short'
  }).format(currentDate)

  const displayEndDate = new Intl.DateTimeFormat('es-MX', {
    timeZone: 'America/Mexico_City',
    day: 'numeric',
    month: 'short'
  }).format(endDate)

  const isToday = currentDateStr === todayStr

  let query = supabase.from('orders').select('*')
  
  if (isWeekView) {
    query = query.gte('date', currentDateStr).lte('date', endDateStr)
      .order('date', { ascending: true })
      .order('time', { ascending: true })
  } else {
    query = query.eq('date', currentDateStr)
      .order('time', { ascending: true })
  }

  const { data: pedidos } = await query

  const formatDateLabel = (dateStr: string) => {
    return new Intl.DateTimeFormat('es-MX', {
      timeZone: 'America/Mexico_City',
      weekday: 'short',
      day: 'numeric'
    }).format(new Date(dateStr + 'T12:00:00'))
  }

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Agenda</h1>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex bg-white rounded-lg shadow-sm border border-gray-200">
            <Link href={`/dashboard/agenda?date=${currentDateStr}&view=day`} className={`px-4 py-2 text-sm font-medium border-r border-gray-200 rounded-l-lg transition-colors ${!isWeekView ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
              Día
            </Link>
            <Link href={`/dashboard/agenda?date=${currentDateStr}&view=week`} className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${isWeekView ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
              Semana
            </Link>
          </div>
          
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <Link href={`/dashboard/agenda?date=${prevDateStr}&view=${viewParam}`} className="p-1 hover:bg-gray-100 rounded transition-colors flex items-center justify-center">
              <ChevronLeft size={20} className="text-gray-600" />
            </Link>
            <div className="flex items-center gap-2 px-2 font-medium text-gray-700 min-w-[120px] justify-center text-sm sm:text-base">
              <CalendarIcon size={18} className="flex-shrink-0" />
              <span className="capitalize">{isWeekView ? `${displayDate} - ${displayEndDate}` : (isToday ? `Hoy, ${displayDate}` : displayDate)}</span>
            </div>
            <Link href={`/dashboard/agenda?date=${nextDateStr}&view=${viewParam}`} className="p-1 hover:bg-gray-100 rounded transition-colors flex items-center justify-center">
              <ChevronRight size={20} className="text-gray-600" />
            </Link>
          </div>
        </div>
      </div>

      {/* Lista del Día/Semana */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-700">{isWeekView ? 'Entregas de la Semana' : 'Entregas Programadas'}</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {pedidos && pedidos.map((pedido) => (
            <div key={pedido.id} className="flex flex-col sm:flex-row sm:items-center p-4 hover:bg-gray-50 transition-colors gap-3 sm:gap-0">
              <div className="w-full sm:w-32 font-bold text-gray-700 text-sm sm:text-base flex flex-col justify-center sm:block">
                {isWeekView && <span className="text-xs text-blue-600 font-bold uppercase block mb-0.5">{formatDateLabel(pedido.date)}</span>}
                <span>{formatTime(pedido.time)}</span>
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
              <p className="font-medium">{isWeekView ? 'No hay entregas programadas para esta semana.' : 'No hay entregas programadas para hoy.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
