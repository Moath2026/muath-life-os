import { useApp } from '../../context/AppContext'
import { backupData } from '../../utils/helpers'
import {
  LayoutDashboard, Heart, Timer, BookOpen, Wallet,
  Calendar, Bot, BookMarked, BarChart3, Download, X, Zap
} from 'lucide-react'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'health',    label: 'Health',    icon: Heart },
  { id: 'focus',     label: 'Focus',     icon: Timer },
  { id: 'learn',     label: 'Learn',     icon: BookOpen },
  { id: 'finance',   label: 'Finance',   icon: Wallet },
  { id: 'calendar',  label: 'Calendar',  icon: Calendar },
  { id: 'aicoach',   label: 'AI Coach',  icon: Bot },
  { id: 'journal',   label: 'Journal',   icon: BookMarked },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
]

export default function Sidebar({ open, onClose }) {
  const { view, setView } = useApp()

  const navigate = (id) => {
    setView(id)
    onClose?.()
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-screen w-60 z-50 flex flex-col
        bg-bg-secondary border-r border-white/5
        transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-white">Muath Life OS</p>
              <p className="text-xs text-slate-500">Personal OS v2</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-500 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => navigate(id)}
              className={`nav-item w-full ${view === id ? 'active' : ''}`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/5 space-y-1">
          <button onClick={backupData} className="nav-item w-full text-slate-500">
            <Download size={16} />
            Export Data
          </button>
          <div className="px-3 pt-2">
            <p className="text-xs text-slate-600">Riyadh, Saudi Arabia 🇸🇦</p>
            <p className="text-xs text-slate-600 font-mono">v2.0.0</p>
          </div>
        </div>
      </aside>
    </>
  )
}
