import type {
  FixtureCondition,
  FixtureStatus,
  FixtureStatusFilter,
} from '../../types/fixture'

const FIXTURE_STATUS_LABELS: Record<FixtureStatus, string> = {
  programado: 'Programado',
  jugado: 'Jugado',
  suspendido: 'Suspendido',
  postergado: 'Postergado',
}

const FIXTURE_CONDITION_LABELS: Record<FixtureCondition, string> = {
  local: 'Local',
  visitante: 'Visitante',
}

export const FIXTURE_CONDITION_OPTIONS = [
  {
    label: FIXTURE_CONDITION_LABELS.local,
    value: 'local',
  },
  {
    label: FIXTURE_CONDITION_LABELS.visitante,
    value: 'visitante',
  },
] as const

export const FIXTURE_STATUS_OPTIONS = [
  {
    label: FIXTURE_STATUS_LABELS.programado,
    value: 'programado',
  },
  {
    label: FIXTURE_STATUS_LABELS.jugado,
    value: 'jugado',
  },
  {
    label: FIXTURE_STATUS_LABELS.suspendido,
    value: 'suspendido',
  },
  {
    label: FIXTURE_STATUS_LABELS.postergado,
    value: 'postergado',
  },
] as const

export const FIXTURE_FILTER_STATUS_OPTIONS: Array<{
  label: string
  value: FixtureStatusFilter
}> = [
  {
    label: 'Todos los estados',
    value: 'all',
  },
  ...FIXTURE_STATUS_OPTIONS,
]

export function formatFixtureStatusLabel(value: string | null | undefined) {
  if (!value) {
    return 'Sin estado'
  }

  const normalizedValue = value.trim().toLowerCase() as FixtureStatus
  return FIXTURE_STATUS_LABELS[normalizedValue] ?? value
}

export function formatFixtureConditionLabel(value: string | null | undefined) {
  if (!value) {
    return 'Sin condicion'
  }

  const normalizedValue = value.trim().toLowerCase() as FixtureCondition
  return FIXTURE_CONDITION_LABELS[normalizedValue] ?? value
}
