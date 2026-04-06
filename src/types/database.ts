import type { ContactoRow } from './contacto'
import type { NoticiaRow } from './noticia'

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
          estado?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          nombrecompleto?: string
          email?: string
          telefono?: string
          mensaje?: string
          estado?: string | null
          created_at?: string
        }
        Relationships: []
      }
      noticias: {
        Row: NoticiaRow
        Insert: {
          id?: number
          titulo: string
          descripcion: string
          imageUrl: string
          fecha: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          titulo?: string
          descripcion?: string
          imageUrl?: string
          fecha?: string
          created_at?: string
          updated_at?: string
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
