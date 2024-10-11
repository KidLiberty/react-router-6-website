import React, { type ReactElement, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { signup as signupService, login as loginService, logout as logoutService, getLoggedInUser } from '../services/authentication'
import type { User } from '../constants/types'
import { LogoutDialog } from '../components/LogoutDialog'

type AuthProviderChildren = {
  children: ReactElement | ReactElement[]
}

type AuthContextType = {
  signup: (email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isLoggedIn: boolean
  isLoadingUser: boolean
  user?: User
}

export const AuthContext = React.createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: AuthProviderChildren) {
  const [user, setUser] = useState<User>()
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [logoutModalIsOpen, setIsLogoutModalOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isLoggedIn = user != null

  useEffect(() => {
    setIsLoadingUser(true)
    getLoggedInUser()
      .then(setUser)
      .finally(() => setIsLoadingUser(false))
  }, [])

  function signup(email: string, password: string) {
    return signupService(email, password)
      .then(user => {
        setUser(user)
        navigate(location.state?.location ?? '/')
      })
  }

  function login(email: string, password: string) {
    return loginService(email, password)
      .then(user => {
        setUser(user)
        navigate(location.state?.location ?? '/')
      })
  }

  function logout() {
    setIsLogoutModalOpen(true)
    return logoutService()
      .then(() => setUser(undefined))
      .finally(() => setIsLogoutModalOpen(false))
  }

  return (
    <AuthContext.Provider value={{ signup, login, logout, isLoggedIn, isLoadingUser, user }}>
      {children}
      <LogoutDialog isOpen={logoutModalIsOpen} onOpenChange={setIsLogoutModalOpen} />
    </AuthContext.Provider>
  )
}