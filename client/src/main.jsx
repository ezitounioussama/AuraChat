import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { ClerkProvider, Show } from '@clerk/react'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import './index.css'
import MainLayout from './layouts/MainLayout'
import SignInPage from './pages/SignInPage'
import AuthSplash from './pages/AuthSplash'
import './i18n'

const theme = createTheme({
  modularCssLayers: '@layer theme, base, mui, components, utilities;',
  palette: {
    primary: { main: '#3A76F0' },
  },
})

function Root() {
  const navigate = useNavigate()

  return (
    <ClerkProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      signInUrl="/sign-in"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route
            path="/*"
            element={
              <Show when="signed-in" fallback={<AuthSplash />}>
                <MainLayout />
              </Show>
            }
          />
        </Routes>
      </ThemeProvider>
    </ClerkProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </StrictMode>,
)
