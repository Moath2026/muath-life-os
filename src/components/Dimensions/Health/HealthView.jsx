import { useState, useMemo } from 'react'
import { Plus, Edit2, Trash2, Flame, Activity, Check, X, Droplets, Dumbbell } from 'lucide-react'
import { useApp } from '../../../context/AppContext'
import Modal from '../../Common/Modal'
import StatCard from '../../Common/StatCard'
import EmptyState from '../../Common/EmptyState'
import { todayStr, formatDate } from '../../../utils/helpers'

// ── Constants ─────────────────────────────────────────────────────────────────
const WORKOUT_TYPES = ['Running', 'Gym', 'Cycling', 'Yoga', 'HIIT', 'Swimming', 'Walking']
const INTENSITIES   = ['Low', 'Medium', 'High']

const TYPE_EMOJIS = {
  Running:  '🏃',
  Gym:      '🏋️',
  Cycling:  '🚴',
  Yoga:     '🧘',
  HIIT:     '⚡',
  Swimming: '🏊',
  Walking:  '🚶',
}

const INTENSITY_BADGE = {
  High:   { dot: '🔴', color: 'text-red-400 bg-red-500/10'    },
  Medium: { dot: '🟡', color: 'text-amber-400 bg-amber-500/10' },
  Low:    { dot: '🟢', color: 'text-green-400 bg-green-500/10' },
}

// ── Date helpers ──────────────────────────────────────────────────────────────
function dateOnly(dateStr) {
  // Normalise to YYYY-MM-DD regardless of whether it has time component
  return dateStr ? dateStr.slice(0, 10) : ''
}

function subtractDays(baseDate, n) {
  const d = new Date(baseDate + 'T00:00:00')
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

function getWeekDayDates() {
  // Returns Mon–Sun of the ISO week containing today
  const today = new Date(todayStr() + 'T00:00:00')
  const dow = today.getDay() // 0=Sun … 6=Sat
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dow + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d.toISOString().slice(0, 10)
  })
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// ── Progress Metric Row ───────────────────────────────────────────────────────
function MetricRow({ label, icon, value, target, unit, barClass, editKey, editing, onEdit, onSave, onCancel }) {
  const [input, setInput] = useState(value)
  const pct = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0
  const over = value > target

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="text-sm text-slate-300 font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold tabular-nums ${over ? 'text-green-400' : 'text-white'}`}>
            {value}
          </span>
          <span className="text-xs text-slate-500">/ {target} {unit}</span>
          {!editing && (
            <button
              onClick={() => { setInput(value); onEdit(editKey) }}
              className="p-1 rounded-lg text-slate-500 hover:text-accent-cyan hover:bg-white/5 transition-colors"
            >
              <Edit2 size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="progress-bar-track">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {editing && (
        <div className="flex items-center gap-2 pt-1">
          <input
            type="number"
            className="input-field flex-1 py-2 text-sm"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}...`}
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') onSave(editKey, Number(input)); if (e.key === 'Escape') onCancel() }}
          />
          <button onClick={() => onSave(editKey, Number(input))} className="btn-primary py-2 px-3">
            <Check size={14} />
          </button>
          <button onClick={onCancel} className="btn-ghost py-2 px-3">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

// ── Workout Form Modal ────────────────────────────────────────────────────────
function WorkoutModal({ workout, onSave, onClose }) {
  const isEdit = Boolean(workout)
  const [form, setForm] = useState({
    date: workout?.date ? dateOnly(workout.date) : todayStr(),
    type: 'Gym',
    duration: '',
    intensity: 'Medium',
    calories: '',
    distance: '',
    notes: '',
    ...workout,
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.duration) return
    onSave({
      ...form,
      duration: parseInt(form.duration, 10),
      calories: form.calories ? parseInt(form.calories, 10) : null,
      distance: form.distance ? parseFloat(form.distance) : null,
    })
  }

  return (
    <Modal title={isEdit ? 'Edit Workout' : 'Log Workout'} onClose={onClose} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date + Type */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Date</label>
            <input
              type="date"
              className="input-field"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Type</label>
            <select className="input-field" value={form.type} onChange={e => set('type', e.target.value)}>
              {WORKOUT_TYPES.map(t => (
                <option key={t} value={t}>{TYPE_EMOJIS[t]} {t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Duration + Intensity */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Duration (min) <span className="text-red-400">*</span></label>
            <input
              type="number"
              className="input-field"
              placeholder="60"
              value={form.duration}
              onChange={e => set('duration', e.target.value)}
              min={1}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Intensity</label>
            <select className="input-field" value={form.intensity} onChange={e => set('intensity', e.target.value)}>
              {INTENSITIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        </div>

        {/* Calories + Distance */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Calories (optional)</label>
            <input
              type="number"
              className="input-field"
              placeholder="350"
              value={form.calories ?? ''}
              onChange={e => set('calories', e.target.value)}
              min={0}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Distance km (optional)</label>
            <input
              type="number"
              className="input-field"
              placeholder="5.2"
              value={form.distance ?? ''}
              onChange={e => set('distance', e.target.value)}
              min={0}
              step={0.1}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Notes</label>
          <textarea
            className="input-field resize-none h-20"
            placeholder="How did it go?"
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
          />
        </div>

        <div className="flex gap-3 pt-1">
          <button type="submit" className="btn-primary flex-1">
            {isEdit ? 'Save Changes' : 'Log Workout'}
          </button>
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
        </div>
      </form>
    </Modal>
  )
}

// ── Workout Row ───────────────────────────────────────────────────────────────
function WorkoutRow({ workout, onEdit, onDelete }) {
  const badge = INTENSITY_BADGE[workout.intensity] ?? INTENSITY_BADGE.Medium

  return (
    <div className="glass-card-hover px-4 py-3 flex items-start gap-3">
      {/* Type emoji */}
      <div className="w-9 h-9 rounded-xl bg-accent-cyan/10 border border-accent-cyan/15 flex items-center justify-center text-lg shrink-0 mt-0.5">
        {TYPE_EMOJIS[workout.type] ?? '🏃'}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-heading font-semibold text-white text-sm">{workout.type}</span>
          <span className={`badge ${badge.color}`}>
            {badge.dot} {workout.intensity}
          </span>
          <span className="badge text-slate-400 bg-slate-500/10">
            {workout.duration} min
          </span>
          {workout.calories && (
            <span className="badge text-amber-400 bg-amber-500/10">
              🔥 {workout.calories} kcal
            </span>
          )}
          {workout.distance && (
            <span className="badge text-blue-400 bg-blue-500/10">
              📍 {workout.distance} km
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          {workout.date ? formatDate(dateOnly(workout.date)) : ''}
        </p>
        {workout.notes && (
          <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{workout.notes}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onEdit(workout)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-accent-cyan hover:bg-white/5 transition-colors"
        >
          <Edit2 size={14} />
        </button>
        <button
          onClick={() => onDelete(workout.id)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Weekly Heatmap ────────────────────────────────────────────────────────────
function WeeklyHeatmap({ workouts }) {
  const weekDays = useMemo(() => getWeekDayDates(), [])
  const workoutDates = useMemo(() => {
    const map = {}
    workouts.forEach(w => {
      const d = dateOnly(w.date)
      if (!map[d]) map[d] = []
      map[d].push(w)
    })
    return map
  }, [workouts])

  return (
    <div className="glass-card p-4">
      <h2 className="font-heading font-semibold text-sm text-slate-400 uppercase tracking-wider mb-3">This Week</h2>
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((date, i) => {
          const dayWorkouts = workoutDates[date] ?? []
          const hasWorkout = dayWorkouts.length > 0
          const isToday = date === todayStr()
          const firstType = dayWorkouts[0]?.type

          return (
            <div key={date} className="flex flex-col items-center gap-1.5">
              <span className={`text-xs font-medium ${isToday ? 'text-accent-cyan' : 'text-slate-500'}`}>
                {DAY_LABELS[i]}
              </span>
              <div
                className={`
                  w-full aspect-square rounded-xl flex items-center justify-center text-base
                  transition-all duration-200
                  ${hasWorkout
                    ? 'bg-accent-cyan/15 border border-accent-cyan/35 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : isToday
                      ? 'bg-white/5 border border-accent-cyan/20'
                      : 'bg-white/[0.03] border border-white/5'
                  }
                `}
              >
                {hasWorkout
                  ? <span>{TYPE_EMOJIS[firstType] ?? '💪'}</span>
                  : <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                }
              </div>
              {hasWorkout && (
                <span className="text-xs text-accent-cyan/70 tabular-nums">{dayWorkouts[0].duration}m</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Health Metrics Section ────────────────────────────────────────────────────
function HealthMetrics({ health, logHealth }) {
  const [editingKey, setEditingKey] = useState(null)

  const handleSave = (key, value) => {
    logHealth({ [key]: value })
    setEditingKey(null)
  }

  const metrics = [
    {
      editKey: 'weight',
      label: 'Weight',
      icon: '⚖️',
      value: health.weight,
      target: health.weightTarget,
      unit: 'kg',
      barClass: 'progress-blue',
    },
    {
      editKey: 'calories',
      label: 'Calories',
      icon: '🔥',
      value: health.calories,
      target: health.caloriesTarget,
      unit: 'kcal',
      barClass: 'progress-amber',
    },
    {
      editKey: 'protein',
      label: 'Protein',
      icon: '🥩',
      value: health.protein,
      target: health.proteinTarget,
      unit: 'g',
      barClass: 'progress-purple',
    },
    {
      editKey: 'water',
      label: 'Water',
      icon: '💧',
      value: health.water,
      target: health.waterTarget,
      unit: 'glasses',
      barClass: 'progress-cyan',
    },
  ]

  return (
    <div className="glass-card p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-semibold text-white">Daily Metrics</h2>
        <span className="text-xs text-slate-500">{formatDate(todayStr())}</span>
      </div>
      {metrics.map(m => (
        <MetricRow
          key={m.editKey}
          {...m}
          editing={editingKey === m.editKey}
          onEdit={setEditingKey}
          onSave={handleSave}
          onCancel={() => setEditingKey(null)}
        />
      ))}
    </div>
  )
}

// ── Main View ─────────────────────────────────────────────────────────────────
export default function HealthView() {
  const { workouts, addWorkout, updateWorkout, deleteWorkout, health, logHealth } = useApp()

  const [modal, setModal] = useState(null) // null | 'new' | workout object

  // ── Derived stats ─────────────────────────────────────────────────────────
  const today = todayStr()

  const last30Start = subtractDays(today, 30)
  const workoutsThisMonth = useMemo(
    () => workouts.filter(w => dateOnly(w.date) >= last30Start),
    [workouts, last30Start]
  )

  const totalHours = useMemo(
    () => (workouts.reduce((acc, w) => acc + (w.duration || 0), 0) / 60).toFixed(1),
    [workouts]
  )

  const mostFrequentType = useMemo(() => {
    if (workouts.length === 0) return '—'
    const counts = {}
    workouts.forEach(w => { counts[w.type] = (counts[w.type] || 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
  }, [workouts])

  // Streak: consecutive days from today (inclusive) with at least one workout
  const streak = useMemo(() => {
    const workoutDates = new Set(workouts.map(w => dateOnly(w.date)))
    let count = 0
    let cursor = today
    while (workoutDates.has(cursor)) {
      count++
      cursor = subtractDays(cursor, 1)
    }
    return count
  }, [workouts, today])

  // Recent 14 workouts newest first
  const recentWorkouts = useMemo(
    () => [...workouts]
      .sort((a, b) => dateOnly(b.date).localeCompare(dateOnly(a.date)))
      .slice(0, 14),
    [workouts]
  )

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSave = (form) => {
    if (modal === 'new') {
      addWorkout(form)
    } else {
      updateWorkout(modal.id, form)
    }
    setModal(null)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this workout?')) deleteWorkout(id)
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">Health</h1>
          <p className="text-slate-500 text-sm mt-0.5">Track workouts &amp; daily metrics</p>
        </div>
        <button onClick={() => setModal('new')} className="btn-primary gap-2">
          <Plus size={16} /> Log Workout
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Dumbbell size={15} />}
          label="Workouts (30d)"
          value={workoutsThisMonth.length}
          sub="last 30 days"
          color="cyan"
        />
        <StatCard
          icon={<Flame size={15} />}
          label="Current Streak"
          value={streak === 0 ? '—' : `${streak}d`}
          sub={streak > 0 ? 'consecutive days' : 'no streak yet'}
          color="amber"
        />
        <StatCard
          icon={<Activity size={15} />}
          label="Total Hours"
          value={totalHours}
          sub="all time"
          color="green"
        />
        <StatCard
          icon="🏆"
          label="Top Activity"
          value={mostFrequentType === '—' ? '—' : `${TYPE_EMOJIS[mostFrequentType] ?? ''} ${mostFrequentType}`}
          sub="most frequent"
          color="purple"
        />
      </div>

      {/* ── Weekly Heatmap ── */}
      <WeeklyHeatmap workouts={workouts} />

      {/* ── Health Metrics ── */}
      <HealthMetrics health={health} logHealth={logHealth} />

      {/* ── Recent Workouts ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-semibold text-white">Recent Workouts</h2>
          <span className="text-xs text-slate-500">Last 14</span>
        </div>

        {recentWorkouts.length === 0 ? (
          <EmptyState
            icon="🏋️"
            title="No workouts logged yet"
            subtitle="Start tracking your workouts to see your progress here."
            action="Log Workout"
            onAction={() => setModal('new')}
          />
        ) : (
          <div className="space-y-2">
            {recentWorkouts.map(workout => (
              <WorkoutRow
                key={workout.id}
                workout={workout}
                onEdit={setModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Workout Modal ── */}
      {modal && (
        <WorkoutModal
          workout={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
