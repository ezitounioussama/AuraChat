import { StrictMode, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { ClerkProvider, Show } from '@clerk/react'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import './index.css'
import MainLayout from './layouts/MainLayout'
import SignInPage from './pages/SignInPage'
import { ThemeModeProvider, useThemeMode } from './contexts/ThemeContext'
import { SocketProvider } from './contexts/SocketContext'
import Toast from './components/notifications/Toast'
import NotificationSnackbar from './components/notifications/NotificationSnackbar'
import './i18n'

const commonTheme = {
  modularCssLayers: '@layer theme, base, mui, components, utilities;',
  shape: { borderRadius: 12 },
  typography: { fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' },
}

function ThemedRoot() {
  const { mode } = useThemeMode()
  const navigate = useNavigate()

  const theme = useMemo(() => createTheme({
    ...commonTheme,
    palette: {
      mode,
      primary: { main: '#3A76F0' },
      ...(mode === 'dark' ? {
        background: { default: '#1B1B1F', paper: '#252529' },
        divider: 'rgba(255,255,255,0.08)',
        text: { primary: '#E4E4E7', secondary: '#A1A1AA' },
      } : {}),
    },
  }), [mode])

  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      signInUrl="/sign-in"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SocketProvider>
          <Toast />
          <NotificationSnackbar />
          <Routes>
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route
              path="/*"
              element={
                <Show when="signed-in" fallback={<Navigate to="/sign-in" replace />}>
                  <MainLayout />
                </Show>
              }
            />
          </Routes>
        </SocketProvider>
      </ThemeProvider>
    </ClerkProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeModeProvider>
        <ThemedRoot />
      </ThemeModeProvider>
    </BrowserRouter>
  </StrictMode>,
)
