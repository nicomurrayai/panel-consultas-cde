export type FixtureCondition = 'local' | 'visitante'

export type FixtureStatus = 'programado' | 'jugado' | 'suspendido' | 'postergado'

export type FixtureStatusFilter = 'all' | FixtureStatus

export type FixtureSeasonFilter = 'all' | number

export type FixtureRow = {
  id: number
  temporada: number
  fecha_partido: string
  rival: string
  condicion: FixtureCondition
  torneo: string | null
  estado: FixtureStatus
  created_at: string
  updated_at: string
}

export type FixtureListParams = {
  page: number
  pageSize: number
  temporada: number | null
  estado: FixtureStatusFilter
}

export type FixtureListResult = {
  records: FixtureRow[]
  total: number
}

export type FixtureFormValues = {
  temporada: number
  fecha_partido: string
  rival: string
  condicion: FixtureCondition
  torneo: string
  estado: FixtureStatus
}
