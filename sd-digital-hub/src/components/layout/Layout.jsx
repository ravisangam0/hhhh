import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useDarkMode } from '../../hooks/useDarkMode'
import {
  LayoutDashboard, FileText, Mail, Users, PhoneCall,
  LogOut, Menu, X, Sun, Moon, ChevronRight
} from 'lucide-react'

const NAV = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard',     end: true },
  { to: '/blogs',        icon: FileText,        label: 'Blog Posts' },
  { to: '/contacts',     icon: Mail,            label: 'Contact Forms' },
  { to: '/call-requests',icon: PhoneCall,       label: 'Call Requests' },
  { to: '/subscribers',  icon: Users,           label: 'Subscribers' },
]

export default function Layout() {
  const { user, signOut } = useAuth()
  const [dark, setDark] = useDarkMode()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center shrink-0">
            <span className="font-display font-bold text-primary text-sm">SD</span>
          </div>
          <div>
            <div className="font-display font-bold text-white text-sm leading-tight">SD Digital Hub</div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to} to={to} end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-gold text-primary shadow-md'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-primary' : 'text-white/50 group-hover:text-white'} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-primary/60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <div className="px-3 py-2 text-[11px] text-white/30 truncate">{user?.email}</div>
        <button
          onClick={() => setDark(!dark)}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all"
        >
          {dark ? <Sun size={15} /> : <Moon size={15} />}
          {dark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={signOut}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-primary dark:bg-gray-900 shrink-0 fixed h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-primary flex flex-col z-50">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 lg:ml-60 min-h-screen flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 px-4 lg:px-6 h-14 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <span className="text-xs text-gray-400 hidden sm:block">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </header>

        <div className="flex-1 p-4 lg:p-6 fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
