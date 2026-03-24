import { useApp } from '../../context/AppContext'
import { CheckCircle2, Circle, Flame, Plus } from 'lucide-react'
import { useState } from 'react'

function HabitItem({ habit, onToggle }) {
  return (
    <div
      onClick={() => onToggle(habit.id)}
      className="flex flex-col items-center gap-1.5 p-3 rounded-xl cursor-pointer transition-all duration-200 select-none"
      style={
        habit.doneToday
          ? {
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.25)',
              boxShadow: '0 0 12px rgba(34,197,94,0.08)',
            }
          : {
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.05)',
            }
      }
    >
      <span className="text-2xl leading-none">{habit.icon}</span>
      <p
        className="text-[10px] font-semibold text-center leading-tight"
        style={{ color: habit.doneToday ? '#22c55e' : 'rgba(148,163,184,0.8)' }}
      >
        {habit.name}
      </p>
      {habit.streak > 0 && (
        <div
          className="flex items-center gap-0.5 text-[10px]"
          style={{ color: habit.doneToday ? '#fbbf24' : 'rgba(100,116,139,0.6)' }}
        >
          <Flame size={9} />
          <span>{habit.streak}</span>
        </div>
      )}
      <div className="mt-0.5">
        {habit.doneToday
          ? <CheckCircle2 size={13} style={{ color: '#22c55e' }} />
          : <Circle size={13} className="text-slate-700" />
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
          <h3 className="font-heading font-semibold text-white text-sm">Daily Habits</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {habits.filter(h => h.doneToday).length}/{habits.length} done today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="text-sm font-bold tabular-nums px-2 py-0.5 rounded-lg"
            style={
              donePct === 100
                ? { color: '#22c55e', background: 'rgba(34,197,94,0.1)' }
                : { color: '#94a3b8', background: 'rgba(255,255,255,0.04)' }
            }
          >
            {donePct}%
          </div>
          <button
            onClick={() => setAdding(a => !a)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-accent-green transition-all duration-150"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', minHeight: 'unset' }}
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="flex gap-2 animate-slide-up">
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="New habit name..."
            className="input-field flex-1 text-xs py-2"
            onKeyDown={e => e.key === 'Escape' && setAdding(false)}
          />
          <button type="submit" className="btn-primary text-xs py-2 px-3" style={{ minHeight: 'unset' }}>Add</button>
        </form>
      )}

      <div className="grid grid-cols-5 gap-2">
        {habits.map(habit => (
          <HabitItem key={habit.id} habit={habit} onToggle={toggleHabit} />
        ))}
      </div>

      <div className="progress-bar-track">
        <div
          className="h-full rounded-full progress-green2 transition-all duration-700"
          style={{
            width: `${donePct}%`,
            boxShadow: donePct > 0 ? '0 0 8px rgba(34,197,94,0.3)' : 'none',
          }}
        />
      </div>
    </div>
  )
}
