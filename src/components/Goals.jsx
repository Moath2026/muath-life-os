import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { genId, CATEGORY_COLORS, PRIORITY_COLORS, formatDate } from '../utils/helpers'
import { Plus, X, Check, Trash2, Edit2, ChevronDown, Filter } from 'lucide-react'

const CATEGORIES = ['All', 'AI', 'Finance', 'IELTS', 'Career', 'Habits']
const PRIORITIES = ['High', 'Medium', 'Low']

function GoalModal({ goal, onSave, onClose }) {
  const [form, setForm] = useState(goal || {
    title: '', category: 'AI', priority: 'High',
    dueDate: '', estimatedTime: '', notes: '', completed: false,
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const handleSubmit = (e) => { e.preventDefault(); if (form.title.trim()) onSave(form) }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-card w-full max-w-lg p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-lg text-white">{goal ? 'Edit Goal' : 'New Goal'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="input-field" placeholder="Goal title..." value={form.title} onChange={e => set('title', e.target.value)} required />
          <div className="grid grid-cols-2 gap-3">
            <select className="input-field" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
            </select>
            <select className="input-field" value={form.priority} onChange={e => set('priority', e.target.value)}>
              {PRIORITIES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Due Date</label>
              <input type="date" className="input-field" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Est. Time</label>
              <input className="input-field" placeholder="e.g. 20h" value={form.estimatedTime} onChange={e => set('estimatedTime', e.target.value)} />
            </div>
          </div>
          <textarea className="input-field resize-none h-20" placeholder="Notes..." value={form.notes} onChange={e => set('notes', e.target.value)} />
          <div className="flex gap-3 pt-1">
            <button type="submit" className="btn-primary flex-1">Save Goal</button>
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal, toggleGoal } = useApp()
  const [modal, setModal] = useState(null) // null | 'new' | { ...goal }
  const [filter, setFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [showCompleted, setShowCompleted] = useState(true)
  const [search, setSearch] = useState('')

  // Keyboard shortcut
  useEffect(() => {
    const handler = () => setModal('new')
    document.addEventListener('shortcut:newgoal', handler)
    return () => document.removeEventListener('shortcut:newgoal', handler)
  }, [])

  const filtered = goals.filter(g => {
    if (!showCompleted && g.completed) return false
    if (filter !== 'All' && g.category !== filter) return false
    if (priorityFilter !== 'All' && g.priority !== priorityFilter) return false
    if (search && !g.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a, b) => {
    const pOrder = { High: 0, Medium: 1, Low: 2 }
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    return pOrder[a.priority] - pOrder[b.priority]
  })

  const handleSave = (form) => {
    if (modal === 'new') addGoal(form)
    else updateGoal(modal.id, form)
    setModal(null)
  }

  const stats = {
    total: goals.length,
    done: goals.filter(g => g.completed).length,
    high: goals.filter(g => g.priority === 'High' && !g.completed).length,
  }

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-4">
          <div className="text-center"><p className="font-mono font-bold text-2xl text-white">{stats.total}</p><p className="text-xs text-slate-500">Total</p></div>
          <div className="text-center"><p className="font-mono font-bold text-2xl text-green-400">{stats.done}</p><p className="text-xs text-slate-500">Done</p></div>
          <div className="text-center"><p className="font-mono font-bold text-2xl text-red-400">{stats.high}</p><p className="text-xs text-slate-500">High Priority</p></div>
        </div>
        <button onClick={() => setModal('new')} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Goal <span className="text-xs opacity-60">Ctrl+N</span>
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3 items-center">
        <input className="input-field max-w-48" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filter === c ? 'bg-accent-blue text-white' : 'bg-bg-tertiary text-slate-400 hover:text-white'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {['All', ...PRIORITIES].map(p => (
            <button key={p} onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${priorityFilter === p ? 'bg-purple-600 text-white' : 'bg-bg-tertiary text-slate-400 hover:text-white'}`}>
              {p}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer ml-auto">
          <input type="checkbox" checked={showCompleted} onChange={e => setShowCompleted(e.target.checked)} className="accent-accent-blue" />
          Show completed
        </label>
      </div>

      {/* Goals list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="glass-card p-12 text-center">
            <p className="text-slate-500">No goals match your filter.</p>
            <button onClick={() => setModal('new')} className="btn-primary mt-4 inline-flex items-center gap-2"><Plus size={14} /> Add First Goal</button>
          </div>
        )}
        {filtered.map(goal => (
          <div key={goal.id} className={`glass-card-hover p-4 flex items-start gap-4 border ${goal.completed ? 'border-green-500/20 opacity-60' : 'border-transparent'}`}>
            <button onClick={() => toggleGoal(goal.id)} className={`mt-0.5 w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${goal.completed ? 'bg-green-500 border-green-500' : 'border-slate-600 hover:border-accent-blue'}`}>
              {goal.completed && <Check size={12} className="text-white" />}
            </button>

            <div className="flex-1 min-w-0">
              <p className={`font-medium text-sm ${goal.completed ? 'line-through text-slate-500' : 'text-white'}`}>{goal.title}</p>
              {goal.notes && <p className="text-xs text-slate-500 mt-0.5 truncate">{goal.notes}</p>}
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`badge ${CATEGORY_COLORS[goal.category]}`}>{goal.category}</span>
                <span className={`badge ${PRIORITY_COLORS[goal.priority]}`}>{goal.priority}</span>
                {goal.dueDate && <span className="badge text-slate-400 bg-slate-500/10">📅 {formatDate(goal.dueDate)}</span>}
                {goal.estimatedTime && <span className="badge text-slate-400 bg-slate-500/10">⏱ {goal.estimatedTime}</span>}
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => setModal(goal)} className="p-1.5 rounded-lg hover:bg-bg-tertiary text-slate-500 hover:text-white transition-colors"><Edit2 size={14} /></button>
              <button onClick={() => deleteGoal(goal.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {modal && <GoalModal goal={modal === 'new' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  )
}
