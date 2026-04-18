'use client'

import { useState, useEffect } from 'react'

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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showConfirm) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [showConfirm])

  const handleConfirm = async () => {
    if (isPending) return
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

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setShowConfirm(true)
        }}
        className={buttonClassName}
      >
        {buttonLabel}
      </button>

      {showConfirm && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowConfirm(false)}
          onTouchEnd={(e) => {
            // Only close if the tap was directly on the backdrop
            if (e.target === e.currentTarget) {
              setShowConfirm(false)
            }
          }}
          style={{ touchAction: 'none' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-[280px] flex flex-col items-center gap-4"
          >
            <p className="text-lg font-semibold text-gray-800 text-center leading-snug">
              {confirmMessage}
            </p>
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowConfirm(false)
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  setShowConfirm(false)
                }}
                className="flex-1 text-gray-600 font-bold text-base px-4 py-4 bg-gray-100 active:bg-gray-300 rounded-xl transition-colors select-none"
                disabled={isPending}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleConfirm()
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  handleConfirm()
                }}
                disabled={isPending}
                className="flex-1 text-white font-bold text-base px-4 py-4 bg-red-600 active:bg-red-800 rounded-xl transition-colors select-none disabled:opacity-50"
              >
                {isPending ? '...' : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
