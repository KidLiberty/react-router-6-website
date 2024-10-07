import { useContext } from 'react'
import { ThemeContext } from '@/contexts/ThemeProvider'

export function useThemeContext() {
  const themeContext = useContext(ThemeContext)
  if (themeContext === null) throw Error('Must call Theme Context from within Theme Context Provider')
  return themeContext
}