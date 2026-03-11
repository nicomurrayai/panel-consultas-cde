import { CalendarDays, Mail, Phone, X } from 'lucide-react'
import { useEffect } from 'react'
import { formatDateTime } from '../../../lib/format'
import type { ContactoRow } from '../../../types/contacto'

type ContactoDetailDialogProps = {
  contacto: ContactoRow | null
  onClose: () => void
}

export function ContactoDetailDialog({
  contacto,
  onClose,
}: ContactoDetailDialogProps) {
  useEffect(() => {
    if (!contacto) {
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
  }, [contacto, onClose])

  if (!contacto) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-[rgba(7,26,34,0.44)] p-3 backdrop-blur-sm md:flex md:items-center md:justify-center md:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contacto-detail-title"
        className="ml-auto flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-[var(--line)] bg-white shadow-[0_32px_80px_rgba(7,26,34,0.26)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] px-5 py-5 md:px-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-strong)]">
              Consulta
            </p>
            <h3 id="contacto-detail-title" className="font-display text-3xl text-[var(--ink)]">
              {contacto.nombrecompleto}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--line)] p-2 text-[var(--muted)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
            aria-label="Cerrar detalle"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 md:px-6 md:py-6">
          <div className="grid gap-3 md:grid-cols-3">
            <DetailMetaCard icon={Mail} label="Email" value={contacto.email} href={`mailto:${contacto.email}`} />
            <DetailMetaCard icon={Phone} label="Telefono" value={contacto.telefono} href={`tel:${contacto.telefono}`} />
            <DetailMetaCard
              icon={CalendarDays}
              label="Fecha de envio"
              value={formatDateTime(contacto.created_at)}
            />
          </div>

          <section className="mt-5 rounded-[1.6rem] border border-[var(--line)] bg-[var(--background)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-strong)]">
              Mensaje
            </p>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[var(--ink)] md:text-base">
              {contacto.mensaje}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

type DetailMetaCardProps = {
  href?: string
  icon: typeof Mail
  label: string
  value: string
}

function DetailMetaCard({ href, icon: Icon, label, value }: DetailMetaCardProps) {
  const content = href ? (
    <a href={href} className="break-all text-sm font-medium text-[var(--ink)] hover:text-[var(--brand)]">
      {value}
    </a>
  ) : (
    <p className="text-sm font-medium text-[var(--ink)]">{value}</p>
  )

  return (
    <div className="rounded-[1.35rem] border border-[var(--line)] bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-[var(--surface-soft)] p-2 text-[var(--brand)]">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-strong)]">
            {label}
          </p>
          {content}
        </div>
      </div>
    </div>
  )
}