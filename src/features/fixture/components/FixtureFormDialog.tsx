import { CalendarDays, LoaderCircle, ShieldCheck, Swords, X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import type { FixtureCondition, FixtureFormValues, FixtureRow, FixtureStatus } from '../../../types/fixture'
import { toFixtureDateTimeInputValue } from '../dateTime'
import { FIXTURE_CONDITION_OPTIONS, FIXTURE_STATUS_OPTIONS } from '../status'
import { getFixtureTeamByName } from '../teams'
import { FixtureConditionBadge } from './FixtureConditionBadge'
import { FixtureStatusBadge } from './FixtureStatusBadge'
import { FixtureTeamLogo } from './FixtureTeamLogo'
import { FixtureTeamSelect } from './FixtureTeamSelect'

type FixtureFormDialogProps = {
  errorMessage: string | null
  fixture: FixtureRow | null
  isOpen: boolean
  isSaving: boolean
  mode: 'create' | 'edit'
  onClose: () => void
  onSubmit: (values: FixtureFormValues) => Promise<void> | void
}

const DEFAULT_SEASON = new Date().getFullYear()

function getInitialFormState(fixture: FixtureRow | null) {
  const fixtureTeam = getFixtureTeamByName(fixture?.rival)

  return {
    temporada: String(fixture?.temporada ?? DEFAULT_SEASON),
    fechaPartido: toFixtureDateTimeInputValue(fixture?.fecha_partido),
    rival: fixtureTeam?.nombre ?? '',
    condicion: fixture?.condicion ?? 'local',
    torneo: fixture?.torneo ?? '',
    estado: fixture?.estado ?? 'programado',
  } as const
}

export function FixtureFormDialog({
  errorMessage,
  fixture,
  isOpen,
  isSaving,
  mode,
  onClose,
  onSubmit,
}: FixtureFormDialogProps) {
  const initialFormState = getInitialFormState(fixture)
  const [temporada, setTemporada] = useState(initialFormState.temporada)
  const [fechaPartido, setFechaPartido] = useState(initialFormState.fechaPartido)
  const [rival, setRival] = useState<string>(initialFormState.rival)
  const [condicion, setCondicion] = useState<FixtureCondition>(initialFormState.condicion)
  const [torneo, setTorneo] = useState(initialFormState.torneo)
  const [estado, setEstado] = useState<FixtureStatus>(initialFormState.estado)
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
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
  }, [isOpen, onClose])

  if (!isOpen || typeof document === 'undefined') {
    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const parsedTemporada = Number.parseInt(temporada, 10)
    const selectedTeam = getFixtureTeamByName(rival)

    if (!Number.isInteger(parsedTemporada) || parsedTemporada <= 0) {
      setLocalError('La temporada debe ser un numero entero mayor a cero.')
      return
    }

    if (!fechaPartido || !selectedTeam) {
      setLocalError('Completa temporada, fecha y rival antes de guardar.')
      return
    }

    setLocalError(null)

    await onSubmit({
      temporada: parsedTemporada,
      fecha_partido: fechaPartido,
      rival: selectedTeam.nombre,
      condicion,
      torneo: torneo.trim(),
      estado,
    })
  }

  const title = mode === 'create' ? 'Nuevo partido' : 'Editar partido'
  const description =
    mode === 'create'
      ? 'Carga un partido del fixture con fecha, condicion y estado.'
      : 'Actualiza la fecha, el rival o el estado del partido seleccionado.'
  const selectedTeam = getFixtureTeamByName(rival)

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[rgba(7,26,34,0.44)] p-3 backdrop-blur-sm md:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="fixture-form-title"
        className="my-auto flex w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border border-(--line) bg-white shadow-[0_32px_80px_rgba(7,26,34,0.26)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-(--line) px-5 py-5 md:px-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--brand-strong)">
              Fixture
            </p>
            <div>
              <h3 id="fixture-form-title" className="font-display text-3xl text-(--ink)">
                {title}
              </h3>
              <p className="mt-2 text-sm text-(--muted)">{description}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-(--line) p-2 text-(--muted) transition hover:border-(--brand) hover:text-(--brand)"
            aria-label="Cerrar formulario"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-5 px-5 py-5 md:px-6 md:py-6" onSubmit={handleSubmit}>
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-(--ink)">Temporada</span>
                <input
                  className="w-full rounded-[1.2rem] border border-(--line) bg-(--background) px-4 py-3 text-sm text-(--ink) outline-none transition focus:border-(--brand) focus:shadow-[0_0_0_4px_rgba(37,150,190,0.12)]"
                  min="1"
                  onChange={(event) => setTemporada(event.target.value)}
                  placeholder="Ej. 2026"
                  step="1"
                  type="number"
                  value={temporada}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-(--ink)">Fecha y hora</span>
                <input
                  className="w-full rounded-[1.2rem] border border-(--line) bg-(--background) px-4 py-3 text-sm text-(--ink) outline-none transition focus:border-(--brand) focus:shadow-[0_0_0_4px_rgba(37,150,190,0.12)]"
                  onChange={(event) => setFechaPartido(event.target.value)}
                  type="datetime-local"
                  value={fechaPartido}
                />
              </label>

              <div className="block space-y-2 sm:col-span-2">
                <span className="text-sm font-medium text-(--ink)">Rival</span>
                <FixtureTeamSelect onChange={setRival} value={rival} />
              </div>

              <label className="block space-y-2 sm:col-span-2">
                <span className="text-sm font-medium text-(--ink)">Torneo</span>
                <input
                  className="w-full rounded-[1.2rem] border border-(--line) bg-(--background) px-4 py-3 text-sm text-(--ink) outline-none transition focus:border-(--brand) focus:shadow-[0_0_0_4px_rgba(37,150,190,0.12)]"
                  onChange={(event) => setTorneo(event.target.value)}
                  placeholder="Ej. Liga Nacional"
                  value={torneo}
                />
              </label>
            </div>

            <div className="space-y-5">
              <div className="rounded-[1.6rem] border border-(--line) bg-(--background) p-5">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--brand-strong)">
                    Vista previa
                  </p>
                  <div className="flex items-center gap-4">
                    <FixtureTeamLogo team={selectedTeam} size="lg" />
                    <div className="min-w-0 space-y-2">
                      <h4 className="truncate font-display text-2xl text-(--ink)">
                        {selectedTeam?.nombre ?? 'Rival pendiente'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <FixtureConditionBadge condicion={condicion} />
                        <FixtureStatusBadge estado={estado} />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-3 pt-2 sm:grid-cols-2">
                    <div className="rounded-[1.2rem] border border-(--line) bg-white px-4 py-3">
                      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-(--brand-strong)">
                        <CalendarDays className="h-4 w-4" />
                        Fecha
                      </p>
                      <p className="mt-2 text-sm text-(--muted)">
                        {fechaPartido ? fechaPartido.replace('T', ' ') : 'Sin definir'}
                      </p>
                    </div>
                    <div className="rounded-[1.2rem] border border-(--line) bg-white px-4 py-3">
                      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-(--brand-strong)">
                        <Swords className="h-4 w-4" />
                        Torneo
                      </p>
                      <p className="mt-2 text-sm text-(--muted)">
                        {torneo.trim() || 'Sin torneo'}
                      </p>
                    </div>
                    <div className="rounded-[1.2rem] border border-(--line) bg-white px-4 py-3">
                      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-(--brand-strong)">
                        <ShieldCheck className="h-4 w-4" />
                        Temporada
                      </p>
                      <p className="mt-2 text-sm text-(--muted)">{temporada || 'Sin definir'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-(--ink)">Condicion</span>
                  <select
                    className="w-full rounded-[1.2rem] border border-(--line) bg-(--background) px-4 py-3 text-sm text-(--ink) outline-none transition focus:border-(--brand) focus:shadow-[0_0_0_4px_rgba(37,150,190,0.12)]"
                    onChange={(event) => setCondicion(event.target.value as FixtureCondition)}
                    value={condicion}
                  >
                    {FIXTURE_CONDITION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-(--ink)">Estado</span>
                  <select
                    className="w-full rounded-[1.2rem] border border-(--line) bg-(--background) px-4 py-3 text-sm text-(--ink) outline-none transition focus:border-(--brand) focus:shadow-[0_0_0_4px_rgba(37,150,190,0.12)]"
                    onChange={(event) => setEstado(event.target.value as FixtureStatus)}
                    value={estado}
                  >
                    {FIXTURE_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>

          {localError ? (
            <p className="rounded-[1rem] border border-[rgba(220,38,38,0.18)] bg-[rgba(254,242,242,0.82)] px-4 py-3 text-sm text-[rgb(127,29,29)]">
              {localError}
            </p>
          ) : null}

          {errorMessage ? (
            <p className="rounded-[1rem] border border-[rgba(220,38,38,0.18)] bg-[rgba(254,242,242,0.82)] px-4 py-3 text-sm text-[rgb(127,29,29)]">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-3 border-t border-(--line) pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-(--line) bg-white px-5 py-3 text-sm font-medium text-(--ink) transition hover:border-(--brand) hover:text-(--brand)"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-full bg-(--brand) px-5 py-3 text-sm font-medium text-white transition hover:bg-(--brand-strong) disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {mode === 'create' ? 'Crear partido' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
