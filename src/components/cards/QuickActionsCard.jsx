import { Heart, Timer, BookOpen, Target } from 'lucide-react'

const ACTIONS = [
  {
    icon: Heart,
    label: 'Health',
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.14), rgba(16,185,129,0.07))',
    iconBg: 'rgba(34,197,94,0.14)',
    iconColor: '#22c55e',
    border: 'rgba(34,197,94,0.18)',
    glow: 'rgba(34,197,94,0.15)',
    action: 'health',
  },
  {
    icon: Timer,
    label: 'Focus',
    gradient: 'linear-gradient(135deg, rgba(248,113,113,0.14), rgba(239,68,68,0.07))',
    iconBg: 'rgba(239,68,68,0.14)',
    iconColor: '#f87171',
    border: 'rgba(239,68,68,0.18)',
    glow: 'rgba(239,68,68,0.15)',
    action: 'focus',
  },
  {
    icon: BookOpen,
    label: 'Journal',
    gradient: 'linear-gradient(135deg, rgba(56,189,248,0.14), rgba(14,165,233,0.07))',
    iconBg: 'rgba(56,189,248,0.14)',
    iconColor: '#38bdf8',
    border: 'rgba(56,189,248,0.18)',
    glow: 'rgba(56,189,248,0.15)',
    action: 'journal',
  },
  {
    icon: Target,
    label: 'Goals',
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.14), rgba(245,158,11,0.07))',
    iconBg: 'rgba(251,191,36,0.14)',
    iconColor: '#fbbf24',
    border: 'rgba(251,191,36,0.18)',
    glow: 'rgba(251,191,36,0.15)',
    action: 'goals',
  },
]

export default function QuickActionsCard({ onNavigate }) {
  return (
    <div className="glass-card p-5 flex flex-col gap-4 h-full">
      <h3 className="font-heading font-semibold text-white text-sm">Quick Actions</h3>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {ACTIONS.map(({ icon: Icon, label, gradient, iconBg, iconColor, border, glow, action }) => (
          <button
            key={label}
            onClick={() => onNavigate(action)}
            className="flex flex-col items-center justify-center gap-2.5 rounded-2xl p-4 transition-all duration-200 active:scale-95 hover:brightness-110 hover:scale-[1.02]"
            style={{
              background: gradient,
              border: `1px solid ${border}`,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{
                background: iconBg,
                boxShadow: `0 0 16px ${glow}`,
              }}
            >
              <Icon size={20} style={{ color: iconColor }} strokeWidth={1.8} />
            </div>
            <span className="text-xs font-semibold text-slate-200">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
