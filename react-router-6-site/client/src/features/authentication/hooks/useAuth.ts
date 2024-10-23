import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthProvider'

export function useAuth() {
  const authContext = useContext(AuthContext)
  if (authContext == null) throw Error('Must call Auth Context from within Auth Provider')
  return authContext
}