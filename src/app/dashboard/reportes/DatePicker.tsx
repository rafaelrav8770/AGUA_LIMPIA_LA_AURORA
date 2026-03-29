'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export default function DatePicker({ dateStr }: { dateStr: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    if (newDate) {
      current.set('date', newDate)
    } else {
      current.delete('date')
    }
    const search = current.toString()
    const query = search ? `?${search}` : ''
    router.push(`${pathname}${query}`)
  }

  return (
    <input
      type="date"
      value={dateStr}
      onChange={handleDateChange}
      className="bg-transparent border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-700 outline-none focus:border-blue-500 font-normal"
    />
  )
}
