import { startTransition, useDeferredValue, useEffect, useState } from 'react'
import { getContactoList, getDashboardStats } from '../api'
import type { ContactoRow, DashboardStats } from '../../../types/contacto'

const PAGE_SIZE = 12

type ListState = {
  records: ContactoRow[]
  total: number
  isLoading: boolean
  error: string | null
}

type StatsState = {
  stats: DashboardStats | null
  isLoading: boolean
  error: string | null
}

export function useContactoDashboard() {
  const [searchInput, setSearchInput] = useState('')
  const normalizedSearchInput = searchInput.trim().slice(0, 120)
  const search = useDeferredValue(normalizedSearchInput)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedContacto, setSelectedContacto] = useState<ContactoRow | null>(null)
  const [listRevision, setListRevision] = useState(0)
  const [statsRevision, setStatsRevision] = useState(0)
  const [listState, setListState] = useState<ListState>({
    records: [],
    total: 0,
    isLoading: true,
    error: null,
  })
  const [statsState, setStatsState] = useState<StatsState>({
    stats: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    startTransition(() => {
      setCurrentPage(1)
    })
  }, [search])

  useEffect(() => {
    let isActive = true

    setListState((current) => ({
      ...current,
      isLoading: true,
      error: null,
    }))

    getContactoList({
      page: currentPage,
      pageSize: PAGE_SIZE,
      search,
    })
      .then((result) => {
        if (!isActive) {
          return
        }

        setListState({
          records: result.records,
          total: result.total,
          isLoading: false,
          error: null,
        })
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return
        }

        setListState((current) => ({
          ...current,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : 'No se pudieron cargar las consultas del panel.',
        }))
      })

    return () => {
      isActive = false
    }
  }, [currentPage, listRevision, search])

  useEffect(() => {
    let isActive = true

    setStatsState((current) => ({
      ...current,
      isLoading: true,
      error: null,
    }))

    getDashboardStats()
      .then((stats) => {
        if (!isActive) {
          return
        }

        setStatsState({
          stats,
          isLoading: false,
          error: null,
        })
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return
        }

        setStatsState((current) => ({
          ...current,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : 'No se pudieron obtener las metricas del panel.',
        }))
      })

    return () => {
      isActive = false
    }
  }, [statsRevision])

  const totalPages = Math.max(1, Math.ceil(listState.total / PAGE_SIZE))

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  function refreshAll() {
    startTransition(() => {
      setListRevision((value) => value + 1)
      setStatsRevision((value) => value + 1)
    })
  }

  function openDetail(contacto: ContactoRow) {
    setSelectedContacto(contacto)
  }

  function closeDetail() {
    setSelectedContacto(null)
  }

  function changePage(nextPage: number) {
    setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages))
  }

  return {
    closeDetail,
    currentPage,
    error: listState.error,
    hasActiveSearch: normalizedSearchInput.length > 0,
    isLoading: listState.isLoading,
    isSearchPending: normalizedSearchInput !== search,
    openDetail,
    records: listState.records,
    refreshAll,
    resultsCount: listState.total,
    searchInput,
    selectedContacto,
    setCurrentPage: changePage,
    setSearchInput,
    stats: statsState.stats,
    statsError: statsState.error,
    statsLoading: statsState.isLoading,
    totalPages,
  }
}