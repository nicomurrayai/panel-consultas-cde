import { startTransition, useEffect, useState } from 'react'
import { createNoticia, deleteNoticia, getNoticiasList, updateNoticia } from '../api'
import type { NoticiaFormValues, NoticiaRow } from '../../../types/noticia'

const PAGE_SIZE = 12

type ListState = {
  records: NoticiaRow[]
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
  noticiaId: number | null
}

export function useNoticiasDashboard() {
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
    noticiaId: null,
  })

  useEffect(() => {
    let isActive = true

    setListState((current) => ({
      ...current,
      isLoading: true,
      error: null,
    }))

    getNoticiasList({
      page: currentPage,
      pageSize: PAGE_SIZE,
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
              : 'No se pudieron cargar las noticias del panel.',
        }))
      })

    return () => {
      isActive = false
    }
  }, [currentPage, listRevision])

  const totalPages = Math.max(1, Math.ceil(listState.total / PAGE_SIZE))

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
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
      noticiaId: null,
    })
  }

  async function createNews(values: NoticiaFormValues) {
    if (submitState.isLoading || deleteState.noticiaId !== null) {
      return false
    }

    setSubmitState({
      error: null,
      isLoading: true,
    })

    try {
      await createNoticia(values)

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
        error: error instanceof Error ? error.message : 'No se pudo crear la noticia.',
        isLoading: false,
      })

      return false
    }
  }

  async function updateNews(noticia: NoticiaRow, values: NoticiaFormValues) {
    if (submitState.isLoading || deleteState.noticiaId !== null) {
      return false
    }

    setSubmitState({
      error: null,
      isLoading: true,
    })

    try {
      await updateNoticia(noticia, values)

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
        error: error instanceof Error ? error.message : 'No se pudo actualizar la noticia.',
        isLoading: false,
      })

      return false
    }
  }

  async function deleteNews(noticia: NoticiaRow) {
    if (submitState.isLoading || deleteState.noticiaId !== null) {
      return false
    }

    setDeleteState({
      error: null,
      noticiaId: noticia.id,
    })

    try {
      await deleteNoticia(noticia)

      setDeleteState({
        error: null,
        noticiaId: null,
      })

      startTransition(() => {
        setListRevision((value) => value + 1)
      })

      return true
    } catch (error) {
      setDeleteState({
        error: error instanceof Error ? error.message : 'No se pudo eliminar la noticia.',
        noticiaId: null,
      })

      return false
    }
  }

  function changePage(nextPage: number) {
    setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages))
  }

  return {
    clearFeedback,
    createNoticia: createNews,
    currentPage,
    deleteError: deleteState.error,
    deleteNoticia: deleteNews,
    deletingId: deleteState.noticiaId,
    error: listState.error,
    isLoading: listState.isLoading,
    isSubmitting: submitState.isLoading,
    records: listState.records,
    refreshAll,
    resultsCount: listState.total,
    saveError: submitState.error,
    setCurrentPage: changePage,
    totalPages,
    updateNoticia: updateNews,
  }
}
