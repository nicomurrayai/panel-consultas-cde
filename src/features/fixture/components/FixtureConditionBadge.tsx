import { formatFixtureConditionLabel } from '../status'

type FixtureConditionBadgeProps = {
  condicion: string | null | undefined
}

const conditionClasses: Record<string, string> = {
  local:
    'border-[rgba(37,150,190,0.18)] bg-[rgba(37,150,190,0.1)] text-(--brand-strong)',
  visitante:
    'border-[rgba(99,102,241,0.18)] bg-[rgba(99,102,241,0.1)] text-[rgb(67,56,202)]',
}

export function FixtureConditionBadge({ condicion }: FixtureConditionBadgeProps) {
  const normalizedValue = condicion?.trim().toLowerCase() ?? ''
  const colorClasses =
    conditionClasses[normalizedValue] ??
    'border-[rgba(92,118,128,0.18)] bg-[rgba(92,118,128,0.12)] text-(--muted)'

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${colorClasses}`}
    >
      {formatFixtureConditionLabel(condicion)}
    </span>
  )
}
