import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, Search, X, Trash2, Edit2, Tag } from 'lucide-react'
import { formatDate } from '../utils/helpers'

const MOODS = ['😊', '😐', '😔', '🤩', '😤', '😴']
const TAGS = ['AI', 'IELTS', 'Finance', 'Career', 'Habits', 'Reflection', 'Win', 'Challenge']

const PROMPTS = [
  'What did I accomplish today?',
  'What did I learn today?',
  'What will I do tomorrow?',
]

function JournalModal({ entry, onSave, onClose }) {
  const [form, setForm] = useState(entry || {
    title: '',
    accomplishments: '',
    learnings: '',
    tomorrowPlan: '',
    mood: '😊',
    tags: [],
    date: new Date().toISOString().slice(0, 10),
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleTag = (tag) => set('tags', form.tags.includes(tag) ? form.tags.filter(t => t !== tag) : [...form.tags, tag])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.accomplishments.trim() && !form.learnings.trim()) return
    onSave(form)
  }

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-card w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-lg text-white">{entry ? 'Edit Entry' : '✍️ New Journal Entry'}</h2>
          <button onClick={onClose}><X size={18} className="text-slate-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3">
            <input type="date" className="input-field flex-1" value={form.date} onChange={e => set('date', e.target.value)} />
            <div className="flex gap-1">
              {MOODS.map(m => (
                <button type="button" key={m} onClick={() => set('mood', m)}
                  className={`mood-btn text-xl ${form.mood === m ? 'selected' : ''}`}>{m}</button>
              ))}
            </div>
          </div>

          {PROMPTS.map((prompt, i) => {
            const keys = ['accomplishments', 'learnings', 'tomorrowPlan']
            return (
              <div key={i}>
                <label className="text-xs text-slate-500 mb-1.5 block">{prompt}</label>
                <textarea
                  className="input-field resize-none h-24"
                  placeholder={prompt}
                  value={form[keys[i]]}
                  onChange={e => set(keys[i], e.target.value)}
                />
              </div>
            )
          })}

          {/* Tags */}
          <div>
            <label className="text-xs text-slate-500 mb-2 block flex items-center gap-1"><Tag size={11} /> Tags</label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map(tag => (
                <button type="button" key={tag} onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${form.tags.includes(tag) ? 'bg-accent-blue text-white' : 'bg-bg-tertiary text-slate-400 hover:text-white'}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">Save Entry</button>
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Journal() {
  const { journal, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useApp()
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState(null)
  const [expanded, setExpanded] = useState(null)

  // Keyboard shortcut
  useEffect(() => {
    const handler = () => setModal('new')
    document.addEventListener('shortcut:journal', handler)
    return () => document.removeEventListener('shortcut:journal', handler)
  }, [])

  const filtered = journal.filter(e => {
    if (search && !`${e.accomplishments} ${e.learnings} ${e.tomorrowPlan}`.toLowerCase().includes(search.toLowerCase())) return false
    if (tagFilter && !e.tags?.includes(tagFilter)) return false
    return true
  })

  const handleSave = (form) => {
    if (modal === 'new') addJournalEntry(form)
    else updateJournalEntry(modal.id, form)
    setModal(null)
  }

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-slate-400 text-sm">{journal.length} total entries</p>
        </div>
        <button onClick={() => setModal('new')} className="btn-primary flex items-center gap-2">
          <Plus size={14} /> New Entry <span className="text-xs opacity-60">Ctrl+J</span>
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-48">
          <Search size={14} className="text-slate-500" />
          <input className="bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none w-full" placeholder="Search entries..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setTagFilter(null)} className={`px-2 py-0.5 rounded-lg text-xs ${!tagFilter ? 'bg-accent-blue text-white' : 'text-slate-500 hover:text-white'}`}>All</button>
          {TAGS.map(tag => (
            <button key={tag} onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              className={`px-2 py-0.5 rounded-lg text-xs transition-colors ${tagFilter === tag ? 'bg-accent-purple text-white' : 'text-slate-500 hover:text-slate-300'}`}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Entries */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-4xl mb-3">📔</p>
          <p className="text-slate-400 mb-1">No journal entries yet.</p>
          <p className="text-slate-600 text-sm mb-4">Start reflecting daily to build self-awareness.</p>
          <button onClick={() => setModal('new')} className="btn-primary inline-flex items-center gap-2"><Plus size={14} /> Write First Entry</button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(entry => (
            <div key={entry.id} className="glass-card-hover p-5 cursor-pointer" onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{entry.mood || '😊'}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{formatDate(entry.date)}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{entry.accomplishments || entry.learnings || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {entry.tags?.slice(0, 2).map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-lg text-xs bg-bg-tertiary text-slate-400">{t}</span>
                  ))}
                  <button onClick={(e) => { e.stopPropagation(); setModal(entry) }} className="text-slate-500 hover:text-white p-1"><Edit2 size={13} /></button>
                  <button onClick={(e) => { e.stopPropagation(); deleteJournalEntry(entry.id) }} className="text-slate-500 hover:text-red-400 p-1"><Trash2 size={13} /></button>
                </div>
              </div>

              {expanded === entry.id && (
                <div className="mt-4 space-y-3 border-t border-white/5 pt-4 animate-fade-in">
                  {[
                    ['🏆 Accomplished', entry.accomplishments],
                    ['💡 Learned', entry.learnings],
                    ['🎯 Tomorrow', entry.tomorrowPlan],
                  ].filter(([, v]) => v).map(([label, value]) => (
                    <div key={label}>
                      <p className="text-xs font-medium text-slate-400 mb-1">{label}</p>
                      <p className="text-sm text-slate-300 whitespace-pre-wrap">{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modal && <JournalModal entry={modal === 'new' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  )
}
