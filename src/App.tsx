import { Navigate, Route, Routes } from 'react-router-dom'
import { PanelLayout } from './components/PanelLayout'
import { AuthScreen } from './features/auth/components/AuthScreen'
import { useSimpleAuth } from './features/auth/hooks/useSimpleAuth'
import { ConsultasPage } from './features/contacto/pages/ConsultasPage'
import { FixturePage } from './features/fixture/pages/FixturePage'
import { NoticiasPage } from './features/noticias/pages/NoticiasPage'

function App() {
  const { clearError, errorMessage, helperMessage, isAuthenticated, login, logout } =
    useSimpleAuth()

  if (!isAuthenticated) {
    return (
      <AuthScreen
        errorMessage={errorMessage}
        helperMessage={helperMessage}
        onInputChange={clearError}
        onSubmit={login}
      />
    )
  }

  return (
    <Routes>
      <Route element={<PanelLayout onLogout={logout} />}>
        <Route index element={<ConsultasPage />} />
        <Route path="consultas" element={<Navigate replace to="/" />} />
        <Route path="fixture" element={<FixturePage />} />
        <Route path="noticias" element={<NoticiasPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Route>
    </Routes>
  )
}

export default App
