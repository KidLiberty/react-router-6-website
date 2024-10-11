import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '@/features/authentication'
import { LoadingSpinner } from '../ui/LoadingSpinner'

export function PrivatePage({ children }: { children: ReactNode }) {
  const { user, isLoadingUser } = useAuth()
  const location = useLocation()

  if (isLoadingUser) return <LoadingSpinner className='w-24 h-24' />

  /*
   the replace prop replaces the current URL with our login page, 
   state sends them the location of the page they tried to access, which we are doing in the authProvider
  */
  if (user == null) return <Navigate to='/login' replace state={{ location }} />

  // If we are logged in, return whatever this is wrapping
  return children
}