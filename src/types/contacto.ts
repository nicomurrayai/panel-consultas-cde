export type ContactoRow = {
  id: number
  nombrecompleto: string
  email: string
  telefono: string
  mensaje: string
  created_at: string
}

export type ContactoListParams = {
  page: number
  pageSize: number
  search: string
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

export type Database = {
  public: {
    Tables: {
      contacto: {
        Row: ContactoRow
        Insert: {
          id?: number
          nombrecompleto: string
          email: string
          telefono: string
          mensaje: string
          created_at?: string
        }
        Update: {
          id?: number
          nombrecompleto?: string
          email?: string
          telefono?: string
          mensaje?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}