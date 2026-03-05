import { useApp } from '../../context/AppContext'
import { CheckCircle2, Circle, Flame, Plus } from 'lucide-react'
import { useState } from 'react'

function HabitItem({ habit, onToggle }) {
  return (
    <div
      onClick={() => onToggle(habit.id)}
      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl cursor-pointer transition-all duration-200 select-none
        ${habit.doneToday
          ? 'bg-green-500/15 border border-green-500/30'
          : 'bg-bg-primary/50 border border-white/5 hover:border-white/10'
        }`}
    >
      <span className="text-2xl leading-none">{habit.icon}</span>
      <p className={`text-xs font-medium text-center leading-tight ${habit.doneToday ? 'text-accent-green' : 'text-slate-400'}`}>
        {habit.name}
      </p>
      <div className={`flex items-center gap-0.5 text-xs ${habit.doneToday ? 'text-amber-400' : 'text-slate-600'}`}>
        <Flame size={10} />
        <span>{habit.streak}</span>
      </div>
      <div className="mt-0.5">
        {habit.doneToday
          ? <CheckCircle2 size={14} className="text-accent-green" />
          : <Circle size={14} className="text-slate-600" />
        }
      </div>
    </div>
  )
}

export default function HabitsCard() {
  const { habits, toggleHabit, addHabit } = useApp()
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')

  const donePct = habits.length > 0
    ? Math.round((habits.filter(h => h.doneToday).length / habits.length) * 100)
    : 0

  const handleAdd = (e) => {
    e.preventDefault()
    if (newName.trim()) {
      addHabit(newName.trim())
      setNewName('')
      setAdding(false)
    }
  }

  return (
    <div className="glass-card p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-semibold text-white text-sm">Habits</h3>
          <p className="text-xs text-slate-500">{habits.filter(h => h.doneToday).length}/{habits.length} done today</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`text-sm font-bold ${donePct === 100 ? 'text-accent-green' : 'text-slate-400'}`}>
            {donePct}%
          </div>
          <button
            onClick={() => setAdding(a => !a)}
            className="w-7 h-7 rounded-lg bg-bg-tertiary hover:bg-green-500/20 flex items-center justify-center text-slate-500 hover:text-accent-green transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="flex gap-2 animate-slide-up">
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Habit name..."
            className="input-field flex-1 text-xs py-1.5"
            onKeyDown={e => e.key === 'Escape' && setAdding(false)}
          />
          <button type="submit" className="btn-primary text-xs py-1.5 px-3">Add</button>
        </form>
      )}

      <div className="grid grid-cols-5 gap-2 overflow-x-auto">
        {habits.map(habit => (
          <HabitItem key={habit.id} habit={habit} onToggle={toggleHabit} />
        ))}
      </div>

      {/* Progress bar */}
      <div className="progress-bar-track">
        <div
          className="h-full rounded-full progress-green2 transition-all duration-700"
          style={{ width: `${donePct}%` }}
        />
      </div>
    </div>
  )
}
