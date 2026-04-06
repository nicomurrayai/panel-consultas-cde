import { CirclePlus, RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import { NoticiasCards } from '../components/NoticiasCards'
import { NoticiaFormDialog } from '../components/NoticiaFormDialog'
import { NoticiasTable } from '../components/NoticiasTable'
import { useNoticiasDashboard } from '../hooks/useNoticiasDashboard'
import { PaginationControls } from '../../contacto/components/PaginationControls'
import type { NoticiaFormValues, NoticiaRow } from '../../../types/noticia'

type DialogState =
  | {
      mode: 'create'
      noticia: null
    }
  | {
      mode: 'edit'
      noticia: NoticiaRow
    }
  | null

export function NoticiasPage() {
  const {
    clearFeedback,
    createNoticia,
    currentPage,
    deleteError,
    deleteNoticia,
    deletingId,
    error,
    isLoading,
    isSubmitting,
    records,
    refreshAll,
    resultsCount,
    saveError,
    setCurrentPage,
    totalPages,
    updateNoticia,
  } = useNoticiasDashboard()
  const [dialogState, setDialogState] = useState<DialogState>(null)

  const showEmptyState = !isLoading && !error && records.length === 0

  function openCreateDialog() {
    clearFeedback()
    setDialogState({
      mode: 'create',
      noticia: null,
    })
  }

  function openEditDialog(noticia: NoticiaRow) {
    clearFeedback()
    setDialogState({
      mode: 'edit',
      noticia,
    })
  }

  function closeDialog() {
    clearFeedback()
    setDialogState(null)
  }

  async function handleDelete(noticia: NoticiaRow) {
    if (
      typeof window !== 'undefined' &&
      !window.confirm('Esta accion eliminara la noticia y su imagen de forma irreversible. Deseas continuar?')
    ) {
      return
    }

    await deleteNoticia(noticia)
  }

  async function handleSubmit(values: NoticiaFormValues) {
    if (dialogState?.mode === 'edit' && dialogState.noticia) {
      const success = await updateNoticia(dialogState.noticia, values)

      if (success) {
        closeDialog()
      }

      return
    }

    const success = await createNoticia(values)

    if (success) {
      closeDialog()
    }
  }

  return (
    <>
      <section className="overflow-hidden rounded-4xl border border-(--line) bg-white/94 shadow-[0_24px_60px_rgba(15,46,56,0.06)] backdrop-blur-sm">
        <div className="flex flex-col gap-4 border-b border-(--line) px-5 py-5 lg:flex-row lg:items-end lg:justify-between lg:px-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--brand-strong)">
              Noticias
            </p>
            <div>
              <h2 className="font-display text-3xl text-(--ink) sm:text-4xl">Gestion de noticias</h2>
              <p className="mt-2 text-sm text-(--muted) sm:text-base">
                Administra el contenido que luego consumira la web externa.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={refreshAll}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-(--line) bg-white px-4 py-2 font-medium text-(--ink) transition hover:border-(--brand) hover:text-(--brand) disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading}
            >
              <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>

            <button
              type="button"
              onClick={openCreateDialog}
              className="inline-flex items-center gap-2 rounded-full bg-(--brand) px-5 py-3 font-medium text-white transition hover:bg-(--brand-strong)"
            >
              <CirclePlus className="h-4 w-4" />
              Nueva noticia
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-(--line) px-5 py-4 text-sm text-(--muted) lg:px-6">
          <span>{resultsCount} noticias</span>
          <span className="hidden h-1 w-1 rounded-full bg-(--brand) sm:block" />
          <span>Ordenadas por fecha</span>
        </div>

        <div className="px-5 py-5 lg:px-6 lg:py-6">
          {deleteError ? (
            <p className="mb-5 rounded-[1rem] border border-[rgba(220,38,38,0.18)] bg-[rgba(254,242,242,0.82)] px-4 py-3 text-sm text-[rgb(127,29,29)]">
              {deleteError}
            </p>
          ) : null}

          {error ? (
            <ErrorState message={error} onRetry={refreshAll} />
          ) : isLoading ? (
            <LoadingState />
          ) : showEmptyState ? (
            <EmptyState onCreate={openCreateDialog} />
          ) : (
            <>
              <NoticiasTable
                deletingId={deletingId}
                noticias={records}
                onDelete={handleDelete}
                onEdit={openEditDialog}
              />
              <NoticiasCards
                deletingId={deletingId}
                noticias={records}
                onDelete={handleDelete}
                onEdit={openEditDialog}
              />
              <PaginationControls
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                totalItems={resultsCount}
                totalPages={totalPages}
              />
            </>
          )}
        </div>
      </section>

      <NoticiaFormDialog
        errorMessage={saveError}
        isOpen={dialogState !== null}
        isSaving={isSubmitting}
        mode={dialogState?.mode ?? 'create'}
        noticia={dialogState?.noticia ?? null}
        onClose={closeDialog}
        onSubmit={handleSubmit}
      />
    </>
  )
}

type EmptyStateProps = {
  onCreate: () => void
}

function EmptyState({ onCreate }: EmptyStateProps) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-(--line) bg-(--background) px-6 py-12 text-center">
      <div className="mx-auto max-w-xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--brand-strong)">
          Sin noticias
        </p>
        <h3 className="font-display text-3xl text-(--ink)">Todavia no hay noticias cargadas.</h3>
        <p className="text-sm leading-7 text-(--muted) sm:text-base">
          Crea la primera noticia para que quede disponible desde la web externa.
        </p>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center gap-2 rounded-full bg-(--brand) px-5 py-3 font-medium text-white transition hover:bg-(--brand-strong)"
        >
          <CirclePlus className="h-4 w-4" />
          Crear noticia
        </button>
      </div>
    </div>
  )
}

type ErrorStateProps = {
  message: string
  onRetry: () => void
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  const helperText = message.includes('VITE_SUPABASE')
    ? 'Falta completar la configuracion del panel.'
    : 'Intenta nuevamente en unos segundos.'

  return (
    <div className="rounded-[1.75rem] border border-[rgba(37,150,190,0.24)] bg-[rgba(37,150,190,0.07)] px-6 py-10">
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--brand-strong)">
          No disponible
        </p>
        <h3 className="font-display text-3xl text-(--ink)">No se pudieron cargar las noticias.</h3>
        <p className="text-sm leading-7 text-(--muted) sm:text-base">{helperText}</p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-full bg-(--brand) px-5 py-3 font-medium text-white transition hover:bg-(--brand-strong)"
        >
          <RefreshCcw className="h-4 w-4" />
          Reintentar
        </button>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="hidden overflow-hidden rounded-3xl border border-(--line) md:block">
        <div className="grid grid-cols-[0.75fr_1fr_0.7fr_1.5fr_0.9fr] gap-3 border-b border-(--line) bg-(--surface-soft) px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-(--brand-strong)">
          <span>Imagen</span>
          <span>Titulo</span>
          <span>Fecha</span>
          <span>Descripcion</span>
          <span>Acciones</span>
        </div>
        <div className="divide-y divide-(--line)">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="grid animate-pulse grid-cols-[0.75fr_1fr_0.7fr_1.5fr_0.9fr] gap-3 px-5 py-4"
            >
              <div className="h-16 rounded-2xl bg-(--surface-strong)" />
              <div className="h-4 rounded-full bg-(--surface-strong)" />
              <div className="h-4 rounded-full bg-(--surface-strong)" />
              <div className="h-4 rounded-full bg-(--surface-strong)" />
              <div className="h-10 rounded-full bg-(--surface-strong)" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:hidden">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-(--line) bg-white"
          >
            <div className="h-48 animate-pulse bg-(--surface-strong)" />
            <div className="space-y-4 p-5">
              <div className="h-4 w-1/3 animate-pulse rounded-full bg-(--surface-strong)" />
              <div className="h-5 w-2/3 animate-pulse rounded-full bg-(--surface-strong)" />
              <div className="h-4 w-full animate-pulse rounded-full bg-(--surface-strong)" />
              <div className="h-10 animate-pulse rounded-full bg-(--surface-strong)" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
