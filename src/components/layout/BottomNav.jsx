import { useApp } from '../../context/AppContext'
import { LayoutDashboard, Heart, Target, BookOpen, Brain } from 'lucide-react'

const NAV = [
  { id: 'dashboard', label: 'Home',     icon: LayoutDashboard },
  { id: 'goals',     label: 'Goals',   icon: Target },
  { id: 'health',    label: 'Health',  icon: Heart },
  { id: 'learn',     label: 'Learn',   icon: BookOpen },
  { id: 'wellness',  label: 'Wellness', icon: Brain },
]

export default function BottomNav() {
  const { view, setView } = useApp()

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bottom-nav-pad"
      style={{
        background: 'rgba(10,10,15,0.88)',
        backdropFilter: 'blur(28px) saturate(200%)',
        WebkitBackdropFilter: 'blur(28px) saturate(200%)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 -4px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div className="flex items-stretch px-1">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = view === id
          return (
            <button
              key={id}
              onClick={() => setView(id)}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 relative transition-all duration-200 select-none"
              style={{ minHeight: 56 }}
            >
              {/* Active indicator pill above icon */}
              <span
                className="absolute top-0 rounded-b-full transition-all duration-300"
                style={{
                  width: active ? 28 : 0,
                  height: 3,
                  background: active ? '#22d3ee' : 'transparent',
                  boxShadow: active ? '0 0 10px rgba(6,182,212,0.7)' : 'none',
                  opacity: active ? 1 : 0,
                }}
              />

              {/* Icon */}
              <div
                className="transition-all duration-200"
                style={{
                  color: active ? '#22d3ee' : 'rgba(100,116,139,0.8)',
                  transform: active ? 'scale(1.08)' : 'scale(1)',
                  filter: active ? 'drop-shadow(0 0 6px rgba(6,182,212,0.5))' : 'none',
                }}
              >
                <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
              </div>

              {/* Label */}
              <span
                className="text-[10px] font-medium leading-none transition-colors duration-200"
                style={{ color: active ? '#22d3ee' : 'rgba(100,116,139,0.7)' }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
