import { startTransition, useDeferredValue, useEffect, useState } from 'react'
import { deleteContacto, getContactoList, getDashboardStats, updateContactoEstado } from '../api'
import type { ContactoRow, ContactoStatusFilter, DashboardStats } from '../../../types/contacto'
import type { EditableContactoEstado } from '../status'

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

type StatusUpdateState = {
  error: string | null
  isLoading: boolean
}

type DeleteState = {
  error: string | null
  isLoading: boolean
}

export function useContactoDashboard() {
  const [searchInput, setSearchInput] = useState('')
  const normalizedSearchInput = searchInput.trim().slice(0, 120)
  const search = useDeferredValue(normalizedSearchInput)
  const [statusFilter, setStatusFilter] = useState<ContactoStatusFilter>('all')
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
  const [statusUpdateState, setStatusUpdateState] = useState<StatusUpdateState>({
    error: null,
    isLoading: false,
  })
  const [deleteState, setDeleteState] = useState<DeleteState>({
    error: null,
    isLoading: false,
  })

  useEffect(() => {
    startTransition(() => {
      setCurrentPage(1)
    })
  }, [search, statusFilter])

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
      statusFilter,
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
  }, [currentPage, listRevision, search, statusFilter])

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
    setStatusUpdateState({
      error: null,
      isLoading: false,
    })
    setDeleteState({
      error: null,
      isLoading: false,
    })
    setSelectedContacto(contacto)
  }

  function closeDetail() {
    setStatusUpdateState({
      error: null,
      isLoading: false,
    })
    setDeleteState({
      error: null,
      isLoading: false,
    })
    setSelectedContacto(null)
  }

  async function changeSelectedContactoEstado(estado: EditableContactoEstado) {
    if (!selectedContacto || statusUpdateState.isLoading || deleteState.isLoading) {
      return
    }

    setStatusUpdateState({
      error: null,
      isLoading: true,
    })

    try {
      const updatedContacto = await updateContactoEstado(selectedContacto.id, estado)

      setListState((current) => ({
        ...current,
        records: current.records.map((contacto) =>
          contacto.id === updatedContacto.id ? updatedContacto : contacto,
        ),
      }))

      setSelectedContacto((current) =>
        current?.id === updatedContacto.id ? updatedContacto : current,
      )

      startTransition(() => {
        setListRevision((value) => value + 1)
      })

      setStatusUpdateState({
        error: null,
        isLoading: false,
      })
    } catch (error) {
      setStatusUpdateState({
        error:
          error instanceof Error
            ? error.message
            : 'No se pudo actualizar el estado de la consulta.',
        isLoading: false,
      })
    }
  }

  async function deleteSelectedContacto() {
    if (!selectedContacto || statusUpdateState.isLoading || deleteState.isLoading) {
      return
    }

    setDeleteState({
      error: null,
      isLoading: true,
    })

    try {
      const deletedId = selectedContacto.id

      await deleteContacto(deletedId)

      setListState((current) => ({
        ...current,
        records: current.records.filter((contacto) => contacto.id !== deletedId),
        total: Math.max(0, current.total - 1),
      }))

      setStatusUpdateState({
        error: null,
        isLoading: false,
      })
      setDeleteState({
        error: null,
        isLoading: false,
      })
      setSelectedContacto(null)

      startTransition(() => {
        setListRevision((value) => value + 1)
        setStatsRevision((value) => value + 1)
      })
    } catch (error) {
      setDeleteState({
        error:
          error instanceof Error ? error.message : 'No se pudo eliminar la consulta.',
        isLoading: false,
      })
    }
  }

  function changePage(nextPage: number) {
    setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages))
  }

  return {
    closeDetail,
    currentPage,
    error: listState.error,
    hasActiveStatusFilter: statusFilter !== 'all',
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
    setStatusFilter,
    statusFilter,
    deleteSelectedContacto,
    deleteError: deleteState.error,
    deleteLoading: deleteState.isLoading,
    statusUpdateError: statusUpdateState.error,
    statusUpdateLoading: statusUpdateState.isLoading,
    stats: statsState.stats,
    statsError: statsState.error,
    statsLoading: statsState.isLoading,
    totalPages,
    updateSelectedContactoEstado: changeSelectedContactoEstado,
  }
}