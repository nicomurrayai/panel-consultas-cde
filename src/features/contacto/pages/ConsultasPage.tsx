import { ChevronDown, ListFilter, RefreshCcw, Search, X } from 'lucide-react'
import { ContactoCards } from '../components/ContactoCards'
import { ContactoDetailDialog } from '../components/ContactoDetailDialog'
import { ContactoTable } from '../components/ContactoTable'
import { DashboardStats } from '../components/DashboardStats'
import { PaginationControls } from '../components/PaginationControls'
import { useContactoDashboard } from '../hooks/useContactoDashboard'
import { CONTACTO_FILTER_STATUS_OPTIONS } from '../status'
import type { ContactoStatusFilter } from '../../../types/contacto'

export function ConsultasPage() {
  const {
    closeDetail,
    currentPage,
    deleteError,
    deleteLoading,
    deleteSelectedContacto,
    error,
    hasActiveStatusFilter,
    hasActiveSearch,
    isLoading,
    isSearchPending,
    openDetail,
    records,
    refreshAll,
    resultsCount,
    searchInput,
    selectedContacto,
    setCurrentPage,
    setSearchInput,
    setStatusFilter,
    statusFilter,
    statusUpdateError,
    statusUpdateLoading,
    stats,
    statsError,
    statsLoading,
    totalPages,
    updateSelectedContactoEstado,
  } = useContactoDashboard()

  const showEmptyState = !isLoading && !error && records.length === 0
  const hasActiveFilters = hasActiveSearch || hasActiveStatusFilter
  const selectedStatusLabel =
    CONTACTO_FILTER_STATUS_OPTIONS.find((option) => option.value === statusFilter)?.label ??
    'Todos los estados'
  const resultLabel = hasActiveFilters
    ? `${resultsCount} resultados`
    : `${resultsCount} consultas`

  return (
    <>
      <DashboardStats
        error={statsError}
        isLoading={statsLoading}
        resultCount={resultsCount}
        stats={stats}
      />

      <section className="overflow-hidden rounded-4xl border border-(--line) bg-white/94 shadow-[0_24px_60px_rgba(15,46,56,0.06)] backdrop-blur-sm">
        <div className="flex flex-col gap-4 border-b border-(--line) px-5 py-5 lg:flex-row lg:items-end lg:justify-between lg:px-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--brand-strong)">
              Consultas
            </p>
            <div>
              <h2 className="font-display text-3xl text-(--ink) sm:text-4xl">
                Mensajes recibidos
              </h2>
              <p className="mt-2 text-sm text-(--muted) sm:text-base">
                Busca por nombre o email y abre cada consulta para ver el detalle.
              </p>
            </div>
          </div>

          <div className="flex w-full max-w-xl flex-col gap-3 lg:w-auto lg:max-w-2xl">
            <label className="group flex w-full items-center gap-3 rounded-[1.4rem] border border-(--line) bg-(--background) px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition focus-within:border-(--brand) focus-within:shadow-[0_0_0_4px_rgba(37,150,190,0.12)] lg:w-md">
              <Search className="h-5 w-5 text-(--brand)" />
              <input
                className="w-full border-0 bg-transparent text-sm text-(--ink) outline-none placeholder:text-(--muted)"
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Buscar nombre o email"
                autoComplete="off"
                spellCheck={false}
              />
              {searchInput ? (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="rounded-full border border-(--line) p-1 text-(--muted) transition hover:border-(--brand) hover:text-(--brand)"
                  aria-label="Limpiar busqueda"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </label>

            <label className="group relative flex w-full items-center gap-3 rounded-[1.4rem] border border-(--line) bg-(--background) px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition focus-within:border-(--brand) focus-within:shadow-[0_0_0_4px_rgba(37,150,190,0.12)] lg:w-64">
              <ListFilter className="h-5 w-5 text-(--brand)" />
              <select
                className="w-full appearance-none border-0 bg-transparent pr-8 text-sm text-(--ink) outline-none"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as ContactoStatusFilter)}
                aria-label="Filtrar por estado"
              >
                {CONTACTO_FILTER_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-(--muted)" />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-b border-(--line) px-5 py-4 text-sm text-(--muted) sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <span>{resultLabel}</span>
            <span className="hidden h-1 w-1 rounded-full bg-(--brand) sm:block" />
            <span className="inline-flex items-center gap-2">
              Ordenadas por fecha
              {isSearchPending ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-(--surface-soft) px-2 py-1 text-xs font-medium text-(--brand-strong)">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-(--brand)" />
                  Buscando
                </span>
              ) : null}
            </span>
            {hasActiveStatusFilter ? (
              <>
                <span className="hidden h-1 w-1 rounded-full bg-(--brand) sm:block" />
                <span>Estado: {selectedStatusLabel}</span>
              </>
            ) : null}
          </div>

          <button
            type="button"
            onClick={refreshAll}
            className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-(--line) bg-white px-4 py-2 font-medium text-(--ink) transition hover:border-(--brand) hover:text-(--brand) disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
          >
            <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        <div className="px-5 py-5 lg:px-6 lg:py-6">
          {error ? (
            <ErrorState message={error} onRetry={refreshAll} />
          ) : isLoading ? (
            <LoadingState />
          ) : showEmptyState ? (
            <EmptyState hasActiveFilters={hasActiveFilters} />
          ) : (
            <>
              <ContactoTable contactos={records} onOpenDetail={openDetail} />
              <ContactoCards contactos={records} onOpenDetail={openDetail} />
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

      <ContactoDetailDialog
        contacto={selectedContacto}
        deleteError={deleteError}
        isDeleting={deleteLoading}
        isUpdatingStatus={statusUpdateLoading}
        onClose={closeDetail}
        onDelete={deleteSelectedContacto}
        onStatusChange={updateSelectedContactoEstado}
        statusUpdateError={statusUpdateError}
      />
    </>
  )
}

type EmptyStateProps = {
  hasActiveFilters: boolean
}

function EmptyState({ hasActiveFilters }: EmptyStateProps) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-(--line) bg-(--background) px-6 py-12 text-center">
      <div className="mx-auto max-w-xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--brand-strong)">
          Sin consultas
        </p>
        <h3 className="font-display text-3xl text-(--ink)">
          {hasActiveFilters ? 'No hay resultados.' : 'No hay consultas.'}
        </h3>
        <p className="text-sm leading-7 text-(--muted) sm:text-base">
          {hasActiveFilters
            ? 'Prueba con otro nombre, email o estado.'
            : 'Las nuevas consultas apareceran aqui.'}
        </p>
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
        <h3 className="font-display text-3xl text-(--ink)">No se pudieron cargar las consultas.</h3>
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
        <div className="grid grid-cols-[1.2fr_1fr_0.85fr_1.25fr_0.78fr_0.7fr_0.5fr] gap-3 border-b border-(--line) bg-(--surface-soft) px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-(--brand-strong)">
          <span>Nombre</span>
          <span>Email</span>
          <span>Telefono</span>
          <span>Mensaje</span>
          <span>Fecha</span>
          <span>Estado</span>
          <span>Accion</span>
        </div>
        <div className="divide-y divide-(--line)">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="grid animate-pulse grid-cols-[1.2fr_1fr_0.85fr_1.25fr_0.78fr_0.7fr_0.5fr] gap-3 px-5 py-4"
            >
              <div className="h-4 rounded-full bg-(--surface-strong)" />
              <div className="h-4 rounded-full bg-(--surface-strong)" />
              <div className="h-4 rounded-full bg-(--surface-strong)" />
              <div className="h-4 rounded-full bg-(--surface-strong)" />
              <div className="h-4 rounded-full bg-(--surface-strong)" />
              <div className="h-9 rounded-full bg-(--surface-strong)" />
              <div className="h-9 rounded-full bg-(--surface-strong)" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:hidden">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="animate-pulse space-y-4 rounded-3xl border border-(--line) bg-white p-5"
          >
            <div className="h-5 w-2/3 rounded-full bg-(--surface-strong)" />
            <div className="h-4 w-1/2 rounded-full bg-(--surface-strong)" />
            <div className="h-4 w-full rounded-full bg-(--surface-strong)" />
            <div className="h-4 w-4/5 rounded-full bg-(--surface-strong)" />
            <div className="h-10 rounded-full bg-(--surface-strong)" />
          </div>
        ))}
      </div>
    </div>
  )
}
