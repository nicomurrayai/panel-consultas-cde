import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationControlsProps = {
  currentPage: number
  onPageChange: (nextPage: number) => void
  totalItems: number
  totalPages: number
}

export function PaginationControls({
  currentPage,
  onPageChange,
  totalItems,
  totalPages,
}: PaginationControlsProps) {
  if (totalItems === 0) {
    return null
  }

  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-[var(--line)] pt-5 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
      <p>
        Pagina {currentPage} de {totalPages}
      </p>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 py-2 font-medium text-[var(--ink)] transition hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </button>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-4 py-2 font-medium text-white transition hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}