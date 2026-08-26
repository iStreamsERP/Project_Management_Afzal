import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useClickOutside } from '../../hooks/useClickOutside'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { cn } from '../../lib/cn'

export default function AppShell() {
  const location = useLocation()
  const isMd = useMediaQuery('(min-width: 768px)')
  const [collapsed, setCollapsed] = useState(true)
  const [autoCloseSidebar, setAutoCloseSidebar] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebarRef = useRef<HTMLElement>(null)

  useClickOutside([sidebarRef], () => {
    if (!collapsed && autoCloseSidebar) setCollapsed(true)
  })

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (isMd) setMobileOpen(false)
  }, [isMd])

  return (
    <div className="flex min-h-svh bg-background">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        ref={sidebarRef}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        autoCloseSidebar={autoCloseSidebar}
        setCollapsed={setCollapsed}
        setAutoCloseSidebar={setAutoCloseSidebar}
      />

      <div
        className={cn(
          'flex min-h-svh min-w-0 flex-1 flex-col transition-[margin] duration-300 ease-out',
          collapsed ? 'md:ml-[72px]' : 'md:ml-[240px]',
        )}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} onOpenMobileMenu={() => setMobileOpen(true)} />

        <main className="min-h-0 min-w-0 flex-1 overflow-auto">
          <div
            key={location.pathname}
            className={cn(
              'animate-page-in mx-auto w-full py-5',
              location.pathname === '/' ||
                location.pathname === '/habits' ||
                location.pathname === '/mindset' ||
                location.pathname === '/year-in-progress'
                ? 'max-w-[min(100%,1920px)] px-6 py-2'
                : 'max-w-[1600px] px-3 py-4 md:px-5 md:py-5',
            )}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
