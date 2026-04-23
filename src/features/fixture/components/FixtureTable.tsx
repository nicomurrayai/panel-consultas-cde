import { Pencil, Trash2 } from 'lucide-react'
import { formatDateTime } from '../../../lib/format'
import type { FixtureRow } from '../../../types/fixture'
import { getFixtureTeamByName } from '../teams'
import { FixtureConditionBadge } from './FixtureConditionBadge'
import { FixtureStatusBadge } from './FixtureStatusBadge'
import { FixtureTeamLogo } from './FixtureTeamLogo'

type FixtureTableProps = {
  deletingId: number | null
  fixtures: FixtureRow[]
  onDelete: (fixture: FixtureRow) => void
  onEdit: (fixture: FixtureRow) => void
}

export function FixtureTable({
  deletingId,
  fixtures,
  onDelete,
  onEdit,
}: FixtureTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-[1.6rem] border border-(--line) md:block">
      <div className="max-h-[68vh] overflow-auto bg-white">
        <table className="min-w-full border-separate border-spacing-0 text-left">
          <thead className="sticky top-0 z-10 bg-white/96 backdrop-blur-sm">
            <tr className="text-xs uppercase tracking-[0.18em] text-(--brand-strong)">
              <th scope="col" className="border-b border-(--line) px-5 py-4 font-semibold">
                Fecha y hora
              </th>
              <th scope="col" className="border-b border-(--line) px-5 py-4 font-semibold">
                Rival
              </th>
              <th scope="col" className="border-b border-(--line) px-5 py-4 font-semibold">
                Condicion
              </th>
              <th scope="col" className="border-b border-(--line) px-5 py-4 font-semibold">
                Estado
              </th>
              <th scope="col" className="border-b border-(--line) px-5 py-4 font-semibold">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {fixtures.map((fixture) => {
              const rivalTeam = getFixtureTeamByName(fixture.rival)

              return (
                <tr key={fixture.id} className="transition hover:bg-(--surface-soft)">
                  <td className="border-b border-(--line) px-5 py-4 align-top text-sm text-(--ink)">
                    {formatDateTime(fixture.fecha_partido)}
                  </td>
                  <td className="border-b border-(--line) px-5 py-4 align-top">
                    <div className="flex items-center gap-3">
                      <FixtureTeamLogo team={rivalTeam} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-(--ink)">
                          {rivalTeam?.nombre ?? fixture.rival}
                        </p>
                        {!rivalTeam ? (
                          <p className="text-xs text-(--muted)">Sin imagen asignada</p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-(--line) px-5 py-4 align-top">
                    <FixtureConditionBadge condicion={fixture.condicion} />
                  </td>
                  <td className="border-b border-(--line) px-5 py-4 align-top">
                    <FixtureStatusBadge estado={fixture.estado} />
                  </td>
                  <td className="border-b border-(--line) px-5 py-4 align-top">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(fixture)}
                        className="inline-flex items-center gap-2 rounded-full border border-(--line) bg-white px-3 py-2 text-sm font-medium text-(--ink) transition hover:border-(--brand) hover:text-(--brand)"
                      >
                        <Pencil className="h-4 w-4" />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(fixture)}
                        disabled={deletingId === fixture.id}
                        className="inline-flex items-center gap-2 rounded-full bg-[rgb(220,38,38)] px-3 py-2 text-sm font-medium text-white transition hover:bg-[rgb(185,28,28)] disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <Trash2 className="h-4 w-4" />
                        {deletingId === fixture.id ? 'Eliminando' : 'Eliminar'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
