import { ImagePlus, LoaderCircle, Upload, X } from 'lucide-react'
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import type { NoticiaFormValues, NoticiaRow } from '../../../types/noticia'

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

type NoticiaFormDialogProps = {
  errorMessage: string | null
  isOpen: boolean
  isSaving: boolean
  mode: 'create' | 'edit'
  noticia: NoticiaRow | null
  onClose: () => void
  onSubmit: (values: NoticiaFormValues) => Promise<void> | void
}

export function NoticiaFormDialog({
  errorMessage,
  isOpen,
  isSaving,
  mode,
  noticia,
  onClose,
  onSubmit,
}: NoticiaFormDialogProps) {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fecha, setFecha] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setTitulo(noticia?.titulo ?? '')
    setDescripcion(noticia?.descripcion ?? '')
    setFecha(noticia?.fecha ?? '')
    setImage(null)
    setLocalError(null)
    setPreviewUrl(noticia?.imageUrl ?? null)
  }, [isOpen, noticia])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!image) {
      return undefined
    }

    const objectUrl = URL.createObjectURL(image)
    setPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [image])

  if (!isOpen || typeof document === 'undefined') {
    return null
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null

    if (!file) {
      setImage(null)
      setPreviewUrl(noticia?.imageUrl ?? null)
      return
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setLocalError('La imagen debe estar en formato JPG, PNG o WEBP.')
      event.target.value = ''
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setLocalError('La imagen no puede superar los 5 MB.')
      event.target.value = ''
      return
    }

    setLocalError(null)
    setImage(file)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedTitulo = titulo.trim()
    const trimmedDescripcion = descripcion.trim()

    if (!trimmedTitulo || !trimmedDescripcion || !fecha) {
      setLocalError('Completa titulo, descripcion y fecha antes de guardar.')
      return
    }

    if (mode === 'create' && !image) {
      setLocalError('Debes seleccionar una imagen para crear la noticia.')
      return
    }

    setLocalError(null)

    await onSubmit({
      titulo: trimmedTitulo,
      descripcion: trimmedDescripcion,
      fecha,
      image,
    })
  }

  const title = mode === 'create' ? 'Nueva noticia' : 'Editar noticia'
  const description =
    mode === 'create'
      ? 'Carga una noticia con fecha manual e imagen unica.'
      : 'Actualiza el contenido, la fecha o reemplaza la imagen.'

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[rgba(7,26,34,0.44)] p-3 backdrop-blur-sm md:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="noticia-form-title"
        className="my-auto flex w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-(--line) bg-white shadow-[0_32px_80px_rgba(7,26,34,0.26)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-(--line) px-5 py-5 md:px-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--brand-strong)">
              Noticias
            </p>
            <div>
              <h3 id="noticia-form-title" className="font-display text-3xl text-(--ink)">
                {title}
              </h3>
              <p className="mt-2 text-sm text-(--muted)">{description}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-(--line) p-2 text-(--muted) transition hover:border-(--brand) hover:text-(--brand)"
            aria-label="Cerrar formulario"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-5 px-5 py-5 md:px-6 md:py-6" onSubmit={handleSubmit}>
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-(--ink)">Titulo</span>
                <input
                  className="w-full rounded-[1.2rem] border border-(--line) bg-(--background) px-4 py-3 text-sm text-(--ink) outline-none transition focus:border-(--brand) focus:shadow-[0_0_0_4px_rgba(37,150,190,0.12)]"
                  onChange={(event) => setTitulo(event.target.value)}
                  placeholder="Ej. Asamblea extraordinaria"
                  value={titulo}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-(--ink)">Descripcion</span>
                <textarea
                  className="min-h-40 w-full rounded-[1.2rem] border border-(--line) bg-(--background) px-4 py-3 text-sm leading-6 text-(--ink) outline-none transition focus:border-(--brand) focus:shadow-[0_0_0_4px_rgba(37,150,190,0.12)]"
                  onChange={(event) => setDescripcion(event.target.value)}
                  placeholder="Describe el contenido que vera la web externa."
                  value={descripcion}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-(--ink)">Fecha</span>
                <input
                  className="w-full rounded-[1.2rem] border border-(--line) bg-(--background) px-4 py-3 text-sm text-(--ink) outline-none transition focus:border-(--brand) focus:shadow-[0_0_0_4px_rgba(37,150,190,0.12)]"
                  onChange={(event) => setFecha(event.target.value)}
                  type="date"
                  value={fecha}
                />
              </label>
            </div>

            <div className="space-y-4">
              <div className="overflow-hidden rounded-[1.6rem] border border-dashed border-(--line) bg-(--background)">
                {previewUrl ? (
                  <img alt="Vista previa de la noticia" className="h-64 w-full object-cover" src={previewUrl} />
                ) : (
                  <div className="flex h-64 flex-col items-center justify-center gap-3 px-6 text-center text-(--muted)">
                    <ImagePlus className="h-10 w-10 text-(--brand)" />
                    <p className="text-sm leading-6">
                      Selecciona una imagen para la noticia. Solo se permite una imagen por registro.
                    </p>
                  </div>
                )}
              </div>

              <label className="flex cursor-pointer flex-col gap-3 rounded-[1.4rem] border border-(--line) bg-white p-4 transition hover:border-(--brand)">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-(--ink)">
                  <Upload className="h-4 w-4 text-(--brand)" />
                  {mode === 'create' ? 'Subir imagen' : 'Reemplazar imagen'}
                </span>
                <span className="text-sm leading-6 text-(--muted)">
                  JPG, PNG o WEBP. Tamaño maximo: 5 MB.
                </span>
                {image ? (
                  <span className="text-sm font-medium text-(--brand-strong)">{image.name}</span>
                ) : noticia?.imageUrl ? (
                  <span className="text-sm text-(--muted)">Se conserva la imagen actual.</span>
                ) : null}
                <input
                  accept={ACCEPTED_IMAGE_TYPES.join(',')}
                  className="hidden"
                  onChange={handleImageChange}
                  type="file"
                />
              </label>
            </div>
          </div>

          {localError ? (
            <p className="rounded-[1rem] border border-[rgba(220,38,38,0.18)] bg-[rgba(254,242,242,0.82)] px-4 py-3 text-sm text-[rgb(127,29,29)]">
              {localError}
            </p>
          ) : null}

          {errorMessage ? (
            <p className="rounded-[1rem] border border-[rgba(220,38,38,0.18)] bg-[rgba(254,242,242,0.82)] px-4 py-3 text-sm text-[rgb(127,29,29)]">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-3 border-t border-(--line) pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-(--line) bg-white px-5 py-3 text-sm font-medium text-(--ink) transition hover:border-(--brand) hover:text-(--brand)"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-full bg-(--brand) px-5 py-3 text-sm font-medium text-white transition hover:bg-(--brand-strong) disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {mode === 'create' ? 'Crear noticia' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
