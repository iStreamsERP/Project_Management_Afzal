import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LogOut,
  Maximize,
  Menu,
  Minimize,
  Moon,
  PanelLeftClose,
  Settings2,
  ShieldCheck,
  Sun,
  Zap,
} from 'lucide-react'
import { useTheme } from '../theme-provider'
import { useAuth } from '../../contexts/AuthContext'
import { useClickOutside } from '../../hooks/useClickOutside'
import { cn } from '../../lib/cn'

type HeaderProps = {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  onOpenMobileMenu: () => void
}

export function Header({ collapsed, setCollapsed, onOpenMobileMenu }: HeaderProps) {
  const { userData, isAdmin, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useClickOutside([menuRef], () => setMenuOpen(false))

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate('/login')
  }

  const displayName = userData?.userName || userData?.userEmail || 'User'
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-surface px-3 py-2.5">
      {/* Left: collapse / mobile menu + brand */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition hover:bg-surface2 hover:text-text-primary md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden h-9 w-9 items-center justify-center rounded-lg text-text-muted transition hover:bg-surface2 hover:text-text-primary md:flex"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <PanelLeftClose className={cn('h-5 w-5 transition-transform', collapsed && 'rotate-180')} />
        </button>

        <div className="flex items-center gap-2 md:hidden">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent1/20 text-accent1">
            <Zap className="h-4 w-4" strokeWidth={2.25} aria-hidden />
          </span>
          <span className="font-semibold tracking-tight text-text-primary">FlowState</span>
        </div>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-1">
        {isAdmin && (
          <span className="hidden items-center gap-1 rounded-full border border-accent2/50 bg-accent2/10 px-3 py-0.5 text-xs font-medium text-accent2 sm:flex">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            Admin
          </span>
        )}

        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition hover:bg-surface2 hover:text-text-primary"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button
          type="button"
          onClick={toggleFullScreen}
          className="hidden h-9 w-9 items-center justify-center rounded-lg text-text-muted transition hover:bg-surface2 hover:text-text-primary md:flex"
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition hover:bg-surface2"
          >
            {userData?.userAvatar ? (
              <img
                src={userData.userAvatar}
                alt={displayName}
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent1 text-xs font-bold text-background">
                {initials}
              </span>
            )}
            <div className="hidden flex-col items-start leading-tight sm:flex">
              <span className="max-w-[140px] truncate text-sm font-medium text-text-primary">{displayName}</span>
              <span className="max-w-[150px] truncate text-xs text-text-muted">{userData?.userEmail}</span>
            </div>
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-40 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-surface shadow-xl shadow-black/30">
              <div className="px-4 py-3">
                <p className="truncate text-sm font-medium text-text-primary">{displayName}</p>
                <p className="truncate text-xs text-text-muted">{userData?.userEmail}</p>
                {userData?.companyName && (
                  <p className="mt-1 truncate text-xs text-text-muted">{userData.companyName}</p>
                )}
              </div>
              <div className="border-t border-border py-1">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    navigate('/settings')
                  }}
                  className="flex w-full items-center justify-between px-4 py-2 text-sm text-text-primary transition hover:bg-surface2"
                >
                  Settings
                  <Settings2 className="h-4 w-4 text-text-muted" />
                </button>
              </div>
              <div className="border-t border-border py-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-between px-4 py-2 text-sm text-accent3 transition hover:bg-accent3/10"
                >
                  Log out
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
