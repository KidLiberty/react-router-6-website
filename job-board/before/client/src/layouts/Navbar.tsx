import { Link } from 'react-router-dom'
import { ChevronDown, Menu, Moon, Sun } from 'lucide-react'

import { useThemeContext } from '@/hooks/useTheme'
import { DropdownMenu, DropdownMenuContent, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { THEME_OPTIONS } from '@/constants/constants'
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { useAuth } from '@/features/authentication'
import { Button } from '../components/ui/button'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className='sticky top-0 p-4 border-b bg-white dark:bg-slate-950 z-10'>
      <div className='container flex justify-between items-center gap-4'>
        <div>WDS App</div>
        <div className='flex items-center'>
          <ThemeToggleButton />
          <div className='hidden sm:flex'>
            <NavItem to='/tasks' label='Task Board' />
            <NavItem to='/jobs' label='Job Listings' />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800'>
                    <span>{user.email}</span>
                    <ChevronDown className='w-4 h-4 ml-2' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='p-2'>
                  <DropdownMenuItem asChild>
                    <Link to='/jobs/my-listings'>My Listings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className='cursor-pointer outline-none' onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <NavItem to='/login' label='Login' />
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className='flex sm:hidden' asChild>
              <Button className='data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800' size='icon' variant='ghost'>
                <Menu className='w-5 h-5' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='flex flex-col p-2' align='end'>
              <DropdownMenuItem asChild>
                <Link to='/tasks'>Task Board</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to='/jobs'>Job Listings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user ? (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger asChild>
                    <span className='mr-auto'>{user.email}</span>
                    <ChevronDown className='w-4 h-4 ml-2' />
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem asChild>
                        <Link to='/jobs/my-listings'>My Listings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              ) : (
                <DropdownMenuItem>
                  <Link to='/login'>Login</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}

type NavItemProps = {
  to: string
  label: string
}

function NavItem({ to, label }: NavItemProps) {
  return (
    <Button asChild variant='ghost'>
      <Link to={to}>{label}</Link>
    </Button>
  )
}

function ThemeToggleButton() {
  const { setTheme } = useThemeContext()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800' size='icon' variant='ghost'>
          <Sun className='w-5 h-5 scale-100 dark:scale-0 transition-transform' />
          <Moon className='absolute h-5 w-5 scale-0 dark:scale-100 transition-transform' />
          <span className='sr-only'>Toggle Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-2' align='end'>
        {THEME_OPTIONS.map(theme => (
          <DropdownMenuItem className='capitalize cursor-pointer' key={theme} onClick={() => setTheme(theme)}>
            {theme}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}