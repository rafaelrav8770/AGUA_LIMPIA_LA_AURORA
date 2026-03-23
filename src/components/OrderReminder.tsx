'use client'

import { useEffect, useRef, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Bell, BellRing, X } from 'lucide-react'

interface PendingOrder {
  id: string
  client_name: string
  address: string
  time: string
  date: string
  price: number
}

function playAlertSound() {
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  if (!AudioCtx) return
  const ctx = new AudioCtx()

  // Secuencia de tonos tipo alarma
  const notes = [800, 1000, 800, 1000, 800]
  let startTime = ctx.currentTime

  for (const freq of notes) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = freq
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.3, startTime)
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25)
    osc.start(startTime)
    osc.stop(startTime + 0.25)
    startTime += 0.3
  }
}

export function OrderReminder() {
  const [alerts, setAlerts] = useState<PendingOrder[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const notifiedRef = useRef<Set<string>>(new Set())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const checkOrders = async () => {
    const now = new Date()
    const offset = now.getTimezoneOffset()
    const localDate = new Date(now.getTime() - (offset * 60 * 1000))
    const todayStr = localDate.toISOString().split('T')[0]

    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .eq('date', todayStr)
      .eq('status', 'Pendiente')

    if (!orders) return

    const upcoming: PendingOrder[] = []

    for (const order of orders) {
      // Parsear la hora del pedido
      const timeParts = order.time?.substring(0, 5).split(':')
      if (!timeParts || timeParts.length < 2) continue

      const orderHour = parseInt(timeParts[0], 10)
      const orderMin = parseInt(timeParts[1], 10)

      const orderDate = new Date(now)
      orderDate.setHours(orderHour, orderMin, 0, 0)

      const diffMs = orderDate.getTime() - now.getTime()
      const diffMin = diffMs / (1000 * 60)

      // Alertar si quedan 30 minutos o menos y aún no ha pasado la hora
      if (diffMin > 0 && diffMin <= 30) {
        upcoming.push({
          id: order.id,
          client_name: order.client_name,
          address: order.address,
          time: order.time,
          date: order.date,
          price: order.price,
        })

        // Sonar solo la primera vez que detecta este pedido
        if (!notifiedRef.current.has(order.id)) {
          notifiedRef.current.add(order.id)
          playAlertSound()

          // Notificación del navegador si tiene permiso
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🚰 Pedido en 30 min', {
              body: `${order.client_name} - ${order.address} a las ${order.time?.substring(0, 5)}`,
              icon: '/icon.svg',
            })
          }
        }
      }
    }

    setAlerts(upcoming)
  }

  useEffect(() => {
    // Pedir permiso de notificaciones al montar
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Chequear inmediatamente y luego cada 60 seg
    checkOrders()
    intervalRef.current = setInterval(checkOrders, 60_000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const visibleAlerts = alerts.filter(a => !dismissed.has(a.id))

  if (visibleAlerts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full">
      {visibleAlerts.map((alert) => (
        <div key={alert.id} className="bg-orange-500 text-white rounded-2xl shadow-2xl p-4 animate-bounce-slow relative">
          <button
            onClick={() => setDismissed(prev => new Set(prev).add(alert.id))}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-orange-600 transition-colors"
          >
            <X size={16} />
          </button>
          <div className="flex items-start gap-3">
            <div className="bg-orange-400 p-2 rounded-xl mt-0.5">
              <BellRing size={22} className="animate-pulse" />
            </div>
            <div>
              <p className="font-bold text-sm">⏰ Pedido en menos de 30 min</p>
              <p className="font-bold text-lg mt-1">{alert.client_name}</p>
              <p className="text-orange-100 text-sm">{alert.address}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold">{alert.time?.substring(0, 5)}</span>
                <span className="font-bold">${alert.price}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
