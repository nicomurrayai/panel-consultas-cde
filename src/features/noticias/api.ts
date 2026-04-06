import { getSupabaseClient } from '../../lib/supabase'
import type {
  NoticiaFormValues,
  NoticiaListParams,
  NoticiaListResult,
  NoticiaRow,
} from '../../types/noticia'

const NOTICIA_COLUMNS = 'id, titulo, descripcion, imageUrl, fecha, created_at, updated_at'
const NOTICIAS_BUCKET = 'noticias'
const PUBLIC_URL_MARKER = `/storage/v1/object/public/${NOTICIAS_BUCKET}/`

function formatSupabaseErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    return error.message
  }

  return fallbackMessage
}

function getFileExtension(fileName: string) {
  const extension = fileName.split('.').pop()?.trim().toLowerCase()
  return extension || 'bin'
}

function buildStoragePath(file: File) {
  return `${crypto.randomUUID()}-${Date.now()}.${getFileExtension(file.name)}`
}

function getStoragePathFromPublicUrl(publicUrl: string) {
  try {
    const { pathname } = new URL(publicUrl)
    const markerIndex = pathname.indexOf(PUBLIC_URL_MARKER)

    if (markerIndex === -1) {
      return null
    }

    return decodeURIComponent(pathname.slice(markerIndex + PUBLIC_URL_MARKER.length))
  } catch {
    return null
  }
}

async function uploadNoticiaImage(file: File) {
  const supabase = getSupabaseClient()
  const filePath = buildStoragePath(file)

  const { error } = await supabase.storage.from(NOTICIAS_BUCKET).upload(filePath, file, {
    cacheControl: '3600',
    contentType: file.type || undefined,
    upsert: false,
  })

  if (error) {
    throw error
  }

  const { data } = supabase.storage.from(NOTICIAS_BUCKET).getPublicUrl(filePath)

  return {
    filePath,
    publicUrl: data.publicUrl,
  }
}

async function deleteNoticiaImageByPath(filePath: string) {
  const supabase = getSupabaseClient()
  const { error } = await supabase.storage.from(NOTICIAS_BUCKET).remove([filePath])

  if (error) {
    throw error
  }
}

export async function getNoticiasList({
  page,
  pageSize,
}: NoticiaListParams): Promise<NoticiaListResult> {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const supabase = getSupabaseClient()

  try {
    const { count, data, error } = await supabase
      .from('noticias')
      .select(NOTICIA_COLUMNS, { count: 'exact' })
      .order('fecha', { ascending: false })
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
      formatSupabaseErrorMessage(error, 'No se pudieron obtener las noticias desde Supabase.'),
    )
  }
}

export async function createNoticia(values: NoticiaFormValues): Promise<NoticiaRow> {
  if (!values.image) {
    throw new Error('La imagen es obligatoria para crear una noticia.')
  }

  const supabase = getSupabaseClient()
  const uploadedImage = await uploadNoticiaImage(values.image)

  try {
    const { data, error } = await supabase
      .from('noticias')
      .insert({
        titulo: values.titulo,
        descripcion: values.descripcion,
        fecha: values.fecha,
        imageUrl: uploadedImage.publicUrl,
      })
      .select(NOTICIA_COLUMNS)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    await deleteNoticiaImageByPath(uploadedImage.filePath).catch(() => undefined)

    throw new Error(
      formatSupabaseErrorMessage(error, 'No se pudo crear la noticia.'),
    )
  }
}

export async function updateNoticia(
  noticia: NoticiaRow,
  values: NoticiaFormValues,
): Promise<NoticiaRow> {
  const supabase = getSupabaseClient()
  let nextImageUrl = noticia.imageUrl
  let uploadedImage: Awaited<ReturnType<typeof uploadNoticiaImage>> | null = null

  try {
    if (values.image) {
      uploadedImage = await uploadNoticiaImage(values.image)
      nextImageUrl = uploadedImage.publicUrl
    }

    const { data, error } = await supabase
      .from('noticias')
      .update({
        titulo: values.titulo,
        descripcion: values.descripcion,
        fecha: values.fecha,
        imageUrl: nextImageUrl,
      })
      .eq('id', noticia.id)
      .select(NOTICIA_COLUMNS)
      .single()

    if (error) {
      throw error
    }

    if (uploadedImage) {
      const previousImagePath = getStoragePathFromPublicUrl(noticia.imageUrl)

      if (previousImagePath) {
        await deleteNoticiaImageByPath(previousImagePath).catch(() => undefined)
      }
    }

    return data
  } catch (error) {
    if (uploadedImage) {
      await deleteNoticiaImageByPath(uploadedImage.filePath).catch(() => undefined)
    }

    throw new Error(
      formatSupabaseErrorMessage(error, 'No se pudo actualizar la noticia.'),
    )
  }
}

export async function deleteNoticia(noticia: NoticiaRow): Promise<void> {
  const supabase = getSupabaseClient()

  try {
    const imagePath = getStoragePathFromPublicUrl(noticia.imageUrl)

    if (imagePath) {
      await deleteNoticiaImageByPath(imagePath)
    }

    const { error } = await supabase.from('noticias').delete().eq('id', noticia.id)

    if (error) {
      throw error
    }
  } catch (error) {
    throw new Error(
      formatSupabaseErrorMessage(error, 'No se pudo eliminar la noticia.'),
    )
  }
}
