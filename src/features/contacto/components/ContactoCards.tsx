import { Eye } from 'lucide-react'
import { ContactoStatusBadge } from './ContactoStatusBadge'
import { formatShortDateTime } from '../../../lib/format'
import type { ContactoRow } from '../../../types/contacto'

type ContactoCardsProps = {
  contactos: ContactoRow[]
  onOpenDetail: (contacto: ContactoRow) => void
}

export function ContactoCards({ contactos, onOpenDetail }: ContactoCardsProps) {
  return (
    <div className="grid gap-4 md:hidden">
      {contactos.map((contacto) => (
        <article
          key={contacto.id}
          onClick={() => onOpenDetail(contacto)}
          className="rounded-[1.6rem] border border-[var(--line)] bg-white p-5 shadow-[0_18px_44px_rgba(15,46,56,0.05)] transition hover:border-[var(--brand)]"
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="font-medium text-[var(--ink)]">{contacto.nombrecompleto}</p>
              <p className="text-sm text-[var(--muted)]">{contacto.email}</p>
              <p className="text-sm text-[var(--muted)]">{contacto.telefono}</p>
            </div>

            <p className="text-truncate-2 text-sm leading-6 text-[var(--muted)]">{contacto.mensaje}</p>

            <div className="flex items-center justify-between gap-3">
              <div className="space-y-2">
                <p className="text-sm font-medium text-[var(--ink)]">
                  {formatShortDateTime(contacto.created_at)}
                </p>
                <ContactoStatusBadge estado={contacto.estado} />
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onOpenDetail(contacto)
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--brand-strong)]"
              >
                <Eye className="h-4 w-4" />
                Abrir
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}