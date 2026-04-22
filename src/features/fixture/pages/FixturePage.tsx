import { ChevronDown, CirclePlus, ListFilter, RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import type {
  FixtureFormValues,
  FixtureRow,
  FixtureSeasonFilter,
  FixtureStatusFilter,
} from '../../../types/fixture'
import { PaginationControls } from '../../contacto/components/PaginationControls'
import { FixtureCards } from '../components/FixtureCards'
import { FixtureFormDialog } from '../components/FixtureFormDialog'
import { FixtureTable } from '../components/FixtureTable'
import { useFixtureDashboard } from '../hooks/useFixtureDashboard'
import { FIXTURE_FILTER_STATUS_OPTIONS } from '../status'

type DialogState =
  | {
      fixture: null
      mode: 'create'
    }
  | {
      fixture: FixtureRow
      mode: 'edit'
    }
  | null

export function FixturePage() {
  const {
    clearFeedback,
    createFixture,
    currentPage,
    deleteError,
    deleteFixture,
    deletingId,
    error,
    hasActiveSeasonFilter,
    hasActiveStatusFilter,
    isFilterLoading,
    isLoading,
    isSubmitting,
    records,
    refreshAll,
    resultsCount,
    saveError,
    seasonFilter,
    seasonOptions,
    seasonOptionsError,
    setCurrentPage,
    setSeasonFilter,
    setStatusFilter,
    statusFilter,
    totalPages,
    updateFixture,
  } = useFixtureDashboard()
  const [dialogState, setDialogState] = useState<DialogState>(null)

  const showEmptyState = !isLoading && !error && records.length === 0
  const hasActiveFilters = hasActiveSeasonFilter || hasActiveStatusFilter
  const selectedStatusLabel =
    FIXTURE_FILTER_STATUS_OPTIONS.find((option) => option.value === statusFilter)?.label ??
    'Todos los estados'
  const selectedSeasonLabel =
    seasonFilter === 'all' ? 'Todas las temporadas' : `Temporada ${seasonFilter}`
  const resultLabel = hasActiveFilters
    ? `${resultsCount} resultados`
    : `${resultsCount} partidos`

  function openCreateDialog() {
    clearFeedback()
    setDialogState({
      fixture: null,
      mode: 'create',
    })
  }

  function openEditDialog(fixture: FixtureRow) {
    clearFeedback()
    setDialogState({
      fixture,
      mode: 'edit',
    })
  }

  function closeDialog() {
    clearFeedback()
    setDialogState(null)
  }

  async function handleDelete(fixture: FixtureRow) {
    if (
      typeof window !== 'undefined' &&
      !window.confirm(
        `Esta accion eliminara el partido contra ${fixture.rival} de forma irreversible. Deseas continuar?`,
      )
    ) {
      return
    }

    await deleteFixture(fixture)
  }

  async function handleSubmit(values: FixtureFormValues) {
    if (dialogState?.mode === 'edit' && dialogState.fixture) {
      const success = await updateFixture(dialogState.fixture, values)

      if (success) {
        closeDialog()
      }

      return
    }

    const success = await createFixture(values)

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
              Fixture
            </p>
            <div>
              <h2 className="font-display text-3xl text-(--ink) sm:text-4xl">
                Gestion de partidos
              </h2>
              <p className="mt-2 text-sm text-(--muted) sm:text-base">
                Organiza el fixture por temporada, estado y fecha del encuentro.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={refreshAll}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-(--line) bg-white px-4 py-2 font-medium text-(--ink) transition hover:border-(--brand) hover:text-(--brand) disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading || isFilterLoading}
            >
              <RefreshCcw
                className={`h-4 w-4 ${isLoading || isFilterLoading ? 'animate-spin' : ''}`}
              />
              Actualizar
            </button>

            <button
              type="button"
              onClick={openCreateDialog}
              className="inline-flex items-center gap-2 rounded-full bg-(--brand) px-5 py-3 font-medium text-white transition hover:bg-(--brand-strong)"
            >
              <CirclePlus className="h-4 w-4" />
              Nuevo partido
            </button>
          </div>
        </div>

        <div className="grid gap-3 border-b border-(--line) px-5 py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:px-6">
          <div className="flex flex-wrap items-center gap-3 text-sm text-(--muted)">
            <span>{resultLabel}</span>
            <span className="hidden h-1 w-1 rounded-full bg-(--brand) sm:block" />
            <span>Ordenados por fecha ascendente</span>
            {hasActiveSeasonFilter ? (
              <>
                <span className="hidden h-1 w-1 rounded-full bg-(--brand) sm:block" />
                <span>{selectedSeasonLabel}</span>
              </>
            ) : null}
            {hasActiveStatusFilter ? (
              <>
                <span className="hidden h-1 w-1 rounded-full bg-(--brand) sm:block" />
                <span>Estado: {selectedStatusLabel}</span>
              </>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="group relative flex min-w-0 items-center gap-3 rounded-[1.4rem] border border-(--line) bg-(--background) px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition focus-within:border-(--brand) focus-within:shadow-[0_0_0_4px_rgba(37,150,190,0.12)]">
              <ListFilter className="h-5 w-5 text-(--brand)" />
              <select
                className="w-full appearance-none border-0 bg-transparent pr-8 text-sm text-(--ink) outline-none"
                value={seasonFilter}
                onChange={(event) =>
                  setSeasonFilter(
                    event.target.value === 'all'
                      ? 'all'
                      : (Number.parseInt(event.target.value, 10) as FixtureSeasonFilter),
                  )
                }
                aria-label="Filtrar por temporada"
              >
                <option value="all">Todas las temporadas</option>
                {seasonOptions.map((season) => (
                  <option key={season} value={season}>
                    Temporada {season}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-(--muted)" />
            </label>

            <label className="group relative flex min-w-0 items-center gap-3 rounded-[1.4rem] border border-(--line) bg-(--background) px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition focus-within:border-(--brand) focus-within:shadow-[0_0_0_4px_rgba(37,150,190,0.12)]">
              <ListFilter className="h-5 w-5 text-(--brand)" />
              <select
                className="w-full appearance-none border-0 bg-transparent pr-8 text-sm text-(--ink) outline-none"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as FixtureStatusFilter)
                }
                aria-label="Filtrar por estado"
              >
                {FIXTURE_FILTER_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-(--muted)" />
            </label>
          </div>
        </div>

        <div className="px-5 py-5 lg:px-6 lg:py-6">
          {seasonOptionsError ? (
            <p className="mb-5 rounded-[1rem] border border-[rgba(37,150,190,0.18)] bg-[rgba(37,150,190,0.08)] px-4 py-3 text-sm text-(--brand-strong)">
              {seasonOptionsError}
            </p>
          ) : null}

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
            <EmptyState hasActiveFilters={hasActiveFilters} onCreate={openCreateDialog} />
          ) : (
            <>
              <FixtureTable
                deletingId={deletingId}
                fixtures={records}
                onDelete={handleDelete}
                onEdit={openEditDialog}
              />
              <FixtureCards
                deletingId={deletingId}
                fixtures={records}
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

      {dialogState ? (
        <FixtureFormDialog
          key={
            dialogState.mode === 'edit'
              ? `edit-${dialogState.fixture.id}`
              : 'create-fixture'
          }
          errorMessage={saveError}
          fixture={dialogState.fixture}
          isOpen
          isSaving={isSubmitting}
          mode={dialogState.mode}
          onClose={closeDialog}
          onSubmit={handleSubmit}
        />
      ) : null}
    </>
  )
}

type EmptyStateProps = {
  hasActiveFilters: boolean
  onCreate: () => void
}

function EmptyState({ hasActiveFilters, onCreate }: EmptyStateProps) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-(--line) bg-(--background) px-6 py-12 text-center">
      <div className="mx-auto max-w-xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--brand-strong)">
          Sin partidos
        </p>
        <h3 className="font-display text-3xl text-(--ink)">
          {hasActiveFilters ? 'No hay resultados para esos filtros.' : 'Todavia no hay partidos cargados.'}
        </h3>
        <p className="text-sm leading-7 text-(--muted) sm:text-base">
          {hasActiveFilters
            ? 'Prueba con otra temporada o con un estado diferente.'
            : 'Crea el primer partido para empezar a ordenar el fixture.'}
        </p>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center gap-2 rounded-full bg-(--brand) px-5 py-3 font-medium text-white transition hover:bg-(--brand-strong)"
        >
          <CirclePlus className="h-4 w-4" />
          Crear partido
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
        <h3 className="font-display text-3xl text-(--ink)">No se pudo cargar el fixture.</h3>
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
        <div className="grid grid-cols-[1.2fr_0.95fr_0.55fr_0.8fr_0.95fr_0.9fr_0.95fr] gap-3 border-b border-(--line) bg-(--surface-soft) px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-(--brand-strong)">
          <span>Fecha</span>
          <span>Rival</span>
          <span>Temp.</span>
          <span>Condicion</span>
          <span>Torneo</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>
        <div className="divide-y divide-(--line)">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="grid animate-pulse grid-cols-[1.2fr_0.95fr_0.55fr_0.8fr_0.95fr_0.9fr_0.95fr] gap-3 px-5 py-4"
            >
              <div className="h-4 rounded-full bg-(--surface-strong)" />
              <div className="h-4 rounded-full bg-(--surface-strong)" />
              <div className="h-4 rounded-full bg-(--surface-strong)" />
              <div className="h-9 rounded-full bg-(--surface-strong)" />
              <div className="h-4 rounded-full bg-(--surface-strong)" />
              <div className="h-9 rounded-full bg-(--surface-strong)" />
              <div className="h-10 rounded-full bg-(--surface-strong)" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:hidden">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="space-y-4 rounded-3xl border border-(--line) bg-white p-5"
          >
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-(--surface-strong)" />
            <div className="h-6 w-1/2 animate-pulse rounded-full bg-(--surface-strong)" />
            <div className="flex gap-2">
              <div className="h-8 w-24 animate-pulse rounded-full bg-(--surface-strong)" />
              <div className="h-8 w-24 animate-pulse rounded-full bg-(--surface-strong)" />
            </div>
            <div className="h-20 animate-pulse rounded-[1.2rem] bg-(--surface-strong)" />
            <div className="h-10 animate-pulse rounded-full bg-(--surface-strong)" />
          </div>
        ))}
      </div>
    </div>
  )
}
