import { useApp } from '../../context/AppContext'
import { backupData } from '../../utils/helpers'
import {
  LayoutDashboard, Heart, Timer, BookOpen, Wallet,
  Calendar, Bot, BookMarked, BarChart3, Download, X, Zap, Target,
} from 'lucide-react'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'health',    label: 'Health',    icon: Heart },
  { id: 'focus',     label: 'Focus',     icon: Timer },
  { id: 'goals',     label: 'Goals',     icon: Target },
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
      {/* Backdrop — mobile only */}
      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-50 flex flex-col w-60
          transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
        style={{
          background: 'rgba(10,10,15,0.92)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          /* Account for iOS notch on the left (landscape) */
          paddingLeft: 'env(safe-area-inset-left, 0px)',
        }}
      >
        {/* Logo — safe area top padding for Dynamic Island / status bar */}
        <div
          className="flex items-center justify-between px-4 border-b border-white/5"
          style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)', paddingBottom: 16 }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20"
              style={{ background: 'linear-gradient(135deg, #22c55e, #10b981)' }}
            >
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-white">Muath Life OS</p>
              <p className="text-[10px] text-slate-500 font-mono">v2.0.0</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto scroll-ios">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => navigate(id)}
              className={`nav-item w-full ${view === id ? 'active' : ''}`}
            >
              <Icon size={17} strokeWidth={view === id ? 2.2 : 1.8} />
              {label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div
          className="px-3 border-t border-white/5"
          style={{ paddingTop: 12, paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
        >
          <button onClick={backupData} className="nav-item w-full text-slate-500">
            <Download size={16} />
            Export Data
          </button>
          <div className="px-3 pt-2">
            <p className="text-xs text-slate-600">Riyadh, Saudi Arabia</p>
          </div>
        </div>
      </aside>
    </>
  )
}
