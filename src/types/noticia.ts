export type NoticiaRow = {
  id: number
  titulo: string
  descripcion: string
  imageUrl: string
  fecha: string
  created_at: string
  updated_at: string
}

export type NoticiaListParams = {
  page: number
  pageSize: number
}

export type NoticiaListResult = {
  records: NoticiaRow[]
  total: number
}

export type NoticiaFormValues = {
  titulo: string
  descripcion: string
  fecha: string
  image: File | null
}
