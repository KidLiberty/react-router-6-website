import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className='h-full flex justify-center items-center'>
      <Outlet />
    </div>
  )
}
