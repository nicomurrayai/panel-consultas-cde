import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Mail,
  Phone,
  Trash2,
  X,
} from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ContactoStatusBadge } from './ContactoStatusBadge'
import { formatDateTime, formatWhatsAppLink } from '../../../lib/format'
import type { ContactoRow } from '../../../types/contacto'
import {
  CONTACTO_EDITABLE_STATUS_OPTIONS,
  normalizeContactoEstado,
  type EditableContactoEstado,
} from '../status'

type ContactoDetailDialogProps = {
  contacto: ContactoRow | null
  deleteError: string | null
  isDeleting: boolean
  isUpdatingStatus: boolean
  onClose: () => void
  onDelete: () => void
  onStatusChange: (estado: EditableContactoEstado) => void
  statusUpdateError: string | null
}

export function ContactoDetailDialog({
  contacto,
  deleteError,
  isDeleting,
  isUpdatingStatus,
  onClose,
  onDelete,
  onStatusChange,
  statusUpdateError,
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

  if (typeof document === 'undefined') {
    return null
  }

  const whatsappHref = formatWhatsAppLink(contacto.telefono)

  function handleDeleteClick() {
    if (
      typeof window !== 'undefined' &&
      !window.confirm('Esta accion eliminara la consulta de forma irreversible. Deseas continuar?')
    ) {
      return
    }

    onDelete()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[rgba(7,26,34,0.44)] p-3 backdrop-blur-sm md:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contacto-detail-title"
        className="my-auto flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-[var(--line)] bg-white shadow-[0_32px_80px_rgba(7,26,34,0.26)]"
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
            <DetailMetaCard
              icon={Mail}
              label="Email"
              value={contacto.email}
              href={`mailto:${contacto.email}`}
            />
            <DetailMetaCard
              action={
                whatsappHref
                  ? {
                      href: whatsappHref,
                      iconSrc: '/whatsapp.svg',
                      label: 'Enviar Whatsapp',
                      rel: 'noreferrer',
                      target: '_blank',
                    }
                  : undefined
              }
              icon={Phone}
              label="Telefono"
              value={contacto.telefono}
              href={`tel:${contacto.telefono}`}
            />
            <DetailMetaCard
              icon={CalendarDays}
              label="Fecha de envio"
              value={formatDateTime(contacto.created_at)}
            />
          </div>

          <section className="mt-5 rounded-[1.6rem] border border-[var(--line)] bg-white p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-strong)]">
                    Estado
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <ContactoStatusBadge estado={contacto.estado} />
                    <p className="text-sm text-[var(--muted)]">
                      Actualiza el seguimiento de esta consulta desde aqui.
                    </p>
                  </div>
                </div>

                {statusUpdateError ? (
                  <p className="rounded-[1rem] border border-[rgba(219,39,119,0.18)] bg-[rgba(244,114,182,0.08)] px-4 py-3 text-sm text-[rgb(157,23,77)]">
                    {statusUpdateError}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-3">
                {CONTACTO_EDITABLE_STATUS_OPTIONS.map((option) => {
                  const isActive = normalizeContactoEstado(contacto.estado) === option.value
                  const Icon = option.value === 'resuelta' ? CheckCircle2 : Clock3

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => onStatusChange(option.value)}
                      disabled={isUpdatingStatus || isDeleting || isActive}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? 'border-[rgba(37,150,190,0.28)] bg-[rgba(37,150,190,0.12)] text-[var(--brand-strong)]'
                          : 'border-[var(--line)] bg-white text-[var(--ink)] hover:border-[var(--brand)] hover:text-[var(--brand)]'
                      } disabled:cursor-not-allowed disabled:opacity-70`}
                    >
                      {isUpdatingStatus && !isActive ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="mt-5 rounded-[1.6rem] border border-[var(--line)] bg-[var(--background)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-strong)]">
              Mensaje
            </p>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[var(--ink)] md:text-base">
              {contacto.mensaje}
            </p>
          </section>

          <section className="mt-5 rounded-[1.6rem] border border-[rgba(220,38,38,0.18)] bg-[rgba(254,242,242,0.82)] p-5">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-[rgba(220,38,38,0.1)] p-2 text-[rgb(185,28,28)]">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(185,28,28)]">
                    Zona peligrosa
                  </p>
                  <p className="text-sm leading-7 text-[rgb(127,29,29)]">
                    Esta accion no se puede deshacer.
                  </p>
                </div>
              </div>

              {deleteError ? (
                <p className="rounded-[1rem] border border-[rgba(220,38,38,0.18)] bg-white px-4 py-3 text-sm text-[rgb(127,29,29)]">
                  {deleteError}
                </p>
              ) : null}

              <button
                type="button"
                onClick={handleDeleteClick}
                disabled={isDeleting || isUpdatingStatus}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[rgb(220,38,38)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[rgb(185,28,28)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isDeleting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Eliminar consulta
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  )
}

type DetailMetaCardProps = {
  action?: {
    href: string
    iconSrc: string
    label: string
    rel?: string
    target?: '_blank' | '_self'
  }
  href?: string
  icon: typeof Mail
  label: string
  value: string
}

function DetailMetaCard({ action, href, icon: Icon, label, value }: DetailMetaCardProps) {
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
          {action ? (
            <a
              href={action.href}
              target={action.target}
              rel={action.rel}
              className="mt-3 inline-flex items-center gap-3 whitespace-nowrap rounded-full border border-(--line) bg-(--surface-soft) px-4 py-2.5 text-sm font-medium text-(--ink) transition hover:border-(--brand) hover:text-(--brand)"
            >
              <img alt="" aria-hidden="true" className="h-6 w-6" src={action.iconSrc} />
              {action.label}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}