import { startTransition, useEffect, useState } from 'react'
import type {
  FixtureFormValues,
  FixtureRow,
  FixtureStatusFilter,
} from '../../../types/fixture'
import {
  createFixture,
  deleteFixture,
  getFixtureList,
  updateFixture,
} from '../api'

const PAGE_SIZE = 12

type ListState = {
  records: FixtureRow[]
  total: number
  isLoading: boolean
  error: string | null
}

type SubmitState = {
  error: string | null
  isLoading: boolean
}

type DeleteState = {
  error: string | null
  fixtureId: number | null
}

export function useFixtureDashboard() {
  const [statusFilter, setStatusFilter] = useState<FixtureStatusFilter>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [listRevision, setListRevision] = useState(0)
  const [listState, setListState] = useState<ListState>({
    records: [],
    total: 0,
    isLoading: true,
    error: null,
  })
  const [submitState, setSubmitState] = useState<SubmitState>({
    error: null,
    isLoading: false,
  })
  const [deleteState, setDeleteState] = useState<DeleteState>({
    error: null,
    fixtureId: null,
  })

  useEffect(() => {
    startTransition(() => {
      setCurrentPage(1)
    })
  }, [statusFilter])

  useEffect(() => {
    let isActive = true

    startTransition(() => {
      setListState((current) => ({
        ...current,
        isLoading: true,
        error: null,
      }))
    })

    getFixtureList({
      page: currentPage,
      pageSize: PAGE_SIZE,
      estado: statusFilter,
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
              : 'No se pudieron cargar los partidos del fixture.',
        }))
      })

    return () => {
      isActive = false
    }
  }, [currentPage, listRevision, statusFilter])

  const totalPages = Math.max(1, Math.ceil(listState.total / PAGE_SIZE))

  useEffect(() => {
    if (currentPage > totalPages) {
      startTransition(() => {
        setCurrentPage(totalPages)
      })
    }
  }, [currentPage, totalPages])

  function refreshAll() {
    startTransition(() => {
      setListRevision((value) => value + 1)
    })
  }

  function clearFeedback() {
    setSubmitState({
      error: null,
      isLoading: false,
    })
    setDeleteState({
      error: null,
      fixtureId: null,
    })
  }

  async function createFixtureRecord(values: FixtureFormValues) {
    if (submitState.isLoading || deleteState.fixtureId !== null) {
      return false
    }

    setSubmitState({
      error: null,
      isLoading: true,
    })

    try {
      await createFixture(values)

      setSubmitState({
        error: null,
        isLoading: false,
      })

      startTransition(() => {
        setCurrentPage(1)
        setListRevision((value) => value + 1)
      })

      return true
    } catch (error) {
      setSubmitState({
        error:
          error instanceof Error ? error.message : 'No se pudo crear el partido del fixture.',
        isLoading: false,
      })

      return false
    }
  }

  async function updateFixtureRecord(fixture: FixtureRow, values: FixtureFormValues) {
    if (submitState.isLoading || deleteState.fixtureId !== null) {
      return false
    }

    setSubmitState({
      error: null,
      isLoading: true,
    })

    try {
      await updateFixture(fixture, values)

      setSubmitState({
        error: null,
        isLoading: false,
      })

      startTransition(() => {
        setCurrentPage(1)
        setListRevision((value) => value + 1)
      })

      return true
    } catch (error) {
      setSubmitState({
        error:
          error instanceof Error
            ? error.message
            : 'No se pudo actualizar el partido del fixture.',
        isLoading: false,
      })

      return false
    }
  }

  async function deleteFixtureRecord(fixture: FixtureRow) {
    if (submitState.isLoading || deleteState.fixtureId !== null) {
      return false
    }

    setDeleteState({
      error: null,
      fixtureId: fixture.id,
    })

    try {
      await deleteFixture(fixture.id)

      setDeleteState({
        error: null,
        fixtureId: null,
      })

      startTransition(() => {
        setListRevision((value) => value + 1)
      })

      return true
    } catch (error) {
      setDeleteState({
        error:
          error instanceof Error
            ? error.message
            : 'No se pudo eliminar el partido del fixture.',
        fixtureId: null,
      })

      return false
    }
  }

  function changePage(nextPage: number) {
    setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages))
  }

  return {
    clearFeedback,
    createFixture: createFixtureRecord,
    currentPage,
    deleteError: deleteState.error,
    deleteFixture: deleteFixtureRecord,
    deletingId: deleteState.fixtureId,
    error: listState.error,
    hasActiveStatusFilter: statusFilter !== 'all',
    isLoading: listState.isLoading,
    isSubmitting: submitState.isLoading,
    records: listState.records,
    refreshAll,
    resultsCount: listState.total,
    saveError: submitState.error,
    setCurrentPage: changePage,
    setStatusFilter,
    statusFilter,
    totalPages,
    updateFixture: updateFixtureRecord,
  }
}
