import { formatFixtureStatusLabel } from '../status'

type FixtureStatusBadgeProps = {
  estado: string | null | undefined
}

const statusClasses: Record<string, string> = {
  programado:
    'border-[rgba(37,150,190,0.18)] bg-[rgba(37,150,190,0.12)] text-(--brand-strong)',
  jugado:
    'border-[rgba(22,163,74,0.2)] bg-[rgba(22,163,74,0.12)] text-[rgb(21,128,61)]',
  suspendido:
    'border-[rgba(220,38,38,0.18)] bg-[rgba(254,226,226,0.8)] text-[rgb(153,27,27)]',
  postergado:
    'border-[rgba(217,119,6,0.18)] bg-[rgba(253,230,138,0.35)] text-[rgb(146,64,14)]',
}

export function FixtureStatusBadge({ estado }: FixtureStatusBadgeProps) {
  const normalizedValue = estado?.trim().toLowerCase() ?? ''
  const colorClasses =
    statusClasses[normalizedValue] ??
    'border-[rgba(92,118,128,0.18)] bg-[rgba(92,118,128,0.12)] text-(--muted)'

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${colorClasses}`}
    >
      {formatFixtureStatusLabel(estado)}
    </span>
  )
}
