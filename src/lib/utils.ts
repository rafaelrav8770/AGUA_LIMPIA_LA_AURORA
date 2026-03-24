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

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD forzando la zona horaria de México
 */
export function getMxTodayStr(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date())
}

/**
 * Obtiene la hora actual en formato HH:MM (24h) forzando la zona horaria de México
 */
export function getMxNowTimeStr(): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Mexico_City',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date())
}

/**
 * Obtiene nombre del día, mes, y formato para armar la UI sin depender del UTC del servidor
 */
export function getMxDisplayDate(): string {
  return new Intl.DateTimeFormat('es-MX', {
    timeZone: 'America/Mexico_City',
    day: 'numeric',
    month: 'short'
  }).format(new Date())
}

/**
 * Retorna 'YYYY-MM-01' y 'YYYY-MM-DD' del último día del mes actual (timeZone México)
 */
export function getMxMonthStartEnd(): { firstDay: string; lastDay: string; monthName: string } {
  const mxDateStr = new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" })
  const mxDate = new Date(mxDateStr) // Fecha local en MX
  const year = mxDate.getFullYear()
  const month = mxDate.getMonth() + 1
  const mStr = String(month).padStart(2, '0')
  
  // Días en el mes
  const lastDayNum = new Date(year, month, 0).getDate()
  
  const monthName = new Intl.DateTimeFormat('es-MX', {
    timeZone: 'America/Mexico_City',
    month: 'long', 
    year: 'numeric'
  }).format(new Date())

  return {
    firstDay: `${year}-${mStr}-01`,
    lastDay: `${year}-${mStr}-${lastDayNum}`,
    monthName
  }
}
