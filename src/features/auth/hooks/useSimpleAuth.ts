import { useState } from 'react'

const SESSION_KEY = 'panel-consultas-cde.auth'
const SESSION_VALUE = 'authenticated'
const FALLBACK_USERNAME = 'admin'
const FALLBACK_PASSWORD = 'panel1234'

type Credentials = {
  password: string
  username: string
}

function getExpectedCredentials() {
  const username = import.meta.env.VITE_PANEL_AUTH_USERNAME?.trim() || FALLBACK_USERNAME
  const password = import.meta.env.VITE_PANEL_AUTH_PASSWORD || FALLBACK_PASSWORD

  return { password, username }
}

function getHelperMessage() {
  const envUsername = import.meta.env.VITE_PANEL_AUTH_USERNAME?.trim()
  const envPassword = import.meta.env.VITE_PANEL_AUTH_PASSWORD

  if (envUsername && envPassword) {
    return null
  }

  const { password, username } = getExpectedCredentials()

  return `Credenciales iniciales activas: ${username} / ${password}. Puedes cambiarlas con VITE_PANEL_AUTH_USERNAME y VITE_PANEL_AUTH_PASSWORD.`
}

function readStoredSession() {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    return window.sessionStorage.getItem(SESSION_KEY) === SESSION_VALUE
  } catch {
    return false
  }
}

export function useSimpleAuth() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(readStoredSession)

  const login = ({ password, username }: Credentials) => {
    const expectedCredentials = getExpectedCredentials()
    const isValidUser = username.trim() === expectedCredentials.username
    const isValidPassword = password === expectedCredentials.password

    if (!isValidUser || !isValidPassword) {
      setErrorMessage('Usuario o contraseña incorrectos.')
      return
    }

    try {
      window.sessionStorage.setItem(SESSION_KEY, SESSION_VALUE)
    } catch {
      // Ignora fallas de storage y permite continuar en la sesión actual.
    }

    setErrorMessage(null)
    setIsAuthenticated(true)
  }

  const logout = () => {
    try {
      window.sessionStorage.removeItem(SESSION_KEY)
    } catch {
      // No bloquea el cierre de sesión si sessionStorage no está disponible.
    }

    setErrorMessage(null)
    setIsAuthenticated(false)
  }

  const clearError = () => {
    setErrorMessage(null)
  }

  return {
    clearError,
    errorMessage,
    helperMessage: getHelperMessage(),
    isAuthenticated,
    login,
    logout,
  }
}