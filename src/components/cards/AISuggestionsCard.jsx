import { useApp } from '../../context/AppContext'
import { Sparkles } from 'lucide-react'

const TYPE_COLORS = {
  health: 'border-green-500/25 bg-green-500/10',
  habit: 'border-amber-500/25 bg-amber-500/10',
  focus: 'border-sky-500/25 bg-sky-500/10',
  learning: 'border-purple-500/25 bg-purple-500/10',
  finance: 'border-yellow-500/25 bg-yellow-500/10',
}

export default function AISuggestionsCard({ onNavigate }) {
  const { habits, pomodoro, health, skills, finance } = useApp()

  const workoutHabit = habits.find(h => h.name === 'Workout')

  // Health suggestion: based on calories logged vs target
  const calPct = Math.round((health.calories / health.caloriesTarget) * 100)
  const healthText = calPct < 50
    ? `Only ${health.calories} kcal logged — you're at ${calPct}% of your target. Log a meal!`
    : calPct < 100
    ? `${health.calories}/${health.caloriesTarget} kcal logged. Keep fueling!`
    : `Calorie target hit! Protein at ${health.protein}/${health.proteinTarget}g.`

  // Habit suggestion: show streak for best active habit
  const topStreakHabit = [...habits].sort((a, b) => b.streak - a.streak)[0]
  const pendingHabits = habits.filter(h => !h.doneToday)
  const habitText = pendingHabits.length === 0
    ? 'All habits done today — incredible discipline!'
    : topStreakHabit
    ? `${topStreakHabit.streak}-day ${topStreakHabit.name} streak! ${pendingHabits.length} habit${pendingHabits.length > 1 ? 's' : ''} still pending today.`
    : `${pendingHabits.length} habit${pendingHabits.length > 1 ? 's' : ''} left to complete today.`

  // Learning: find skill with most progress that isn't done
  const inProgressSkill = [...skills]
    .filter(s => s.progress < 100)
    .sort((a, b) => b.progress - a.progress)[0]
  const learningText = inProgressSkill
    ? `Continue ${inProgressSkill.name} — you're ${inProgressSkill.progress}% done!`
    : 'All tracked skills are complete. Add a new one!'

  // Finance: real surplus/deficit
  const totalExpenses = finance.expenses.reduce((s, e) => s + e.amount, 0)
  const totalDebt = finance.debts.reduce((s, d) => s + d.monthlyPayment, 0)
  const surplus = finance.monthlyIncome - totalExpenses - totalDebt
  const financeText = surplus > 0
    ? `You have ${surplus.toLocaleString()} SAR surplus this month. Staying on track!`
    : `Monthly outgoing exceeds income by ${Math.abs(surplus).toLocaleString()} SAR. Review expenses.`

  const suggestions = [
    { type: 'health', icon: '🍽️', text: healthText, action: 'health' },
    { type: 'habit', icon: '🔥', text: habitText, action: null },
    {
      type: 'focus', icon: '🎯',
      text: `${pomodoro.today} focus session${pomodoro.today !== 1 ? 's' : ''} today. ${pomodoro.today === 0 ? 'Start one?' : pomodoro.today >= 4 ? 'Excellent focus!' : 'Keep going!'}`,
      action: 'focus',
    },
    { type: 'learning', icon: '📚', text: learningText, action: 'learn' },
    { type: 'finance', icon: '💰', text: financeText, action: 'finance' },
  ]

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={15} className="text-accent-green" />
        <h3 className="font-heading font-semibold text-white text-sm">AI Suggestions</h3>
        <span className="text-xs text-slate-600 ml-auto">Personalized for you</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {suggestions.map((s, i) => (
          <div
            key={i}
            onClick={() => s.action && onNavigate(s.action)}
            className={`flex-shrink-0 flex items-start gap-3 p-3 rounded-xl border ${TYPE_COLORS[s.type]} ${s.action ? 'cursor-pointer hover:scale-[1.02]' : ''} transition-all duration-150 max-w-[220px]`}
          >
            <span className="text-xl leading-none mt-0.5">{s.icon}</span>
            <div>
              <p className="text-xs text-slate-300 leading-relaxed">{s.text}</p>
              {s.action && (
                <button className="text-xs text-accent-green mt-1.5 font-medium hover:underline">
                  {s.action === 'health' ? 'Log now' : s.action === 'focus' ? 'Start →' : s.action === 'learn' ? 'Open →' : 'View →'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
