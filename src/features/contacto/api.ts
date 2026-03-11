import { getSupabaseClient } from '../../lib/supabase'
import type {
  ContactoListParams,
  ContactoListResult,
  ContactoRow,
  DashboardStats,
} from '../../types/contacto'
import {
  getContactoStatusFilterValues,
  type EditableContactoEstado,
} from './status'

const CONTACTO_COLUMNS = 'id, nombrecompleto, email, telefono, mensaje, estado, created_at'

function formatSupabaseErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    return error.message
  }

  return fallbackMessage
}

function escapeLikeValue(value: string) {
  return value
    .replaceAll('\\', '\\\\')
    .replaceAll(',', '\\,')
    .replaceAll('(', '\\(')
    .replaceAll(')', '\\)')
    .replaceAll('%', '\\%')
    .replaceAll('_', '\\_')
}

export async function getContactoList({
  page,
  pageSize,
  search,
  statusFilter,
}: ContactoListParams): Promise<ContactoListResult> {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const normalizedSearch = search.trim()
  const supabase = getSupabaseClient()

  try {
    let query = supabase.from('contacto').select(CONTACTO_COLUMNS, { count: 'exact' })

    if (normalizedSearch) {
      const escapedSearch = escapeLikeValue(normalizedSearch)
      query = query.or(`nombrecompleto.ilike.*${escapedSearch}*,email.ilike.*${escapedSearch}*`)
    }

    if (statusFilter !== 'all') {
      const statusValues = getContactoStatusFilterValues(statusFilter)

      query =
        statusValues.length === 1
          ? query.eq('estado', statusValues[0])
          : query.in('estado', statusValues)
    }

    const { count, data, error } = await query
      .order('created_at', { ascending: false })
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
      formatSupabaseErrorMessage(
        error,
        'No se pudieron obtener las consultas desde Supabase.',
      ),
    )
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = getSupabaseClient()
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  try {
    const [totalResult, recentResult, latestResult] = await Promise.all([
      supabase.from('contacto').select('id', { count: 'exact', head: true }),
      supabase
        .from('contacto')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', last24Hours),
      supabase
        .from('contacto')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1),
    ])

    if (totalResult.error) {
      throw totalResult.error
    }

    if (recentResult.error) {
      throw recentResult.error
    }

    if (latestResult.error) {
      throw latestResult.error
    }

    return {
      totalConsultas: totalResult.count ?? 0,
      consultas24h: recentResult.count ?? 0,
      ultimaRecepcion: latestResult.data?.[0]?.created_at ?? null,
    }
  } catch (error) {
    throw new Error(
      formatSupabaseErrorMessage(error, 'No se pudieron calcular las metricas del panel.'),
    )
  }
}

export async function updateContactoEstado(
  contactoId: number,
  estado: EditableContactoEstado,
): Promise<ContactoRow> {
  const supabase = getSupabaseClient()

  try {
    const { data, error } = await supabase
      .from('contacto')
      .update({ estado })
      .eq('id', contactoId)
      .select(CONTACTO_COLUMNS)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    throw new Error(
      formatSupabaseErrorMessage(error, 'No se pudo actualizar el estado de la consulta.'),
    )
  }
}

export async function deleteContacto(contactoId: number): Promise<void> {
  const supabase = getSupabaseClient()

  try {
    const { error } = await supabase.from('contacto').delete().eq('id', contactoId)

    if (error) {
      throw error
    }
  } catch (error) {
    throw new Error(
      formatSupabaseErrorMessage(error, 'No se pudo eliminar la consulta.'),
    )
  }
}