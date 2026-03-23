import { BarChart3, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

export default function ReportesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reportes Financieros</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button className="px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-medium">
          Corte Diario
        </button>
        <button className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium">
          Resumen Mensual
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 p-2 rounded-lg text-green-600">
              <TrendingUp size={20} />
            </div>
            <h3 className="font-medium text-gray-700">Total Ingresos</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">$4,500.00</p>
          <p className="text-sm text-gray-500 mt-1">12 pedidos completados</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-100 p-2 rounded-lg text-red-600">
              <TrendingDown size={20} />
            </div>
            <h3 className="font-medium text-gray-700">Total Egresos</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">$800.00</p>
          <p className="text-sm text-gray-500 mt-1">3 gastos registrados</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-lg text-white">
              <DollarSign size={20} />
            </div>
            <h3 className="font-medium text-blue-50">Utilidad Neta</h3>
          </div>
          <p className="text-3xl font-bold text-white">$3,700.00</p>
          <p className="text-sm text-blue-100 mt-1">Margen: 82.2%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-gray-700">
            <BarChart3 size={20} />
            <h2 className="font-semibold text-lg">Desglose de Pedidos</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Cobrados (Efectivo/Transf.)</span>
              <span className="font-bold text-gray-900">$4,500.00</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-orange-700">Pendientes de Cobro</span>
              <span className="font-bold text-orange-700">$800.00</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-red-700">Cancelados</span>
              <span className="font-bold text-red-700">$0.00</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-gray-700">
            <BarChart3 size={20} />
            <h2 className="font-semibold text-lg">Desglose de Egresos</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-600">Combustible</span>
              </div>
              <span className="font-medium">$500.00</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-gray-600">Mantenimiento</span>
              </div>
              <span className="font-medium">$300.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
