import { Eye } from 'lucide-react'
import { formatShortDateTime } from '../../../lib/format'
import type { ContactoRow } from '../../../types/contacto'

type ContactoTableProps = {
  contactos: ContactoRow[]
  onOpenDetail: (contacto: ContactoRow) => void
}

export function ContactoTable({ contactos, onOpenDetail }: ContactoTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-[1.6rem] border border-[var(--line)] md:block">
      <div className="max-h-[65vh] overflow-auto bg-white">
        <table className="min-w-full border-separate border-spacing-0 text-left">
          <thead className="sticky top-0 z-10 bg-white/96 backdrop-blur-sm">
            <tr className="text-xs uppercase tracking-[0.18em] text-[var(--brand-strong)]">
              <th scope="col" className="border-b border-[var(--line)] px-5 py-4 font-semibold">
                Nombre completo
              </th>
              <th scope="col" className="border-b border-[var(--line)] px-5 py-4 font-semibold">
                Email
              </th>
              <th scope="col" className="border-b border-[var(--line)] px-5 py-4 font-semibold">
                Telefono
              </th>
              <th scope="col" className="border-b border-[var(--line)] px-5 py-4 font-semibold">
                Mensaje
              </th>
              <th scope="col" className="border-b border-[var(--line)] px-5 py-4 font-semibold">
                Fecha de envio
              </th>
              <th scope="col" className="border-b border-[var(--line)] px-5 py-4 font-semibold">
                Ver
              </th>
            </tr>
          </thead>

          <tbody>
            {contactos.map((contacto) => (
              <tr
                key={contacto.id}
                onClick={() => onOpenDetail(contacto)}
                className="cursor-pointer transition hover:bg-[var(--surface-soft)]"
              >
                <td className="border-b border-[var(--line)] px-5 py-4 align-top">
                  <div className="space-y-1">
                    <p className="font-medium text-[var(--ink)]">{contacto.nombrecompleto}</p>
                    <p className="text-sm text-[var(--muted)]">ID #{contacto.id}</p>
                  </div>
                </td>

                <td className="border-b border-[var(--line)] px-5 py-4 align-top text-sm text-[var(--ink)]">
                  {contacto.email}
                </td>

                <td className="border-b border-[var(--line)] px-5 py-4 align-top text-sm text-[var(--ink)]">
                  {contacto.telefono}
                </td>

                <td className="border-b border-[var(--line)] px-5 py-4 align-top">
                  <p className="text-truncate-2 max-w-[26rem] text-sm leading-6 text-[var(--muted)]">
                    {contacto.mensaje}
                  </p>
                </td>

                <td className="border-b border-[var(--line)] px-5 py-4 align-top text-sm text-[var(--ink)]">
                  {formatShortDateTime(contacto.created_at)}
                </td>

                <td className="border-b border-[var(--line)] px-5 py-4 align-top">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      onOpenDetail(contacto)
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-3 py-2 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                  >
                    <Eye className="h-4 w-4" />
                    Abrir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}