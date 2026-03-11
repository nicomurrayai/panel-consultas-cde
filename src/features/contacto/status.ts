import type { ContactoStatusFilter } from '../../types/contacto'

export const CONTACTO_EDITABLE_STATUS_OPTIONS = [
  {
    label: 'En progreso',
    value: 'en progreso',
  },
  {
    label: 'Resuelta',
    value: 'resuelta',
  },
] as const

export type EditableContactoEstado =
  (typeof CONTACTO_EDITABLE_STATUS_OPTIONS)[number]['value']

export const CONTACTO_FILTER_STATUS_OPTIONS: Array<{
  label: string
  value: ContactoStatusFilter
}> = [
  {
    label: 'Todos los estados',
    value: 'all',
  },
  {
    label: 'Pendiente',
    value: 'pendiente',
  },
  {
    label: 'En progreso',
    value: 'en progreso',
  },
  {
    label: 'Resuelta',
    value: 'resuelta',
  },
]

export function getContactoStatusFilterValues(
  statusFilter: Exclude<ContactoStatusFilter, 'all'>,
) {
  switch (statusFilter) {
    case 'en progreso':
      return ['en progreso', 'en proceso']
    case 'resuelta':
      return ['resuelta', 'resuelto']
    default:
      return [statusFilter]
  }
}

export function normalizeContactoEstado(estado: string | null | undefined) {
  return estado?.trim().toLowerCase() ?? ''
}

export function formatContactoEstadoLabel(estado: string | null | undefined) {
  const normalized = normalizeContactoEstado(estado)

  if (!normalized) {
    return 'Sin estado'
  }

  return `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}`
}