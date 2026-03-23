import { Droplet, DollarSign, TrendingUp, Clock, AlertCircle } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Resumen del Día</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Pedidos Hoy</p>
            <p className="text-2xl font-bold text-gray-800">12</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <Droplet size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Ingresos Hoy</p>
            <p className="text-2xl font-bold text-green-600">$4,500</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg text-green-600">
            <DollarSign size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Egresos Hoy</p>
            <p className="text-2xl font-bold text-red-600">$800</p>
          </div>
          <div className="bg-red-100 p-3 rounded-lg text-red-600">
            <TrendingUp size={24} className="rotate-180" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Ganancia</p>
            <p className="text-2xl font-bold text-blue-600">$3,700</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-orange-600 font-semibold">
            <AlertCircle size={20} />
            <h2>Pendientes de Cobro</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
              <div>
                <p className="font-medium">Juan Pérez</p>
                <p className="text-sm text-gray-500">Col. Centro - 2 Pipas</p>
              </div>
              <p className="font-bold text-orange-600">$800</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-blue-600 font-semibold">
            <Clock size={20} />
            <h2>Próximo Pedido</h2>
          </div>
          <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
            <div>
              <p className="font-bold text-blue-800 text-lg">11:30 AM</p>
              <p className="font-medium text-blue-700">María García</p>
              <p className="text-sm text-blue-600">Fracc. Las Arboledas</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                En 45 min
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
