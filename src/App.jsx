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
import { Menu } from 'lucide-react'

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
  aicoach: 'AI Coach ✨',
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
  const today = new Date()
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-bg-secondary/50 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white p-1">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-heading font-bold text-base text-white leading-tight">{title}</h1>
              {view === 'dashboard' && (
                <p className="text-xs text-slate-500">{greeting}, Muath 👋</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:block font-mono">
              {today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-sm font-bold text-white shadow-md shadow-green-500/20">
              M
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 animate-fade-in">
          <Component />
        </main>
      </div>

      {/* Mobile bottom nav */}
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
