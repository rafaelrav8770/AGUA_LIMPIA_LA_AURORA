import { Plus, Download } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import EgresoActions from './EgresoActions'

export default async function EgresosPage() {
  const supabase = await createClient()
  const { data: egresos } = await supabase.from('expenses').select('*').order('date', { ascending: false })

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Egresos</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={20} />
            <span className="hidden sm:inline">Exportar</span>
          </button>
          <Link href="/dashboard/egresos/nuevo" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={20} />
            <span>Nuevo Egreso</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-700 uppercase">
              <tr>
                <th scope="col" className="px-6 py-4">Fecha</th>
                <th scope="col" className="px-6 py-4">Concepto</th>
                <th scope="col" className="px-6 py-4">Categoría</th>
                <th scope="col" className="px-6 py-4">Monto</th>
                <th scope="col" className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {egresos && egresos.map((egreso) => (
                <tr key={egreso.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{egreso.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{egreso.concept}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {egreso.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-red-600">${egreso.amount}</td>
                  <td className="px-6 py-4 text-right">
                    <EgresoActions id={egreso.id} />
                  </td>
                </tr>
              ))}
              {(!egresos || egresos.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No hay egresos registrados en la base de datos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
