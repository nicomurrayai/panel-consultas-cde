import { Activity, Clock3, Inbox, Search } from 'lucide-react'
import { formatCompactNumber, formatDateTime, formatRelativeTime } from '../../../lib/format'
import type { DashboardStats as DashboardStatsType } from '../../../types/contacto'

type DashboardStatsProps = {
  error: string | null
  isLoading: boolean
  resultCount: number
  stats: DashboardStatsType | null
}

export function DashboardStats({
  error,
  isLoading,
  resultCount,
  stats,
}: DashboardStatsProps) {
  const items = [
    {
      id: 'total',
      label: 'Total',
      value: stats ? formatCompactNumber(stats.totalConsultas) : '--',
      caption: 'Consultas recibidas',
      icon: Inbox,
    },
    {
      id: 'recent',
      label: 'Ultimas 24 h',
      value: stats ? formatCompactNumber(stats.consultas24h) : '--',
      caption: 'Ingresadas en el ultimo dia',
      icon: Activity,
    },
    {
      id: 'results',
      label: 'Resultados',
      value: formatCompactNumber(resultCount),
      caption: 'Consultas en pantalla',
      icon: Search,
    },
    {
      id: 'latest',
      label: 'Ultima consulta',
      value: stats ? formatDateTime(stats.ultimaRecepcion) : '--',
      caption: stats ? formatRelativeTime(stats.ultimaRecepcion) : 'Esperando sincronizacion',
      icon: Clock3,
    },
  ]

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon

        return (
          <article
            key={item.id}
            className="overflow-hidden rounded-[1.7rem] border border-[var(--line)] bg-white/92 p-5 shadow-[0_18px_50px_rgba(37,150,190,0.08)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-strong)]">
                  {item.label}
                </p>
                {isLoading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-8 w-28 rounded-full bg-[var(--surface-strong)]" />
                    <div className="h-4 w-40 rounded-full bg-[var(--surface-soft)]" />
                  </div>
                ) : (
                  <>
                    <p className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
                      {item.value}
                    </p>
                    <p className="text-sm text-[var(--muted)]">{item.caption}</p>
                  </>
                )}
              </div>

              <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-soft)] p-3 text-[var(--brand)]">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </article>
        )
      })}

      {error ? (
        null
      ) : null}
    </section>
  )
}