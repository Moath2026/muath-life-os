import { useApp } from '../context/AppContext'
import { getDailyMotivation } from '../utils/helpers'
import LifeScoreCard from './cards/LifeScoreCard'
import HealthCard from './cards/HealthCard'
import HabitsCard from './cards/HabitsCard'
import FinanceSummaryCard from './cards/FinanceSummaryCard'
import LearningCard from './cards/LearningCard'
import AISuggestionsCard from './cards/AISuggestionsCard'
import QuickActionsCard from './cards/QuickActionsCard'
import CalendarMiniCard from './cards/CalendarMiniCard'
import GoalsCard from './cards/GoalsCard'

export default function Dashboard() {
  const { setView, habits, pomodoro } = useApp()
  const nav = (view) => setView(view)

  const hour = new Date().getHours()
  const greeting = hour < 5 ? 'Good night' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const habitsDone = habits.filter(h => h.doneToday).length
  const topStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0

  return (
    <div className="space-y-4 animate-slide-up pb-20 lg:pb-4">

      {/* ── Greeting Banner ── */}
      <div className="glass-card overflow-hidden relative">
        {/* Ambient glow */}
        <div
          className="absolute -top-10 -left-10 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)' }}
        />
        <div className="relative px-5 py-4">
          <div className="flex items-end justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-1">{today}</p>
              <h2 className="font-heading font-bold text-white text-xl leading-tight">
                {greeting}, <span className="gradient-text-green">Muath</span>
              </h2>
            </div>
            {/* Quick mission stats */}
            <div className="flex gap-2 flex-shrink-0">
              <div
                className="text-center px-3 py-1.5 rounded-xl"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.18)' }}
              >
                <p className="text-sm font-bold text-accent-green leading-none tabular-nums">{habitsDone}/{habits.length}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">habits</p>
              </div>
              <div
                className="text-center px-3 py-1.5 rounded-xl"
                style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.18)' }}
              >
                <p className="text-sm font-bold text-sky-400 leading-none tabular-nums">{pomodoro.today}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">focus</p>
              </div>
              {topStreak > 0 && (
                <div
                  className="text-center px-3 py-1.5 rounded-xl"
                  style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.18)' }}
                >
                  <p className="text-sm font-bold text-amber-400 leading-none tabular-nums">{topStreak}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">streak</p>
                </div>
              )}
            </div>
          </div>

          {/* Quote divider */}
          <div className="mt-3 flex items-start gap-2.5">
            <div
              className="w-0.5 min-h-[28px] rounded-full flex-shrink-0 mt-0.5"
              style={{ background: 'linear-gradient(180deg, rgba(34,197,94,0.6) 0%, rgba(34,197,94,0) 100%)' }}
            />
            <p className="text-xs text-slate-400 italic leading-relaxed">"{getDailyMotivation()}"</p>
          </div>
        </div>
      </div>

      {/* Row 1: Score + Health + Finance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <LifeScoreCard />
        </div>
        <div className="sm:col-span-1 lg:col-span-2">
          <HealthCard onNavigate={() => nav('health')} />
        </div>
        <div className="lg:col-span-1">
          <FinanceSummaryCard onNavigate={() => nav('finance')} />
        </div>
      </div>

      {/* Row 2: Calendar + Habits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CalendarMiniCard onNavigate={() => nav('calendar')} />
        <HabitsCard />
      </div>

      {/* Row 3: Goals + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GoalsCard onNavigate={() => nav('goals')} />
        <QuickActionsCard onNavigate={(view) => nav(view)} />
      </div>

      {/* Row 4: Learning */}
      <LearningCard onNavigate={() => nav('learn')} />

      {/* Row 5: AI Suggestions */}
      <AISuggestionsCard onNavigate={(view) => nav(view)} />

    </div>
  )
}
