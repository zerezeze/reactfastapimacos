import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  // Carrega preferência inicial (localStorage ou sistema)
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('theme')
      if (saved === 'dark' || saved === 'light') {
        setTheme(saved)
        return
      }
      const prefersDark = window.matchMedia?.(
        '(prefers-color-scheme: dark)',
      ).matches
      setTheme(prefersDark ? 'dark' : 'light')
    } catch {
      // Em caso de erro, mantém 'light'
    }
  }, [])

  // Aplica classe no <html> e salva preferência
  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try {
      window.localStorage.setItem('theme', theme)
    } catch {
      // Ignora erro de storage
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider')
  }
  return context
}
