import { useState, useEffect } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/layout/Sidebar'
import BottomNav from './components/layout/BottomNav'
import Dashboard from './components/Dashboard'
import Goals from './components/Goals'
import Finance from './components/Finance'
import Skills from './components/Skills'
import CalendarView from './components/Calendar'
import Pomodoro from './components/Pomodoro'
import Journal from './components/Journal'
import Analytics from './components/Analytics'
import Health from './components/Health'
import AICoach from './components/AICoach'
import { Menu, Zap } from 'lucide-react'

const VIEWS = {
  dashboard: Dashboard,
  goals: Goals,
  finance: Finance,
  learn: Skills,
  skills: Skills,
  calendar: CalendarView,
  focus: Pomodoro,
  pomodoro: Pomodoro,
  journal: Journal,
  analytics: Analytics,
  health: Health,
  aicoach: AICoach,
}

const VIEW_TITLES = {
  dashboard: 'Dashboard',
  goals: 'Goals',
  finance: 'Finance',
  learn: 'Learn',
  skills: 'Learn',
  calendar: 'Calendar',
  focus: 'Focus',
  pomodoro: 'Focus',
  journal: 'Journal',
  analytics: 'Analytics',
  health: 'Health',
  aicoach: 'AI Coach',
}

function AppInner() {
  const { view } = useApp()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const Component = VIEWS[view] || Dashboard

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 'n') { e.preventDefault(); document.dispatchEvent(new CustomEvent('shortcut:newgoal')) }
      if (e.ctrlKey && e.key === 'p') { e.preventDefault(); document.dispatchEvent(new CustomEvent('shortcut:pomodoro')) }
      if (e.ctrlKey && e.key === 'j') { e.preventDefault(); document.dispatchEvent(new CustomEvent('shortcut:journal')) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const title = VIEW_TITLES[view] || 'Dashboard'
  const isHome = view === 'dashboard'

  return (
    // h-dvh: uses 100dvh which correctly excludes iOS browser chrome
    <div className="flex h-dvh overflow-hidden bg-bg-primary">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Header ── */}
        <header
          className="flex items-center justify-between shrink-0 border-b border-white/5 header-pad"
          style={{
            background: 'rgba(10,10,15,0.85)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          }}
        >
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white transition-colors -ml-1 p-1 rounded-lg hover:bg-white/10"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Logo mark — desktop only (sidebar handles it on mobile via hamburger) */}
            <div className="hidden lg:flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #7c3aed)',
                  boxShadow: '0 0 14px rgba(6,182,212,0.4)',
                }}
              >
                <Zap size={14} className="text-white" />
              </div>
            </div>

            {/* Page title */}
            <h1 className="font-heading font-bold text-base text-white leading-none">
              {isHome ? 'Life OS' : title}
            </h1>
          </div>

          {/* Right side — avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white select-none"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #7c3aed)',
              boxShadow: '0 0 16px rgba(6,182,212,0.3)',
            }}
          >
            M
          </div>
        </header>

        {/* ── Content ── */}
        <main className="flex-1 overflow-y-auto scroll-ios p-4 sm:p-5 animate-fade-in">
          <Component />
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
