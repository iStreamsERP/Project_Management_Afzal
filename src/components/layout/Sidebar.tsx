import { forwardRef } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Brain,
  FolderKanban,
  LayoutDashboard,
  Repeat,
  Settings,
  CalendarRange,
  Target,
  Zap,
} from 'lucide-react'
import { cn } from '../../lib/cn'

const navLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/habits', label: 'Habits', icon: Repeat },
  { to: '/mindset', label: 'Mindset', icon: Brain },
  { to: '/goals', label: 'Weekly Goals', icon: Target },
  { to: '/year-in-progress', label: 'Year in Progress', icon: CalendarRange },
  { to: '/settings', label: 'Settings', icon: Settings },
]

type SidebarProps = {
  collapsed: boolean
  mobileOpen: boolean
  autoCloseSidebar: boolean
  setCollapsed: (collapsed: boolean) => void
  setAutoCloseSidebar: (value: boolean) => void
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ collapsed, mobileOpen, autoCloseSidebar, setCollapsed, setAutoCloseSidebar }, ref) => {
    const handleNavClick = () => {
      if (autoCloseSidebar) setCollapsed(true)
    }

    return (
      <aside
        ref={ref}
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col overflow-x-hidden border-r border-border bg-surface transition-all duration-300 ease-out',
          'md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          collapsed ? 'w-[240px] md:w-[72px]' : 'w-[240px]',
        )}
      >
        {/* Logo */}
        <div className={cn('flex items-center gap-2.5 border-b border-border px-3 py-4', collapsed && 'md:justify-center md:px-0')}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent1/20 text-accent1">
            <Zap className="h-5 w-5" strokeWidth={2.25} aria-hidden />
          </span>
          <span className={cn('truncate font-semibold tracking-tight text-text-primary', collapsed && 'md:hidden')}>
            FlowState
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
          {navLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={collapsed ? label : undefined}
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                  collapsed && 'md:justify-center md:px-2',
                  isActive
                    ? 'bg-accent1/25 text-accent1 shadow-[inset_0_0_0_1px_rgba(108,99,255,0.35)]'
                    : 'text-text-muted hover:bg-surface2 hover:text-text-primary',
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
              <span className={cn('truncate', collapsed && 'md:hidden')}>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3">
          <label
            className={cn(
              'flex cursor-pointer items-center gap-2 text-xs text-text-muted',
              collapsed && 'md:justify-center',
            )}
          >
            <input
              type="checkbox"
              checked={autoCloseSidebar}
              onChange={(e) => {
                const checked = e.target.checked
                setAutoCloseSidebar(checked)
                setCollapsed(checked)
              }}
              className="h-4 w-4 cursor-pointer accent-accent1"
            />
            <span className={cn('select-none font-medium', collapsed && 'md:hidden')}>Auto collapse</span>
          </label>
        </div>
      </aside>
    )
  },
)

Sidebar.displayName = 'Sidebar'
