'use client'

import { deleteExpense } from './actions'
import Link from 'next/link'
import { useState } from 'react'

export default function EgresoActions({ id }: { id: string | number }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteExpense(id)
    } catch (error) {
      console.error(error)
      alert('Hubo un error al borrar el egreso.')
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex justify-end gap-2 items-center">
        <span className="text-xs text-gray-500">¿Borrar?</span>
        <button 
          onClick={() => setShowConfirm(false)}
          className="text-gray-500 hover:text-gray-700 font-medium text-sm px-2 py-1 bg-gray-100 rounded"
          disabled={isDeleting}
        >
          No
        </button>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-white hover:bg-red-700 font-medium text-sm px-2 py-1 bg-red-600 rounded disabled:opacity-50"
        >
          {isDeleting ? '...' : 'Sí'}
        </button>
      </div>
    )
  }

  return (
    <div className="flex justify-end gap-3 items-center">
      <Link 
        href={`/dashboard/egresos/${id}/editar`}
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Editar
      </Link>
      <button 
        onClick={() => setShowConfirm(true)}
        className="text-red-600 hover:text-red-800 font-medium"
      >
        Borrar
      </button>
    </div>
  )
}
