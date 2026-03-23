'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, CalendarDays, DollarSign, LogOut, Droplet } from 'lucide-react'

const navItems = [
  { name: 'Inicio', href: '/dashboard', icon: Home },
  { name: 'Pedidos', href: '/dashboard/pedidos', icon: Droplet },
  { name: 'Agenda', href: '/dashboard/agenda', icon: CalendarDays },
  { name: 'Egresos', href: '/dashboard/egresos', icon: DollarSign },
  { name: 'Reportes', href: '/dashboard/reportes', icon: Calendar },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <>
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-blue-900 text-white min-h-screen">
        <div className="p-6 text-2xl font-bold border-b border-blue-800">
          Agua Limpia
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-blue-800">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 w-full transition-colors text-left">
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Bottom bar for Mobile */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around pb-safe z-50">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-3 px-2 ${
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <Icon size={24} />
              <span className="text-[10px] mt-1">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
