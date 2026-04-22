function padDatePart(value: number) {
  return value.toString().padStart(2, '0')
}

export function toFixtureDateTimeInputValue(value: string | null | undefined) {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const year = date.getFullYear()
  const month = padDatePart(date.getMonth() + 1)
  const day = padDatePart(date.getDate())
  const hours = padDatePart(date.getHours())
  const minutes = padDatePart(date.getMinutes())

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function toFixtureIsoDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    throw new Error('La fecha y hora del partido no es valida.')
  }

  return date.toISOString()
}
