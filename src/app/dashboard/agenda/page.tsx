import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'

export default function AgendaPage() {
  return (
    <div className="p-6">
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
              <span>Hoy, 22 Mar</span>
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
          {[
            { time: '09:00 AM', client: 'Juan Pérez', loc: 'Col. Centro', price: '$800', status: 'Entregado' },
            { time: '11:30 AM', client: 'María García', loc: 'Fracc. Las Arboledas', price: '$800', status: 'Pendiente' },
            { time: '02:00 PM', client: 'Restaurante El Mar', loc: 'Zona Hotelera', price: '$1,600', status: 'Pendiente' },
          ].map((item, i) => (
            <div key={i} className="flex items-center p-4 hover:bg-gray-50 transition-colors">
              <div className="w-24 font-bold text-gray-700">
                {item.time}
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="font-medium text-gray-900">{item.client}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{item.loc}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <p className="font-medium text-gray-900">{item.price}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'Entregado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
