import { Check, ChevronDown, Search } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { FIXTURE_TEAMS, getFixtureTeamByName, normalizeFixtureTeamName } from '../teams'
import { FixtureTeamLogo } from './FixtureTeamLogo'

type FixtureTeamSelectProps = {
  onChange: (value: string) => void
  value: string
}

type MenuPosition = {
  left: number
  listMaxHeight: number
  top: number
  width: number
}

const MENU_GAP = 8
const MENU_HEADER_HEIGHT = 73
const MENU_MAX_LIST_HEIGHT = 288
const MENU_MIN_LIST_HEIGHT = 96
const VIEWPORT_PADDING = 12

export function FixtureTeamSelect({ onChange, value }: FixtureTeamSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const listboxId = useId()
  const selectedTeam = getFixtureTeamByName(value)
  const normalizedQuery = normalizeFixtureTeamName(query)

  const filteredTeams = useMemo(() => {
    if (!normalizedQuery) {
      return FIXTURE_TEAMS
    }

    return FIXTURE_TEAMS.filter((team) =>
      normalizeFixtureTeamName(team.nombre).includes(normalizedQuery),
    )
  }, [normalizedQuery])

  const updateMenuPosition = useCallback(() => {
    const triggerElement = triggerRef.current

    if (!triggerElement) {
      return
    }

    const triggerRect = triggerElement.getBoundingClientRect()
    const spaceBelow = window.innerHeight - triggerRect.bottom - MENU_GAP - VIEWPORT_PADDING
    const spaceAbove = triggerRect.top - MENU_GAP - VIEWPORT_PADDING
    const shouldOpenAbove = spaceBelow < 260 && spaceAbove > spaceBelow
    const availableHeight = Math.max(0, shouldOpenAbove ? spaceAbove : spaceBelow)
    const listMaxHeight = Math.max(
      MENU_MIN_LIST_HEIGHT,
      Math.min(MENU_MAX_LIST_HEIGHT, availableHeight - MENU_HEADER_HEIGHT),
    )
    const totalMenuHeight = listMaxHeight + MENU_HEADER_HEIGHT
    const preferredTop = shouldOpenAbove
      ? triggerRect.top - MENU_GAP - totalMenuHeight
      : triggerRect.bottom + MENU_GAP
    const top = Math.min(
      Math.max(preferredTop, VIEWPORT_PADDING),
      window.innerHeight - VIEWPORT_PADDING - totalMenuHeight,
    )
    const width = triggerRect.width
    const left = Math.min(
      Math.max(triggerRect.left, VIEWPORT_PADDING),
      window.innerWidth - VIEWPORT_PADDING - width,
    )

    setMenuPosition({
      left,
      listMaxHeight,
      top: Math.max(top, VIEWPORT_PADDING),
      width,
    })
  }, [])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    setActiveIndex(0)
    setMenuPosition(null)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    function handleClickOutside(event: MouseEvent) {
      const targetNode = event.target as Node

      if (
        !containerRef.current?.contains(targetNode) &&
        !menuRef.current?.contains(targetNode)
      ) {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [closeMenu, isOpen])

  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    window.addEventListener('resize', updateMenuPosition)
    window.addEventListener('scroll', updateMenuPosition, true)

    return () => {
      window.removeEventListener('resize', updateMenuPosition)
      window.removeEventListener('scroll', updateMenuPosition, true)
    }
  }, [isOpen, updateMenuPosition])

  function toggleMenu() {
    if (isOpen) {
      closeMenu()
      return
    }

    updateMenuPosition()
    setIsOpen(true)
    setActiveIndex(0)
  }

  function selectTeam(teamName: string) {
    onChange(teamName)
    closeMenu()
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      closeMenu()
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) =>
        filteredTeams.length > 0 ? Math.min(current + 1, filteredTeams.length - 1) : 0,
      )
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => Math.max(current - 1, 0))
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      const activeTeam = filteredTeams[activeIndex]

      if (activeTeam) {
        selectTeam(activeTeam.nombre)
      }
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex w-full items-center gap-3 rounded-[1.2rem] border border-(--line) bg-(--background) px-4 py-3 text-left text-sm text-(--ink) outline-none transition hover:border-(--brand) focus:border-(--brand) focus:shadow-[0_0_0_4px_rgba(37,150,190,0.12)]"
        onClick={toggleMenu}
        ref={triggerRef}
        type="button"
      >
        <FixtureTeamLogo team={selectedTeam} size="sm" />
        <span className="min-w-0 flex-1">
          <span className={`block truncate font-medium ${selectedTeam ? 'text-(--ink)' : 'text-(--muted)'}`}>
            {selectedTeam?.nombre ?? 'Seleccionar rival'}
          </span>
          <span className="block truncate text-xs text-(--muted)">
            Equipo rival
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-(--muted) transition ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && menuPosition && typeof document !== 'undefined' ? (
        createPortal(
        <div
          className="fixed z-[60] overflow-hidden rounded-[1.4rem] border border-(--line) bg-white shadow-[0_24px_60px_rgba(15,46,56,0.18)]"
          ref={menuRef}
          style={{
            left: menuPosition.left,
            top: menuPosition.top,
            width: menuPosition.width,
          }}
        >
          <div className="border-b border-(--line) p-3">
            <label className="flex items-center gap-2 rounded-[1rem] border border-(--line) bg-(--background) px-3 py-2 transition focus-within:border-(--brand) focus-within:shadow-[0_0_0_4px_rgba(37,150,190,0.12)]">
              <Search className="h-4 w-4 shrink-0 text-(--brand)" />
              <input
                aria-label="Buscar equipo rival"
                className="min-w-0 flex-1 border-0 bg-transparent text-sm text-(--ink) outline-none placeholder:text-(--muted)"
                onChange={(event) => {
                  setQuery(event.target.value)
                  setActiveIndex(0)
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder="Buscar equipo"
                ref={searchInputRef}
                value={query}
              />
            </label>
          </div>

          <div
            className="overflow-y-auto overscroll-contain p-2"
            id={listboxId}
            role="listbox"
            style={{ maxHeight: menuPosition.listMaxHeight }}
          >
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team, index) => {
                const isSelected = selectedTeam?.nombre === team.nombre
                const isActive = activeIndex === index

                return (
                  <button
                    aria-selected={isSelected}
                    className={`flex w-full items-center gap-3 rounded-[1rem] px-3 py-2.5 text-left transition ${
                      isSelected || isActive ? 'bg-(--surface-soft)' : 'hover:bg-(--background)'
                    }`}
                    key={team.nombre}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectTeam(team.nombre)}
                    role="option"
                    type="button"
                  >
                    <FixtureTeamLogo team={team} size="sm" />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-(--ink)">
                      {team.nombre}
                    </span>
                    {isSelected ? <Check className="h-4 w-4 text-(--brand)" /> : null}
                  </button>
                )
              })
            ) : (
              <p className="px-3 py-4 text-sm text-(--muted)">
                No hay equipos para esa busqueda.
              </p>
            )}
          </div>
        </div>,
        document.body,
        )
      ) : null}
    </div>
  )
}
