import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const THEME_KEY = 'aurachat-color-mode'

const ThemeModeContext = createContext()

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_KEY)
      if (stored === 'dark' || stored === 'light') return stored
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })

  useEffect(() => {
    localStorage.setItem(THEME_KEY, mode)
    document.documentElement.setAttribute('data-color-scheme', mode)
  }, [mode])

  const toggle = useCallback(() => setMode((prev) => (prev === 'light' ? 'dark' : 'light')), [])

  return (
    <ThemeModeContext.Provider value={{ mode, toggle }}>
      {children}
    </ThemeModeContext.Provider>
  )
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext)
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider')
  return ctx
}
