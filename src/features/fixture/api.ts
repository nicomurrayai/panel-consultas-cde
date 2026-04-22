import { getSupabaseClient } from '../../lib/supabase'
import type {
  FixtureFormValues,
  FixtureListParams,
  FixtureListResult,
  FixtureRow,
} from '../../types/fixture'
import { toFixtureIsoDateTime } from './dateTime'

const FIXTURE_TABLE = 'fixture_partidos'
const FIXTURE_COLUMNS =
  'id, temporada, fecha_partido, rival, condicion, torneo, estado, created_at, updated_at'

function formatSupabaseErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    return error.message
  }

  return fallbackMessage
}

function buildFixturePayload(values: FixtureFormValues) {
  const torneo = values.torneo.trim()

  return {
    temporada: values.temporada,
    fecha_partido: toFixtureIsoDateTime(values.fecha_partido),
    rival: values.rival.trim(),
    condicion: values.condicion,
    torneo: torneo ? torneo : null,
    estado: values.estado,
  }
}

export async function getFixtureList({
  page,
  pageSize,
  temporada,
  estado,
}: FixtureListParams): Promise<FixtureListResult> {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const supabase = getSupabaseClient()

  try {
    let query = supabase
      .from(FIXTURE_TABLE)
      .select(FIXTURE_COLUMNS, { count: 'exact' })

    if (temporada !== null) {
      query = query.eq('temporada', temporada)
    }

    if (estado !== 'all') {
      query = query.eq('estado', estado)
    }

    const { count, data, error } = await query
      .order('fecha_partido', { ascending: true })
      .order('created_at', { ascending: true })
      .range(from, to)

    if (error) {
      throw error
    }

    return {
      records: data ?? [],
      total: count ?? 0,
    }
  } catch (error) {
    throw new Error(
      formatSupabaseErrorMessage(error, 'No se pudieron obtener los partidos del fixture.'),
    )
  }
}

export async function getFixtureSeasonOptions(): Promise<number[]> {
  const supabase = getSupabaseClient()

  try {
    const { data, error } = await supabase
      .from(FIXTURE_TABLE)
      .select('temporada')
      .order('temporada', { ascending: false })

    if (error) {
      throw error
    }

    return Array.from(new Set((data ?? []).map((item) => item.temporada))).sort(
      (left, right) => right - left,
    )
  } catch (error) {
    throw new Error(
      formatSupabaseErrorMessage(
        error,
        'No se pudieron cargar las temporadas del fixture.',
      ),
    )
  }
}

export async function createFixture(values: FixtureFormValues): Promise<FixtureRow> {
  const supabase = getSupabaseClient()

  try {
    const { data, error } = await supabase
      .from(FIXTURE_TABLE)
      .insert(buildFixturePayload(values))
      .select(FIXTURE_COLUMNS)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    throw new Error(
      formatSupabaseErrorMessage(error, 'No se pudo crear el partido del fixture.'),
    )
  }
}

export async function updateFixture(
  fixture: FixtureRow,
  values: FixtureFormValues,
): Promise<FixtureRow> {
  const supabase = getSupabaseClient()

  try {
    const { data, error } = await supabase
      .from(FIXTURE_TABLE)
      .update(buildFixturePayload(values))
      .eq('id', fixture.id)
      .select(FIXTURE_COLUMNS)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    throw new Error(
      formatSupabaseErrorMessage(error, 'No se pudo actualizar el partido del fixture.'),
    )
  }
}

export async function deleteFixture(fixtureId: number): Promise<void> {
  const supabase = getSupabaseClient()

  try {
    const { error } = await supabase.from(FIXTURE_TABLE).delete().eq('id', fixtureId)

    if (error) {
      throw error
    }
  } catch (error) {
    throw new Error(
      formatSupabaseErrorMessage(error, 'No se pudo eliminar el partido del fixture.'),
    )
  }
}
