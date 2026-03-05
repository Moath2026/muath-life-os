import { useApp } from '../../context/AppContext'
import { Heart, TrendingDown } from 'lucide-react'

function MiniBar({ value, max, color = 'progress-green2' }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="progress-bar-track mt-1.5">
      <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  )
}

function StatBox({ label, value, unit, sub, trend, color = 'text-white' }) {
  return (
    <div className="bg-bg-primary/50 rounded-xl p-3 flex flex-col gap-0.5">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`font-heading font-bold text-xl ${color}`}>
        {value}<span className="text-sm font-normal text-slate-500 ml-0.5">{unit}</span>
      </p>
      {sub && <p className="text-xs text-slate-600">{sub}</p>}
      {trend && (
        <div className="flex items-center gap-0.5 text-accent-green mt-0.5">
          <TrendingDown size={11} />
          <span className="text-xs">{trend}</span>
        </div>
      )}
    </div>
  )
}

export default function HealthCard({ onNavigate }) {
  const { health } = useApp()
  const weightPct = Math.min(100, Math.round(((79 - health.weight) / (79 - health.weightTarget)) * 100))

  return (
    <div className="glass-card p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart size={16} className="text-red-400" />
          <h3 className="font-heading font-semibold text-white text-sm">Health</h3>
        </div>
        <button onClick={onNavigate} className="text-xs text-slate-500 hover:text-accent-green transition-colors">
          View all →
        </button>
      </div>

      {/* 3 stat boxes */}
      <div className="grid grid-cols-3 gap-2">
        <StatBox
          label="Weight"
          value={health.weight}
          unit="kg"
          sub={`Goal: ${health.weightTarget}kg`}
          trend="-0.3kg"
          color="text-white"
        />
        <StatBox
          label="Calories"
          value={health.calories}
          unit="kcal"
          sub={`/ ${health.caloriesTarget}`}
        />
        <StatBox
          label="Protein"
          value={health.protein}
          unit="g"
          sub={`/ ${health.proteinTarget}g`}
        />
      </div>

      {/* Progress bars */}
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Calories</span>
            <span className="text-accent-green">{Math.min(100, Math.round((health.calories / health.caloriesTarget) * 100))}%</span>
          </div>
          <MiniBar value={health.calories} max={health.caloriesTarget} color="progress-amber" />
        </div>
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Protein</span>
            <span className="text-accent-green">{Math.min(100, Math.round((health.protein / health.proteinTarget) * 100))}%</span>
          </div>
          <MiniBar value={health.protein} max={health.proteinTarget} color="progress-sky" />
        </div>
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Weight goal</span>
            <span className="text-accent-green">{Math.max(0, weightPct)}%</span>
          </div>
          <MiniBar value={Math.max(0, weightPct)} max={100} color="progress-green2" />
        </div>
      </div>

      {/* Water + Workouts */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 mb-1.5">Water</p>
          <div className="flex gap-1">
            {Array.from({ length: health.waterTarget }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-sm transition-colors ${i < health.water ? 'bg-sky-400/80' : 'bg-bg-primary'}`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-600 mt-1">{health.water}/{health.waterTarget} glasses</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 mb-1">Workouts</p>
          <p className="font-heading font-bold text-xl text-white">
            {health.workoutsThisWeek}<span className="text-sm text-slate-500">/{health.workoutsTarget}</span>
          </p>
          <p className="text-xs text-slate-600">this week</p>
        </div>
      </div>
    </div>
  )
}
