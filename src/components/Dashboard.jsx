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
  const { setView } = useApp()
  const nav = (view) => setView(view)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-4 animate-slide-up pb-20 lg:pb-4">

      {/* Greeting header */}
      <div className="glass-card px-5 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-heading font-bold text-white text-xl">{greeting}, Muath</h2>
            <p className="text-xs text-slate-500 mt-0.5">{today}</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-3 italic border-l-2 border-accent-green/40 pl-3">
          "{getDailyMotivation()}"
        </p>
      </div>

      {/* Row 1: Score + Health + Finance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Life Score — 1 col */}
        <div className="lg:col-span-1">
          <LifeScoreCard />
        </div>

        {/* Health — 2 cols */}
        <div className="sm:col-span-1 lg:col-span-2">
          <HealthCard onNavigate={() => nav('health')} />
        </div>

        {/* Finance — 1 col */}
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

      {/* Row 4: AI Suggestions (full width) */}
      <AISuggestionsCard onNavigate={(view) => nav(view)} />

    </div>
  )
}
