import { useApp } from '../context/AppContext'
import LifeScoreCard from './cards/LifeScoreCard'
import HealthCard from './cards/HealthCard'
import HabitsCard from './cards/HabitsCard'
import FinanceSummaryCard from './cards/FinanceSummaryCard'
import LearningCard from './cards/LearningCard'
import AISuggestionsCard from './cards/AISuggestionsCard'
import QuickActionsCard from './cards/QuickActionsCard'
import CalendarMiniCard from './cards/CalendarMiniCard'

export default function Dashboard() {
  const { setView } = useApp()
  const nav = (view) => setView(view)

  return (
    <div className="space-y-4 animate-slide-up pb-20 lg:pb-4">

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

      {/* Row 3: Learning + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LearningCard onNavigate={() => nav('learn')} />
        <QuickActionsCard onNavigate={(view) => nav(view)} />
      </div>

      {/* Row 4: AI Suggestions (full width) */}
      <AISuggestionsCard onNavigate={(view) => nav(view)} />

    </div>
  )
}
