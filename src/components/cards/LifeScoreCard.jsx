import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from 'lucide-react'

function computeScore({ health, habits, pomodoro, skills, finance }) {
  const weightProgress = Math.min(100, Math.round(((79 - health.weight) / (79 - health.weightTarget)) * 100))
  const calPct = Math.min(100, Math.round((health.calories / health.caloriesTarget) * 100))
  const proteinPct = Math.min(100, Math.round((health.protein / health.proteinTarget) * 100))
  const workoutPct = Math.min(100, Math.round((health.workoutsThisWeek / health.workoutsTarget) * 100))
  const healthScore = Math.round((Math.max(0, weightProgress) * 0.3 + calPct * 0.3 + proteinPct * 0.2 + workoutPct * 0.2))

  const habitsDone = habits.filter(h => h.doneToday).length
  const habitsScore = habits.length > 0 ? Math.round((habitsDone / habits.length) * 100) : 0

  const pomScore = Math.min(100, Math.round((pomodoro.today / 4) * 100))

  const aiSkills = skills.filter(s => s.category === 'AI')
  const learnScore = aiSkills.length > 0
    ? Math.round(aiSkills.reduce((s, sk) => s + sk.progress, 0) / aiSkills.length)
    : 0

  const totalExpenses = finance.expenses.reduce((s, e) => s + e.amount, 0)
  const totalDebtPayments = finance.debts.reduce((s, d) => s + d.monthlyPayment, 0)
  const surplus = finance.monthlyIncome - totalExpenses - totalDebtPayments
  const surplusRatio = surplus / (finance.monthlyIncome || 1)
  const financeScore = Math.max(0, Math.min(100, Math.round(50 + surplusRatio * 200)))

  const total = Math.round(
    healthScore * 0.25 +
    pomScore * 0.25 +
    habitsScore * 0.20 +
    learnScore * 0.15 +
    financeScore * 0.15
  )

  return {
    total: Math.min(100, Math.max(0, total)),
    breakdown: [
      { label: 'Health', score: healthScore, weight: '25%', color: '#22c55e' },
      { label: 'Productivity', score: pomScore, weight: '25%', color: '#38bdf8' },
      { label: 'Habits', score: habitsScore, weight: '20%', color: '#a78bfa' },
      { label: 'Learning', score: learnScore, weight: '15%', color: '#8b5cf6' },
      { label: 'Finance', score: financeScore, weight: '15%', color: '#fbbf24' },
    ],
  }
}

function scoreColor(score) {
  if (score >= 81) return '#22c55e'
  if (score >= 61) return '#10b981'
  if (score >= 41) return '#f59e0b'
  return '#ef4444'
}

function scoreStatus(score) {
  if (score >= 81) return { label: 'EXCELLENT', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.2)' }
  if (score >= 61) return { label: 'GOOD', color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.2)' }
  if (score >= 41) return { label: 'FAIR', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.2)' }
  return { label: 'DEVELOPING', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.2)' }
}

export default function LifeScoreCard() {
  const { health, habits, pomodoro, skills, finance } = useApp()
  const [expanded, setExpanded] = useState(false)
  const [weekAgoScore, setWeekAgoScore] = useState(null)
  const { total, breakdown } = computeScore({ health, habits, pomodoro, skills, finance })

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)
    const history = JSON.parse(localStorage.getItem('dashboard_score_history') || '{}')
    history[today] = total
    const cutoff = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)
    Object.keys(history).forEach(d => { if (d < cutoff) delete history[d] })
    localStorage.setItem('dashboard_score_history', JSON.stringify(history))
    setWeekAgoScore(history[weekAgo] ?? null)
  }, [total])

  const trend = weekAgoScore !== null ? total - weekAgoScore : null
  const color = scoreColor(total)
  const status = scoreStatus(total)

  const radius = 60
  const stroke = 7
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (total / 100) * circumference

  return (
    <div
      className="card-accent p-5 flex flex-col items-center cursor-pointer select-none"
      onClick={() => setExpanded(e => !e)}
    >
      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3 font-semibold font-mono">Life Score</p>

      {/* Ring */}
      <div className="relative w-32 h-32">
        <svg width="128" height="128" className="timer-ring">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
          <circle
            cx="64" cy="64" r={radius} fill="none"
            stroke={color} strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="timer-ring-fill"
            style={{ filter: total >= 41 ? `drop-shadow(0 0 6px ${color}90)` : 'none' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading font-bold text-4xl leading-none" style={{ color }}>{total}</span>
          <span className="text-[10px] text-slate-600 mt-0.5 font-mono">/ 100</span>
        </div>
      </div>

      {/* Status badge */}
      <div
        className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider mt-2"
        style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}
      >
        {status.label}
      </div>

      {/* Trend */}
      <div className="mt-2">
        {trend === null ? (
          <div className="flex items-center gap-1 text-slate-600">
            <Minus size={12} />
            <span className="text-[11px]">No prior data</span>
          </div>
        ) : trend > 0 ? (
          <div className="flex items-center gap-1 text-accent-green">
            <TrendingUp size={12} />
            <span className="text-[11px] font-medium">+{trend} vs last week</span>
          </div>
        ) : trend < 0 ? (
          <div className="flex items-center gap-1 text-red-400">
            <TrendingDown size={12} />
            <span className="text-[11px] font-medium">{trend} vs last week</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-slate-500">
            <Minus size={12} />
            <span className="text-[11px]">Same as last week</span>
          </div>
        )}
      </div>

      {/* Breakdown */}
      {expanded && (
        <div className="w-full mt-4 space-y-2.5 animate-slide-up">
          {breakdown.map(({ label, score, weight, color: c }) => (
            <div key={label}>
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span className="font-medium">{label} <span className="text-slate-600 font-normal">({weight})</span></span>
                <span className="font-bold tabular-nums" style={{ color: c }}>{score}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${score}%`, background: `linear-gradient(90deg, ${c}, ${c}bb)` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 text-slate-600">
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </div>
    </div>
  )
}
