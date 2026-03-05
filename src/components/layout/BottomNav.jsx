import { useApp } from '../../context/AppContext'
import { LayoutDashboard, Heart, Timer, BookOpen, Wallet } from 'lucide-react'

const NAV = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'health', label: 'Health', icon: Heart },
  { id: 'focus', label: 'Focus', icon: Timer },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'finance', label: 'Money', icon: Wallet },
]

export default function BottomNav() {
  const { view, setView } = useApp()

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-bg-secondary/90 backdrop-blur-md border-t border-white/5 bottom-nav">
      <div className="flex items-stretch">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = view === id
          return (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all duration-150 ${active ? 'text-accent-green' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{label}</span>
              {active && <span className="absolute bottom-0 w-6 h-0.5 rounded-t-full bg-accent-green" />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
