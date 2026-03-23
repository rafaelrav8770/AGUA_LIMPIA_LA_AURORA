/**
 * Convierte hora 24h ("14:30") a formato AM/PM ("2:30 PM")
 */
export function formatTime(time24: string | null | undefined): string {
  if (!time24) return ''
  const [hourStr, minuteStr] = time24.substring(0, 5).split(':')
  let hour = parseInt(hourStr, 10)
  const minute = minuteStr || '00'
  const period = hour >= 12 ? 'PM' : 'AM'
  if (hour === 0) hour = 12
  else if (hour > 12) hour -= 12
  return `${hour}:${minute} ${period}`
}

/**
 * Genera las opciones de hora con formato AM/PM para selectores.
 * Retorna array de { value: "HH:MM" (24h), label: "h:MM AM/PM" }
 */
export function getTimeOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = []
  for (let i = 0; i < 15; i++) {
    const hour = i + 6
    const h = hour.toString().padStart(2, '0')
    options.push(
      { value: `${h}:00`, label: formatTime(`${h}:00`) },
      { value: `${h}:30`, label: formatTime(`${h}:30`) }
    )
  }
  return options
}
