import { createExpense } from '../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NuevoEgresoPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/egresos" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Nuevo Egreso</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form action={createExpense} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Fecha</label>
              <input type="date" name="date" required className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Concepto</label>
              <input type="text" name="concept" required placeholder="Ej: Gasolina, Mantenimiento..." className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Categoría</label>
              <select name="category" required className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="Combustible">Combustible</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Nómina">Nómina</option>
                <option value="Servicios">Servicios (Agua, Luz, Internet)</option>
                <option value="Herramientas">Herramientas/Refacciones</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Monto</label>
              <input type="number" step="0.01" name="amount" min="0" required className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Notas Adicionales</label>
              <textarea name="notes" rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <Link href="/dashboard/egresos" className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors">
              Cancelar
            </Link>
            <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors">
              Guardar Egreso
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
