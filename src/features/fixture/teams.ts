export type FixtureTeam = {
  nombre: string
  image_url: string
}

export const FIXTURE_TEAMS = [
  { nombre: 'Berazategui', image_url: 'https://api.promiedos.com.ar/images/team/bbiia/4' },
  { nombre: 'Sacachispas', image_url: 'https://api.promiedos.com.ar/images/team/bbihj/4' },
  { nombre: 'Centro Español', image_url: 'https://api.promiedos.com.ar/images/team/bbjee/4' },
  { nombre: 'CA Lugano', image_url: 'https://api.promiedos.com.ar/images/team/bedhd/4' },
  { nombre: 'Estrella del Sur', image_url: 'https://api.promiedos.com.ar/images/team/hjbfb/4' },
  { nombre: 'Mercedes', image_url: 'https://api.promiedos.com.ar/images/team/gjiac/4' },
  { nombre: 'Puerto Nuevo', image_url: 'https://api.promiedos.com.ar/images/team/bbjab/4' },
  { nombre: 'Cambaceres', image_url: 'https://api.promiedos.com.ar/images/team/bbijg/4' },
  { nombre: 'Victoriano', image_url: 'https://api.promiedos.com.ar/images/team/bbjdh/4' },
  { nombre: 'JJ Urquiza', image_url: 'https://api.promiedos.com.ar/images/team/bfjej/4' },
  { nombre: 'Paraguayo', image_url: 'https://api.promiedos.com.ar/images/team/bbjed/4' },
  { nombre: 'Leandro N. Alem', image_url: 'https://api.promiedos.com.ar/images/team/bbjac/4' },
  { nombre: 'Argentino Rosario', image_url: 'https://api.promiedos.com.ar/images/team/bbjdj/4' },
  { nombre: 'Juventud Unida SM', image_url: 'https://api.promiedos.com.ar/images/team/bejfe/4' },
  { nombre: 'Lamadrid', image_url: 'https://api.promiedos.com.ar/images/team/jaff/4' },
  { nombre: 'Leones de Rosario FC', image_url: 'https://api.promiedos.com.ar/images/team/jcbji/4' },
  { nombre: 'Central Ballester', image_url: 'https://api.promiedos.com.ar/images/team/bedhc/4' },
  { nombre: 'Cañuelas', image_url: 'https://api.promiedos.com.ar/images/team/bbjef/4' },
  { nombre: 'Yupanqui', image_url: 'https://api.promiedos.com.ar/images/team/bbjdf/4' },
  { nombre: 'Claypole', image_url: 'https://api.promiedos.com.ar/images/team/bbijh/4' },
  { nombre: 'Sp. Barracas', image_url: 'https://api.promiedos.com.ar/images/team/bedhb/4' },
  { nombre: 'El Porvenir', image_url: 'https://api.promiedos.com.ar/images/team/bbjec/4' },
  { nombre: 'Luján', image_url: 'https://api.promiedos.com.ar/images/team/bbjaa/4' },
  { nombre: 'Central Córdoba', image_url: 'https://api.promiedos.com.ar/images/team/hbbf/4' },
  { nombre: 'Fenix', image_url: 'https://api.promiedos.com.ar/images/team/bdgjd/4' },
  { nombre: 'Muñiz', image_url: 'https://api.promiedos.com.ar/images/team/bedhh/4' },
  { nombre: 'CA Atlas', image_url: 'https://api.promiedos.com.ar/images/team/bbjde/4' },
] as const satisfies readonly FixtureTeam[]

const TEAM_BY_NORMALIZED_NAME = new Map(
  FIXTURE_TEAMS.map((team) => [normalizeFixtureTeamName(team.nombre), team]),
)

export function normalizeFixtureTeamName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

export function getFixtureTeamByName(value: string | null | undefined) {
  if (!value) {
    return null
  }

  return TEAM_BY_NORMALIZED_NAME.get(normalizeFixtureTeamName(value)) ?? null
}
