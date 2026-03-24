import { useApp } from '../../context/AppContext'
import { Heart, TrendingDown, Droplets, Dumbbell } from 'lucide-react'

function MiniBar({ value, max, color = 'progress-green2' }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="progress-bar-track mt-1.5">
      <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  )
}

function StatBox({ label, value, unit, sub, trend }) {
  return (
    <div className="card-inner p-3 flex flex-col gap-0.5">
      <p className="text-[11px] text-slate-500 font-medium">{label}</p>
      <p className="font-heading font-bold text-xl text-white">
        {value}<span className="text-sm font-normal text-slate-500 ml-0.5">{unit}</span>
      </p>
      {sub && <p className="text-[11px] text-slate-600 leading-tight">{sub}</p>}
      {trend && (
        <div className="flex items-center gap-0.5 text-emerald-400 mt-0.5">
          <TrendingDown size={10} />
          <span className="text-[10px] font-medium">{trend}</span>
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
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.12)' }}>
            <Heart size={13} className="text-red-400" />
          </div>
          <h3 className="font-heading font-semibold text-white text-sm">Health</h3>
        </div>
        <button
          onClick={onNavigate}
          className="text-xs text-slate-500 hover:text-accent-green transition-colors font-medium"
          style={{ minHeight: 'unset' }}
        >
          View all →
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatBox label="Weight" value={health.weight} unit="kg" sub={`Goal: ${health.weightTarget}kg`} trend="-0.3kg" />
        <StatBox label="Calories" value={health.calories} unit="kcal" sub={`/ ${health.caloriesTarget}`} />
        <StatBox label="Protein" value={health.protein} unit="g" sub={`/ ${health.proteinTarget}g`} />
      </div>

      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Calories</span>
            <span className="text-accent-green tabular-nums">{Math.min(100, Math.round((health.calories / health.caloriesTarget) * 100))}%</span>
          </div>
          <MiniBar value={health.calories} max={health.caloriesTarget} color="progress-amber" />
        </div>
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Protein</span>
            <span className="text-accent-green tabular-nums">{Math.min(100, Math.round((health.protein / health.proteinTarget) * 100))}%</span>
          </div>
          <MiniBar value={health.protein} max={health.proteinTarget} color="progress-sky" />
        </div>
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Weight goal</span>
            <span className="text-accent-green tabular-nums">{Math.max(0, weightPct)}%</span>
          </div>
          <MiniBar value={Math.max(0, weightPct)} max={100} color="progress-green2" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Droplets size={12} className="text-sky-400" />
            <p className="text-xs text-slate-500">Water</p>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: health.waterTarget }).map((_, i) => (
              <div
                key={i}
                className="w-3.5 h-3.5 rounded-sm transition-all duration-300"
                style={{
                  background: i < health.water
                    ? 'linear-gradient(135deg, #38bdf8, #7dd3fc)'
                    : 'rgba(255,255,255,0.05)',
                  boxShadow: i < health.water ? '0 0 6px rgba(56,189,248,0.3)' : 'none',
                }}
              />
            ))}
          </div>
          <p className="text-[10px] text-slate-600 mt-1">{health.water}/{health.waterTarget} glasses</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5 mb-1">
            <Dumbbell size={12} className="text-emerald-400" />
            <p className="text-xs text-slate-500">Workouts</p>
          </div>
          <p className="font-heading font-bold text-xl text-white tabular-nums">
            {health.workoutsThisWeek}<span className="text-sm text-slate-500 font-normal">/{health.workoutsTarget}</span>
          </p>
          <p className="text-[10px] text-slate-600">this week</p>
        </div>
      </div>
    </div>
  )
}
