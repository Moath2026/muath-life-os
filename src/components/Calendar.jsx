import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { ChevronLeft, ChevronRight, Plus, X, Plane, BookOpen, DollarSign, Zap, Calendar } from 'lucide-react'

const EVENT_TYPES = [
  { id: 'study',    label: 'Study',    color: 'bg-blue-500',   textColor: 'text-blue-400',   icon: BookOpen },
  { id: 'ai',       label: 'AI Work',  color: 'bg-purple-500', textColor: 'text-purple-400', icon: Zap },
  { id: 'finance',  label: 'Finance',  color: 'bg-green-500',  textColor: 'text-green-400',  icon: DollarSign },
  { id: 'deadline', label: 'Deadline', color: 'bg-red-500',    textColor: 'text-red-400',    icon: Calendar },
  { id: 'flight',   label: 'Flight',   color: 'bg-slate-500',  textColor: 'text-slate-400',  icon: Plane },
]

const TYPE_DOT = { study: 'bg-blue-500', ai: 'bg-purple-500', finance: 'bg-green-500', deadline: 'bg-red-500', flight: 'bg-slate-400' }

function EventModal({ date, onSave, onClose }) {
  const [form, setForm] = useState({ title: '', type: 'study', date: date || '', time: '' })
  const handleSubmit = (e) => { e.preventDefault(); if (form.title) onSave(form) }
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-card w-full max-w-sm p-5 animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-white">Add Event</h3>
          <button onClick={onClose}><X size={16} className="text-slate-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="input-field" placeholder="Event title..." value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          <select className="input-field" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
            {EVENT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input type="date" className="input-field" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
            <input type="time" className="input-field" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="btn-primary flex-1">Save</button>
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CalendarView() {
  const { events, addEvent, deleteEvent } = useApp()
  const [current, setCurrent] = useState(new Date())
  const [modal, setModal] = useState(null) // null | date string
  const [selected, setSelected] = useState(null)

  const year = current.getFullYear()
  const month = current.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date().toISOString().slice(0, 10)

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1))

  const getDateStr = (d) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  const dayEvents = (d) => events.filter(e => e.date === getDateStr(d))

  const selectedDateStr = selected ? getDateStr(selected) : null
  const selectedEvents = selectedDateStr ? events.filter(e => e.date === selectedDateStr) : []

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 glass-card p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-bg-tertiary text-slate-400"><ChevronLeft size={18} /></button>
            <h3 className="font-heading font-bold text-white">{MONTH_NAMES[month]} {year}</h3>
            <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-bg-tertiary text-slate-400"><ChevronRight size={18} /></button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 mb-2">
            {DAY_NAMES.map(d => <div key={d} className="text-center text-xs text-slate-500 py-1">{d}</div>)}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const d = i + 1
              const dateStr = getDateStr(d)
              const evs = dayEvents(d)
              const isToday = dateStr === today
              const isSel = selected === d
              return (
                <div
                  key={d}
                  onClick={() => setSelected(d)}
                  className={`cal-day min-h-[40px] ${isToday ? 'today' : ''} ${isSel && !isToday ? 'bg-bg-tertiary ring-1 ring-accent-blue/40' : ''}`}
                >
                  <span className="text-xs">{d}</span>
                  {evs.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                      {evs.slice(0, 3).map((ev, i) => (
                        <span key={i} className={`w-1.5 h-1.5 rounded-full ${TYPE_DOT[ev.type] || 'bg-slate-400'}`} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/5">
            {EVENT_TYPES.map(t => (
              <span key={t.id} className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className={`w-2 h-2 rounded-full ${t.color}`} />{t.label}
              </span>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <div className="glass-card p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-white">
              {selected ? `${MONTH_NAMES[month]} ${selected}` : 'Select a day'}
            </h3>
            {selected && (
              <button onClick={() => setModal(getDateStr(selected))} className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1">
                <Plus size={12} /> Add
              </button>
            )}
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto">
            {selectedEvents.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">{selected ? 'No events this day.' : 'Click a day to view events.'}</p>
            ) : (
              selectedEvents.map(ev => {
                const type = EVENT_TYPES.find(t => t.id === ev.type)
                const Icon = type?.icon || Calendar
                return (
                  <div key={ev.id} className="flex items-center gap-3 p-3 bg-bg-tertiary rounded-xl group">
                    <Icon size={14} className={type?.textColor || 'text-slate-400'} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{ev.title}</p>
                      {ev.time && <p className="text-xs text-slate-500">{ev.time}</p>}
                    </div>
                    <button onClick={() => deleteEvent(ev.id)} className="opacity-0 group-hover:opacity-100 text-red-400 transition-opacity">
                      <X size={13} />
                    </button>
                  </div>
                )
              })
            )}
          </div>

          {!selected && (
            <button onClick={() => setModal(today)} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
              <Plus size={14} /> Add Today's Event
            </button>
          )}
        </div>
      </div>

      {modal && <EventModal date={modal} onSave={(ev) => { addEvent(ev); setModal(null) }} onClose={() => setModal(null)} />}
    </div>
  )
}
