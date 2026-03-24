import { useApp } from '../../context/AppContext'
import { Sparkles } from 'lucide-react'

const TYPE_STYLES = {
  health:   { bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.2)',   dot: '#22c55e' },
  habit:    { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)',  dot: '#f59e0b' },
  focus:    { bg: 'rgba(56,189,248,0.08)',  border: 'rgba(56,189,248,0.2)',  dot: '#38bdf8' },
  learning: { bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)', dot: '#a78bfa' },
  finance:  { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', dot: '#fbbf24' },
}

const ACTION_LABELS = {
  health: 'Log now',
  focus: 'Start →',
  learn: 'Open →',
  finance: 'View →',
}

export default function AISuggestionsCard({ onNavigate }) {
  const { habits, pomodoro, health, skills, finance } = useApp()

  const calPct = Math.round((health.calories / health.caloriesTarget) * 100)
  const healthText = calPct < 50
    ? `Only ${health.calories} kcal logged — you're at ${calPct}% of your target. Log a meal!`
    : calPct < 100
    ? `${health.calories}/${health.caloriesTarget} kcal logged. Keep fueling!`
    : `Calorie target hit! Protein at ${health.protein}/${health.proteinTarget}g.`

  const topStreakHabit = [...habits].sort((a, b) => b.streak - a.streak)[0]
  const pendingHabits = habits.filter(h => !h.doneToday)
  const habitText = pendingHabits.length === 0
    ? 'All habits done today — incredible discipline!'
    : topStreakHabit
    ? `${topStreakHabit.streak}-day ${topStreakHabit.name} streak! ${pendingHabits.length} habit${pendingHabits.length > 1 ? 's' : ''} pending.`
    : `${pendingHabits.length} habit${pendingHabits.length > 1 ? 's' : ''} left to complete today.`

  const inProgressSkill = [...skills]
    .filter(s => s.progress < 100)
    .sort((a, b) => b.progress - a.progress)[0]
  const learningText = inProgressSkill
    ? `Continue ${inProgressSkill.name} — you're ${inProgressSkill.progress}% done!`
    : 'All tracked skills complete. Add a new one!'

  const totalExpenses = finance.expenses.reduce((s, e) => s + e.amount, 0)
  const totalDebt = finance.debts.reduce((s, d) => s + d.monthlyPayment, 0)
  const surplus = finance.monthlyIncome - totalExpenses - totalDebt
  const financeText = surplus > 0
    ? `${surplus.toLocaleString()} SAR surplus this month. On track!`
    : `Outgoing exceeds income by ${Math.abs(surplus).toLocaleString()} SAR. Review expenses.`

  const suggestions = [
    { type: 'health',   icon: '🍽️', text: healthText,   action: 'health' },
    { type: 'habit',    icon: '🔥', text: habitText,    action: null },
    {
      type: 'focus', icon: '🎯',
      text: `${pomodoro.today} focus session${pomodoro.today !== 1 ? 's' : ''} today. ${pomodoro.today === 0 ? 'Start one now?' : pomodoro.today >= 4 ? 'Excellent focus!' : 'Keep pushing!'}`,
      action: 'focus',
    },
    { type: 'learning', icon: '📚', text: learningText, action: 'learn' },
    { type: 'finance',  icon: '💰', text: financeText,  action: 'finance' },
  ]

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={14} className="text-accent-green" />
        <h3 className="font-heading font-semibold text-white text-sm">AI Suggestions</h3>
        <span className="text-[10px] text-slate-600 ml-auto font-medium uppercase tracking-wide">Personalized</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {suggestions.map((s, i) => {
          const style = TYPE_STYLES[s.type]
          return (
            <div
              key={i}
              onClick={() => s.action && onNavigate(s.action)}
              className="flex-shrink-0 flex flex-col gap-2.5 p-3.5 rounded-2xl transition-all duration-150"
              style={{
                background: style.bg,
                border: `1px solid ${style.border}`,
                cursor: s.action ? 'pointer' : 'default',
                minWidth: 180,
                maxWidth: 200,
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg leading-none">{s.icon}</span>
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: style.dot }} />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{s.text}</p>
              {s.action && (
                <span className="text-[11px] font-semibold" style={{ color: style.dot }}>
                  {ACTION_LABELS[s.action] || 'View →'}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
