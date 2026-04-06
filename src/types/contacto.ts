export type ContactoRow = {
  id: number
  nombrecompleto: string
  email: string
  telefono: string
  mensaje: string
  estado: string | null
  created_at: string
}

export type ContactoStatusFilter = 'all' | 'pendiente' | 'en progreso' | 'resuelta'

export type ContactoListParams = {
  page: number
  pageSize: number
  search: string
  statusFilter: ContactoStatusFilter
}

export type ContactoListResult = {
  records: ContactoRow[]
  total: number
}

export type DashboardStats = {
  totalConsultas: number
  consultas24h: number
  ultimaRecepcion: string | null
}
