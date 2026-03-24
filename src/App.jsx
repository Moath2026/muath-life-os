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
    <div className="flex h-dvh overflow-hidden bg-bg-primary">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Header ── */}
        <header
          className="relative flex items-center justify-between shrink-0 header-pad"
          style={{
            background: 'linear-gradient(180deg, rgba(10,10,15,0.96) 0%, rgba(10,10,15,0.88) 100%)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          }}
        >
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white transition-colors -ml-1 p-1.5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0)', minHeight: 36 }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0)'}
              aria-label="Open menu"
            >
              <Menu size={21} />
            </button>

            {/* Logo mark — desktop only */}
            <div className="hidden lg:flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #10b981)',
                  boxShadow: '0 2px 8px rgba(34,197,94,0.3)',
                }}
              >
                <Zap size={13} className="text-white" />
              </div>
            </div>

            {/* Page title */}
            <div>
              <h1 className="font-heading font-bold text-[15px] text-white leading-none tracking-tight">
                {isHome ? 'Life OS' : title}
              </h1>
              {isHome && (
                <p className="text-[10px] text-slate-600 mt-0.5 leading-none hidden sm:block font-mono">
                  Mission Control
                </p>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Active status */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"
                style={{ boxShadow: '0 0 6px rgba(52,211,153,0.8)' }}
              />
              <span className="text-[10px] text-emerald-400 font-semibold tracking-wide">ACTIVE</span>
            </div>

            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white select-none cursor-default"
              style={{
                background: 'linear-gradient(135deg, #22c55e, #10b981)',
                boxShadow: '0 0 0 2px rgba(34,197,94,0.2), 0 2px 8px rgba(34,197,94,0.2)',
              }}
            >
              M
            </div>
          </div>

          {/* Bottom gradient separator */}
          <div
            className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0.07) 80%, transparent 100%)' }}
          />
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
