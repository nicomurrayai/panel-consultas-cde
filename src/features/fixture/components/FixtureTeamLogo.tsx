import { Shield } from 'lucide-react'
import { useState } from 'react'
import type { FixtureTeam } from '../teams'

type FixtureTeamLogoProps = {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  team: FixtureTeam | null
}

const SIZE_STYLES = {
  sm: {
    icon: 'h-5 w-5',
    wrapper: 'h-10 w-10',
  },
  md: {
    icon: 'h-6 w-6',
    wrapper: 'h-12 w-12',
  },
  lg: {
    icon: 'h-9 w-9',
    wrapper: 'h-20 w-20',
  },
} as const

export function FixtureTeamLogo({ className = '', size = 'md', team }: FixtureTeamLogoProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null)
  const sizeStyles = SIZE_STYLES[size]
  const shouldShowImage = Boolean(team && team.image_url !== failedImageUrl)

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-(--line) bg-white shadow-[0_8px_24px_rgba(15,46,56,0.08)] ${sizeStyles.wrapper} ${className}`}
    >
      {team && shouldShowImage ? (
        <img
          alt={`Escudo de ${team.nombre}`}
          className="h-full w-full object-contain p-1.5"
          onError={() => setFailedImageUrl(team.image_url)}
          src={team.image_url}
        />
      ) : (
        <Shield className={`${sizeStyles.icon} text-(--brand)`} aria-hidden="true" />
      )}
    </span>
  )
}
