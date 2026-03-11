import { formatContactoEstadoLabel, normalizeContactoEstado } from '../status'

type ContactoStatusBadgeProps = {
  estado: string | null
}

function getEstadoClasses(estado: string | null) {
  const normalized = normalizeContactoEstado(estado)

  switch (normalized) {
    case 'pendiente':
      return 'border-[rgba(245,158,11,0.26)] bg-[rgba(245,158,11,0.12)] text-[rgb(146,64,14)]'
    case 'resuelto':
    case 'resuelta':
      return 'border-[rgba(34,197,94,0.24)] bg-[rgba(34,197,94,0.12)] text-[rgb(21,128,61)]'
    case 'en progreso':
    case 'en proceso':
      return 'border-[rgba(37,150,190,0.24)] bg-[rgba(37,150,190,0.12)] text-(--brand-strong)'
    default:
      return 'border-(--line) bg-(--surface-soft) text-(--ink)'
  }
}

export function ContactoStatusBadge({ estado }: ContactoStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${getEstadoClasses(estado)}`}
    >
      {formatContactoEstadoLabel(estado)}
    </span>
  )
}