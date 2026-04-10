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
import { BookOpen, Gamepad2, Plane, Brain, ChevronRight, Star, MapPin } from 'lucide-react'

function WellnessMiniCard({ onNavigate }) {
  const { moodLog, sleepLog, meditation } = useApp()
  const todayMood = moodLog[0]
  const avgSleep = sleepLog.slice(0, 7).reduce((s, r) => s + (r.duration || 0), 0) / Math.max(1, Math.min(7, sleepLog.length))
  const medThisWeek = meditation.filter(m => {
    const d = new Date(m.date); const now = new Date()
    return (now - d) < 7 * 86400000
  }).length

  return (
    <div className="glass-card p-4 border border-purple-500/20 bg-purple-500/5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-purple-400" />
          <h3 className="font-heading font-semibold text-white text-sm">Wellness</h3>
        </div>
        <button onClick={onNavigate} className="text-slate-500 hover:text-purple-400 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <p className="text-lg font-bold text-purple-400">{todayMood ? todayMood.mood : '–'}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">Mood</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-cyan-400">{avgSleep > 0 ? avgSleep.toFixed(1) + 'h' : '–'}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">Avg Sleep</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-400">{medThisWeek}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">Med/wk</p>
        </div>
      </div>
    </div>
  )
}

function HobbiesMiniCard({ onNavigate }) {
  const { games } = useApp()
  const playing = games.filter(g => g.status === 'playing').length
  const completed = games.filter(g => g.status === 'completed').length
  const recent = games.filter(g => g.status === 'playing').slice(0, 2)

  return (
    <div className="glass-card p-4 border border-amber-500/20 bg-amber-500/5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Gamepad2 size={16} className="text-amber-400" />
          <h3 className="font-heading font-semibold text-white text-sm">Hobbies</h3>
        </div>
        <button onClick={onNavigate} className="text-slate-500 hover:text-amber-400 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="flex gap-3 mb-2">
        <div className="text-center">
          <p className="text-lg font-bold text-amber-400">{playing}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">Playing</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-400">{completed}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">Done</p>
        </div>
      </div>
      <div className="space-y-1">
        {recent.map(g => (
          <div key={g.id} className="flex items-center gap-2">
            <span className="text-xs">{g.cover || '🎮'}</span>
            <span className="text-xs text-slate-400 truncate flex-1">{g.title}</span>
            {g.rating && <div className="flex items-center gap-0.5"><Star size={10} className="text-amber-400 fill-amber-400" /><span className="text-[10px] text-slate-500">{g.rating}</span></div>}
          </div>
        ))}
      </div>
    </div>
  )
}

function TravelMiniCard({ onNavigate }) {
  const { trips } = useApp()
  const upcoming = trips.filter(t => t.status === 'upcoming').length
  const visited = trips.filter(t => t.status === 'completed').length
  const nextTrip = trips.find(t => t.status === 'upcoming')

  return (
    <div className="glass-card p-4 border border-blue-500/20 bg-blue-500/5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Plane size={16} className="text-blue-400" />
          <h3 className="font-heading font-semibold text-white text-sm">Travel</h3>
        </div>
        <button onClick={onNavigate} className="text-slate-500 hover:text-blue-400 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="flex gap-3 mb-2">
        <div className="text-center">
          <p className="text-lg font-bold text-blue-400">{upcoming}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">Upcoming</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-400">{visited}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">Visited</p>
        </div>
      </div>
      {nextTrip && (
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <MapPin size={11} className="text-blue-400 shrink-0" />
          <span className="truncate">Next: {nextTrip.destination}</span>
        </div>
      )}
    </div>
  )
}

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
        <p className="text-xs text-slate-400 mt-3 italic border-l-2 border-accent-cyan/40 pl-3">
          "{getDailyMotivation()}"
        </p>
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

      {/* Row 2: Goals + Habits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GoalsCard onNavigate={() => nav('goals')} />
        <HabitsCard />
      </div>

      {/* Row 3: Learning + Wellness + Hobbies + Travel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LearningCard onNavigate={() => nav('learn')} />
        <WellnessMiniCard onNavigate={() => nav('wellness')} />
        <HobbiesMiniCard onNavigate={() => nav('hobbies')} />
        <TravelMiniCard onNavigate={() => nav('travel')} />
      </div>

      {/* Row 4: Calendar + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CalendarMiniCard onNavigate={() => nav('calendar')} />
        <QuickActionsCard onNavigate={(view) => nav(view)} />
      </div>

      {/* AI Suggestions (full width) */}
      <AISuggestionsCard onNavigate={(view) => nav(view)} />

    </div>
  )
}
