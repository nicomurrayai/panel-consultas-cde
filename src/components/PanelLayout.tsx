import { LogOut } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

type PanelLayoutProps = {
  onLogout: () => void
}

const navigationItems = [
  {
    href: '/',
    label: 'Consultas',
  },
  {
    href: '/fixture',
    label: 'Fixture',
  },
  {
    href: '/noticias',
    label: 'Noticias',
  },
]

export function PanelLayout({ onLogout }: PanelLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-120 bg-[radial-gradient(circle_at_top_left,rgba(37,150,190,0.20),transparent_42%),radial-gradient(circle_at_top_right,rgba(37,150,190,0.24),transparent_38%)]" />

      <div className="mx-auto flex w-full max-w-360 flex-col gap-6">
        <header className="rounded-[1.8rem] border border-(--line) bg-white/92 px-5 py-4 shadow-[0_18px_50px_rgba(15,46,56,0.06)] backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img alt="Logo del panel" className="h-10 w-auto object-contain" src="/logo.png" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--brand-strong)">
                  Panel interno
                </p>
                <p className="text-sm text-(--muted)">Consultas, noticias y fixture</p>
              </div>
            </div>

            <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
              <nav
                aria-label="Navegacion principal"
                className="flex flex-wrap items-center gap-2 overflow-x-auto"
              >
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.href}
                    end={item.href === '/'}
                    to={item.href}
                    className={({ isActive }) =>
                      `rounded-full px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? 'bg-(--brand) text-white'
                          : 'border border-(--line) bg-white text-(--ink) hover:border-(--brand) hover:text-(--brand)'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-full border border-(--line) bg-white px-4 py-2 text-sm font-medium text-(--ink) transition hover:border-(--brand) hover:text-(--brand)"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesion
              </button>
            </div>
          </div>
        </header>

        <Outlet />
      </div>
    </main>
  )
}
