const compactNumberFormatter = new Intl.NumberFormat('es-ES', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const dateTimeFormatter = new Intl.DateTimeFormat('es-ES', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const shortDateTimeFormatter = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  dateStyle: 'medium',
})

const relativeFormatter = new Intl.RelativeTimeFormat('es', {
  numeric: 'auto',
})

export function formatCompactNumber(value: number) {
  return compactNumberFormatter.format(value)
}

export function formatDateTime(value: string | null) {
  if (!value) {
    return 'Sin registros'
  }

  return dateTimeFormatter.format(new Date(value))
}

export function formatShortDateTime(value: string) {
  return shortDateTimeFormatter.format(new Date(value))
}

export function formatDate(value: string | null) {
  if (!value) {
    return 'Sin fecha'
  }

  return dateFormatter.format(new Date(value))
}

export function formatWhatsAppLink(value: string) {
  const normalizedPhone = value.replace(/\D/g, '')

  if (!normalizedPhone) {
    return null
  }

  return `https://wa.me/${normalizedPhone}`
}

export function formatRelativeTime(value: string | null) {
  if (!value) {
    return 'Esperando primeras consultas'
  }

  const differenceInMinutes = Math.round((new Date(value).getTime() - Date.now()) / 60000)

  if (Math.abs(differenceInMinutes) < 60) {
    return relativeFormatter.format(differenceInMinutes, 'minute')
  }

  const differenceInHours = Math.round(differenceInMinutes / 60)

  if (Math.abs(differenceInHours) < 24) {
    return relativeFormatter.format(differenceInHours, 'hour')
  }

  const differenceInDays = Math.round(differenceInHours / 24)
  return relativeFormatter.format(differenceInDays, 'day')
}
