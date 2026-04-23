export type FixtureCondition = 'local' | 'visitante'

export type FixtureStatus = 'programado' | 'jugado' | 'suspendido' | 'postergado'

export type FixtureStatusFilter = 'all' | FixtureStatus

export type FixtureRow = {
  id: number
  fecha_partido: string
  rival: string
  condicion: FixtureCondition
  estado: FixtureStatus
  created_at: string
  updated_at: string
}

export type FixtureListParams = {
  page: number
  pageSize: number
  estado: FixtureStatusFilter
}

export type FixtureListResult = {
  records: FixtureRow[]
  total: number
}

export type FixtureFormValues = {
  fecha_partido: string
  rival: string
  condicion: FixtureCondition
  estado: FixtureStatus
}
