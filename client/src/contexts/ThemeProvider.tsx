import React, { type ReactElement } from 'react'
import { THEME_OPTIONS } from '@/constants/constants'
import { useLocalStorage } from '@/hooks/useLocalStorage'

type Theme = (typeof THEME_OPTIONS)[number]

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
}

export const ThemeContext = React.createContext<ThemeContextType | null>(null)

type ThemeContextProviderChildren = {
  children: ReactElement | ReactElement[]
}

const ThemeProvider = ({ children }: ThemeContextProviderChildren) => {
  const [theme, setTheme] = useLocalStorage<Theme>('THEME', 'system')

  function changeTheme(theme: Theme) {
    const isDark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)

    document.documentElement.classList.toggle('dark', isDark)
    setTheme(theme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme, isDark: document.documentElement.classList.contains('dark') }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
