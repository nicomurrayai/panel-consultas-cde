import { useState, type FormEvent } from 'react'
import { LockKeyhole, LogIn, UserRound } from 'lucide-react'

type AuthScreenProps = {
  errorMessage?: string | null
  helperMessage?: string | null
  onInputChange?: () => void
  onSubmit: (credentials: { password: string; username: string }) => void
}

export function AuthScreen({
  errorMessage,
  helperMessage,
  onInputChange,
  onSubmit,
}: AuthScreenProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({ password, username })
  }

  const handleUsernameChange = (value: string) => {
    setUsername(value)
    onInputChange?.()
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    onInputChange?.()
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(37,150,190,0.26),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(18,50,61,0.08),transparent_35%),linear-gradient(180deg,#fafdfe_0%,#eef8fb_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[linear-gradient(180deg,rgba(255,255,255,0.8),transparent)]" />

      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-xl items-center justify-center">
        <section className="w-full overflow-hidden rounded-[2rem] border border-(--line) bg-white/92 p-6 shadow-[0_30px_80px_rgba(15,46,56,0.12)] backdrop-blur-sm sm:p-8">
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-(--line) bg-(--surface-soft) px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-(--brand-strong)">
                Panel interno
              </div>

              <div className="flex justify-center">
                <img
                  alt="Logo del panel"
                  className="h-20 w-auto object-contain sm:h-24"
                  src="/logo.png"
                />
              </div>

              <div className="space-y-2">
                <h1 className="font-display text-4xl text-(--ink) sm:text-5xl">Acceso al panel</h1>
                <p className="mx-auto max-w-md text-sm leading-7 text-(--muted) sm:text-base">
                  Ingresa con tu usuario y contraseña para ver las consultas recibidas.
                </p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block space-y-2 text-left">
                <span className="text-sm font-medium text-(--ink)">Usuario</span>
                <span className="flex items-center gap-3 rounded-[1.4rem] border border-(--line) bg-(--background) px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition focus-within:border-(--brand) focus-within:shadow-[0_0_0_4px_rgba(37,150,190,0.12)]">
                  <UserRound className="h-5 w-5 text-(--brand)" />
                  <input
                    autoComplete="username"
                    className="w-full border-0 bg-transparent text-sm text-(--ink) outline-none placeholder:text-(--muted)"
                    onChange={(event) => handleUsernameChange(event.target.value)}
                    placeholder="Tu usuario"
                    required
                    type="text"
                    value={username}
                  />
                </span>
              </label>

              <label className="block space-y-2 text-left">
                <span className="text-sm font-medium text-(--ink)">Contraseña</span>
                <span className="flex items-center gap-3 rounded-[1.4rem] border border-(--line) bg-(--background) px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition focus-within:border-(--brand) focus-within:shadow-[0_0_0_4px_rgba(37,150,190,0.12)]">
                  <LockKeyhole className="h-5 w-5 text-(--brand)" />
                  <input
                    autoComplete="current-password"
                    className="w-full border-0 bg-transparent text-sm text-(--ink) outline-none placeholder:text-(--muted)"
                    onChange={(event) => handlePasswordChange(event.target.value)}
                    placeholder="Tu contraseña"
                    required
                    type="password"
                    value={password}
                  />
                </span>
              </label>

              {errorMessage ? (
                <p className="rounded-[1.2rem] border border-[rgba(219,39,119,0.18)] bg-[rgba(244,114,182,0.08)] px-4 py-3 text-sm text-[rgb(157,23,77)]">
                  {errorMessage}
                </p>
              ) : null}

              {helperMessage ? (
                <p className="rounded-[1.2rem] border border-(--line) bg-(--surface-soft) px-4 py-3 text-sm text-(--muted)">
                  {helperMessage}
                </p>
              ) : null}

              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-(--brand) px-5 py-3 font-medium text-white transition hover:bg-(--brand-strong)"
                type="submit"
              >
                <LogIn className="h-4 w-4" />
                Ingresar
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}