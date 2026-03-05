import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function CalendarMiniCard({ onNavigate }) {
  const { events } = useApp()
  const today = new Date()
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() })

  const firstDay = new Date(current.year, current.month, 1).getDay()
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate()
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  )

  const eventDates = new Set(events.map(e => {
    const d = new Date(e.date)
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
  }))

  const isToday = (day) =>
    day === today.getDate() && current.month === today.getMonth() && current.year === today.getFullYear()

  const hasEvent = (day) =>
    eventDates.has(`${current.year}-${current.month}-${day}`)

  const prev = () => setCurrent(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 })
  const next = () => setCurrent(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 })

  return (
    <div className="glass-card p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-accent-sky" />
          <h3 className="font-heading font-semibold text-white text-sm">
            {MONTHS[current.month]} {current.year}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={prev} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-bg-tertiary text-slate-500 hover:text-white transition-colors">
            <ChevronLeft size={14} />
          </button>
          <button onClick={next} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-bg-tertiary text-slate-500 hover:text-white transition-colors">
            <ChevronRight size={14} />
          </button>
          <button onClick={onNavigate} className="text-xs text-slate-500 hover:text-accent-green transition-colors ml-1">
            Full →
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0.5">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs text-slate-600 py-1">{d}</div>
        ))}
        {cells.map((day, i) => (
          <div
            key={i}
            className={`cal-day text-xs ${!day ? 'invisible' : ''} ${isToday(day) ? 'today' : ''}`}
          >
            {day}
            {day && hasEvent(day) && (
              <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-accent-green" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
