import { Pencil, Trash2 } from 'lucide-react'
import { formatDate } from '../../../lib/format'
import type { NoticiaRow } from '../../../types/noticia'

type NoticiasTableProps = {
  deletingId: number | null
  noticias: NoticiaRow[]
  onDelete: (noticia: NoticiaRow) => void
  onEdit: (noticia: NoticiaRow) => void
}

export function NoticiasTable({
  deletingId,
  noticias,
  onDelete,
  onEdit,
}: NoticiasTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-[1.6rem] border border-(--line) md:block">
      <div className="max-h-[68vh] overflow-auto bg-white">
        <table className="min-w-full border-separate border-spacing-0 text-left">
          <thead className="sticky top-0 z-10 bg-white/96 backdrop-blur-sm">
            <tr className="text-xs uppercase tracking-[0.18em] text-(--brand-strong)">
              <th scope="col" className="border-b border-(--line) px-5 py-4 font-semibold">
                Imagen
              </th>
              <th scope="col" className="border-b border-(--line) px-5 py-4 font-semibold">
                Titulo
              </th>
              <th scope="col" className="border-b border-(--line) px-5 py-4 font-semibold">
                Fecha
              </th>
              <th scope="col" className="border-b border-(--line) px-5 py-4 font-semibold">
                Descripcion
              </th>
              <th scope="col" className="border-b border-(--line) px-5 py-4 font-semibold">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {noticias.map((noticia) => (
              <tr key={noticia.id} className="transition hover:bg-(--surface-soft)">
                <td className="border-b border-(--line) px-5 py-4 align-top">
                  <img
                    alt={noticia.titulo}
                    className="h-16 w-24 rounded-2xl object-cover"
                    src={noticia.imageUrl}
                  />
                </td>
                <td className="border-b border-(--line) px-5 py-4 align-top">
                  <p className="font-medium text-(--ink)">{noticia.titulo}</p>
                </td>
                <td className="border-b border-(--line) px-5 py-4 align-top text-sm text-(--ink)">
                  {formatDate(noticia.fecha)}
                </td>
                <td className="border-b border-(--line) px-5 py-4 align-top">
                  <p className="text-truncate-2 max-w-[30rem] text-sm leading-6 text-(--muted)">
                    {noticia.descripcion}
                  </p>
                </td>
                <td className="border-b border-(--line) px-5 py-4 align-top">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(noticia)}
                      className="inline-flex items-center gap-2 rounded-full border border-(--line) bg-white px-3 py-2 text-sm font-medium text-(--ink) transition hover:border-(--brand) hover:text-(--brand)"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(noticia)}
                      disabled={deletingId === noticia.id}
                      className="inline-flex items-center gap-2 rounded-full bg-[rgb(220,38,38)] px-3 py-2 text-sm font-medium text-white transition hover:bg-[rgb(185,28,28)] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingId === noticia.id ? 'Eliminando' : 'Eliminar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
