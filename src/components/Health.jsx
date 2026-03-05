import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Scale, Flame, Droplets, Dumbbell, CheckCircle2, PlusCircle } from 'lucide-react'

function StatBox({ icon: Icon, label, value, target, unit, color }) {
  const pct = Math.min(100, Math.round((value / target) * 100))
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} style={{ color }} />
        <span className="text-sm text-slate-400">{label}</span>
      </div>
      <p className="font-heading font-bold text-2xl text-white">
        {value}<span className="text-sm text-slate-500 ml-1">{unit}</span>
      </p>
      <p className="text-xs text-slate-600 mb-2">Target: {target}{unit}</p>
      <div className="h-1.5 bg-bg-primary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <p className="text-xs mt-1" style={{ color }}>{pct}%</p>
    </div>
  )
}

export default function Health() {
  const { health, logHealth } = useApp()
  const [form, setForm] = useState({
    weight: health.weight,
    calories: health.calories,
    protein: health.protein,
    water: health.water,
    workoutDone: false,
  })
  const [saved, setSaved] = useState(false)

  const handleLog = (e) => {
    e.preventDefault()
    logHealth({
      weight: parseFloat(form.weight) || health.weight,
      calories: parseInt(form.calories) || health.calories,
      protein: parseInt(form.protein) || health.protein,
      water: parseInt(form.water) || health.water,
      workoutsThisWeek: form.workoutDone ? health.workoutsThisWeek + 1 : health.workoutsThisWeek,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 animate-slide-up max-w-3xl">
      {/* Today's Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox icon={Scale} label="Weight" value={health.weight} target={health.weightTarget} unit="kg" color="#22c55e" />
        <StatBox icon={Flame} label="Calories" value={health.calories} target={health.caloriesTarget} unit=" kcal" color="#f59e0b" />
        <StatBox icon={PlusCircle} label="Protein" value={health.protein} target={health.proteinTarget} unit="g" color="#38bdf8" />
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Droplets size={16} className="text-sky-400" />
            <span className="text-sm text-slate-400">Water</span>
          </div>
          <p className="font-heading font-bold text-2xl text-white">
            {health.water}<span className="text-sm text-slate-500 ml-1">/ {health.waterTarget}</span>
          </p>
          <div className="flex gap-1 mt-3 flex-wrap">
            {Array.from({ length: health.waterTarget }).map((_, i) => (
              <div key={i} className={`w-5 h-5 rounded-md transition-colors ${i < health.water ? 'bg-sky-400/70' : 'bg-bg-primary'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Workout */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell size={16} className="text-accent-purple" />
            <h3 className="font-heading font-semibold text-white">Workouts This Week</h3>
          </div>
          <span className="font-heading font-bold text-xl text-white">
            {health.workoutsThisWeek}<span className="text-slate-500 font-normal text-sm"> / {health.workoutsTarget}</span>
          </span>
        </div>
        <div className="flex gap-2 mt-4">
          {Array.from({ length: health.workoutsTarget }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-colors ${i < health.workoutsThisWeek ? 'bg-accent-purple' : 'bg-bg-primary'}`}
            />
          ))}
        </div>
      </div>

      {/* Log Today */}
      <div className="glass-card p-5">
        <h3 className="font-heading font-semibold text-white mb-4">Log Today's Data</h3>
        <form onSubmit={handleLog} className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Weight (kg)</label>
              <input
                type="number" step="0.1" min="40" max="200"
                value={form.weight}
                onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Calories (kcal)</label>
              <input
                type="number" min="0" max="5000"
                value={form.calories}
                onChange={e => setForm(f => ({ ...f, calories: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Protein (g)</label>
              <input
                type="number" min="0" max="300"
                value={form.protein}
                onChange={e => setForm(f => ({ ...f, protein: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Water (glasses)</label>
              <input
                type="number" min="0" max="20"
                value={form.water}
                onChange={e => setForm(f => ({ ...f, water: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.workoutDone}
              onChange={e => setForm(f => ({ ...f, workoutDone: e.target.checked }))}
              className="w-4 h-4 accent-green-500"
            />
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
              Completed a workout today 🏋️
            </span>
          </label>

          <button
            type="submit"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 active:scale-95 ${
              saved
                ? 'bg-green-500/20 text-accent-green border border-green-500/30'
                : 'bg-accent-green hover:bg-green-400 text-bg-primary'
            }`}
          >
            {saved ? (
              <><CheckCircle2 size={16} /> Saved!</>
            ) : (
              'Log Today'
            )}
          </button>
        </form>
      </div>

      {/* History */}
      {health.history.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="font-heading font-semibold text-white mb-4">Recent History</h3>
          <div className="space-y-2">
            {health.history.slice(0, 7).map((entry, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-xs text-slate-500 font-mono">{entry.date}</span>
                <div className="flex gap-4 text-xs text-slate-300">
                  <span className="text-white font-medium">{entry.weight}kg</span>
                  <span className="text-amber-400">{entry.calories} kcal</span>
                  <span className="text-sky-400">{entry.protein}g prot</span>
                  <span className="text-sky-300">💧{entry.water}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
