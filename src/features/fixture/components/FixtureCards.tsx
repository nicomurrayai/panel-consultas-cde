import { Pencil, Trash2 } from 'lucide-react'
import { formatDateTime } from '../../../lib/format'
import type { FixtureRow } from '../../../types/fixture'
import { getFixtureTeamByName } from '../teams'
import { FixtureConditionBadge } from './FixtureConditionBadge'
import { FixtureStatusBadge } from './FixtureStatusBadge'
import { FixtureTeamLogo } from './FixtureTeamLogo'

type FixtureCardsProps = {
  deletingId: number | null
  fixtures: FixtureRow[]
  onDelete: (fixture: FixtureRow) => void
  onEdit: (fixture: FixtureRow) => void
}

export function FixtureCards({
  deletingId,
  fixtures,
  onDelete,
  onEdit,
}: FixtureCardsProps) {
  return (
    <div className="grid gap-4 md:hidden">
      {fixtures.map((fixture) => {
        const rivalTeam = getFixtureTeamByName(fixture.rival)

        return (
          <article
            key={fixture.id}
            className="overflow-hidden rounded-[1.6rem] border border-(--line) bg-white shadow-[0_18px_44px_rgba(15,46,56,0.05)]"
          >
            <div className="space-y-4 p-5">
              <div className="flex items-start gap-3">
                <FixtureTeamLogo team={rivalTeam} size="md" />
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-medium text-(--brand-strong)">
                    {formatDateTime(fixture.fecha_partido)}
                  </p>
                  <h3 className="text-lg font-medium text-(--ink)">
                    {rivalTeam?.nombre ?? fixture.rival}
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <FixtureConditionBadge condicion={fixture.condicion} />
                <FixtureStatusBadge estado={fixture.estado} />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(fixture)}
                  className="inline-flex items-center gap-2 rounded-full border border-(--line) bg-white px-4 py-2 text-sm font-medium text-(--ink) transition hover:border-(--brand) hover:text-(--brand)"
                >
                  <Pencil className="h-4 w-4" />
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(fixture)}
                  disabled={deletingId === fixture.id}
                  className="inline-flex items-center gap-2 rounded-full bg-[rgb(220,38,38)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[rgb(185,28,28)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Trash2 className="h-4 w-4" />
                  {deletingId === fixture.id ? 'Eliminando' : 'Eliminar'}
                </button>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
