'use client'

import { useState, useRef, useEffect } from 'react'

interface ConfirmFormButtonProps {
  action: (formData: FormData) => void | Promise<void>
  hiddenFields: Record<string, string>
  buttonLabel: React.ReactNode
  buttonClassName: string
  confirmMessage?: string
  confirmLabel?: string
  cancelLabel?: string
}

export default function ConfirmFormButton({
  action,
  hiddenFields,
  buttonLabel,
  buttonClassName,
  confirmMessage = '¿Estás seguro?',
  confirmLabel = 'Sí',
  cancelLabel = 'No',
}: ConfirmFormButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showConfirm) return
    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        setShowConfirm(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showConfirm])

  const handleConfirm = async () => {
    setIsPending(true)
    try {
      const formData = new FormData()
      for (const [key, value] of Object.entries(hiddenFields)) {
        formData.append(key, value)
      }
      await action(formData)
    } catch (error) {
      console.error(error)
      alert('Hubo un error al realizar la acción.')
    } finally {
      setIsPending(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div ref={overlayRef} className="relative inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2 animate-in fade-in zoom-in-95 duration-150">
        <span className="text-xs font-medium text-gray-600 whitespace-nowrap">{confirmMessage}</span>
        <button
          onClick={() => setShowConfirm(false)}
          className="text-gray-500 hover:text-gray-700 font-bold text-xs px-2 py-1 bg-gray-100 rounded-lg transition-colors"
          disabled={isPending}
        >
          {cancelLabel}
        </button>
        <button
          onClick={handleConfirm}
          disabled={isPending}
          className="text-white hover:bg-red-700 font-bold text-xs px-2 py-1 bg-red-600 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPending ? '...' : confirmLabel}
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setShowConfirm(true)}
      className={buttonClassName}
    >
      {buttonLabel}
    </button>
  )
}
