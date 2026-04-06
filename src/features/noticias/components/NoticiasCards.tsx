import { Pencil, Trash2 } from 'lucide-react'
import { formatDate } from '../../../lib/format'
import type { NoticiaRow } from '../../../types/noticia'

type NoticiasCardsProps = {
  deletingId: number | null
  noticias: NoticiaRow[]
  onDelete: (noticia: NoticiaRow) => void
  onEdit: (noticia: NoticiaRow) => void
}

export function NoticiasCards({
  deletingId,
  noticias,
  onDelete,
  onEdit,
}: NoticiasCardsProps) {
  return (
    <div className="grid gap-4 md:hidden">
      {noticias.map((noticia) => (
        <article
          key={noticia.id}
          className="overflow-hidden rounded-[1.6rem] border border-(--line) bg-white shadow-[0_18px_44px_rgba(15,46,56,0.05)]"
        >
          <img alt={noticia.titulo} className="h-48 w-full object-cover" src={noticia.imageUrl} />

          <div className="space-y-4 p-5">
            <div className="space-y-1">
              <p className="text-sm font-medium text-(--brand-strong)">{formatDate(noticia.fecha)}</p>
              <h3 className="font-medium text-(--ink)">{noticia.titulo}</h3>
            </div>

            <p className="text-sm leading-6 text-(--muted)">{noticia.descripcion}</p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onEdit(noticia)}
                className="inline-flex items-center gap-2 rounded-full border border-(--line) bg-white px-4 py-2 text-sm font-medium text-(--ink) transition hover:border-(--brand) hover:text-(--brand)"
              >
                <Pencil className="h-4 w-4" />
                Editar
              </button>
              <button
                type="button"
                onClick={() => onDelete(noticia)}
                disabled={deletingId === noticia.id}
                className="inline-flex items-center gap-2 rounded-full bg-[rgb(220,38,38)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[rgb(185,28,28)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Trash2 className="h-4 w-4" />
                {deletingId === noticia.id ? 'Eliminando' : 'Eliminar'}
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
