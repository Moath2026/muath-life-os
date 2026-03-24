import { Heart, Timer, BookOpen, Target } from 'lucide-react'

const ACTIONS = [
  { icon: Heart, label: 'Health', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.25)', action: 'health' },
  { icon: Timer, label: 'Focus', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)', action: 'focus' },
  { icon: BookOpen, label: 'Journal', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.25)', action: 'journal' },
  { icon: Target, label: 'Goals', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.25)', action: 'goals' },
]

export default function QuickActionsCard({ onNavigate }) {
  return (
    <div className="glass-card p-5 flex flex-col gap-4 h-full">
      <h3 className="font-heading font-semibold text-white text-sm">Quick Actions</h3>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {ACTIONS.map(({ icon: Icon, label, color, bg, border, action }) => (
          <button
            key={label}
            onClick={() => onNavigate(action)}
            className="flex flex-col items-center justify-center gap-2 rounded-xl p-4 transition-all duration-150 active:scale-95 hover:scale-[1.03]"
            style={{ background: bg, border: `1px solid ${border}` }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${color}22` }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <span className="text-xs font-medium text-slate-300">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
