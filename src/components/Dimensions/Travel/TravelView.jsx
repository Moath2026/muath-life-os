import { useState, useMemo } from 'react'
import {
  Plus, Edit2, Trash2, Check, ChevronDown, ChevronUp,
  Star, Globe, Calendar, Wallet, MapPin, Clock,
} from 'lucide-react'
import { useApp } from '../../../context/AppContext'
import Modal from '../../Common/Modal'
import StatCard from '../../Common/StatCard'
import EmptyState from '../../Common/EmptyState'
import { genId } from '../../../utils/helpers'

// ── Helpers ───────────────────────────────────────────────────────────────────

function calcDays(startDate, endDate) {
  if (!startDate || !endDate) return null
  const ms = new Date(endDate) - new Date(startDate)
  return Math.max(0, Math.round(ms / 86400000))
}

function fmtDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function fmtDateRange(startDate, endDate) {
  if (!startDate && !endDate) return ''
  if (!endDate) return fmtDate(startDate)
  return `${fmtDate(startDate)} → ${fmtDate(endDate)}`
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_COLORS = {
  booked:    'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30',
  planning:  'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  completed: 'bg-green-500/20 text-green-400 border border-green-500/30',
}

const STATUS_LABELS = {
  booked:    'Booked',
  planning:  'Planning',
  completed: 'Completed',
}

const TABS = [
  { key: 'upcoming',    label: 'Upcoming',    icon: <Calendar size={14} /> },
  { key: 'past',        label: 'Past Trips',  icon: <Globe size={14} /> },
  { key: 'bucket-list', label: 'Bucket List', icon: <MapPin size={14} /> },
]

const BLANK_FORM = {
  destination: '',
  country: '',
  flag: '✈️',
  type: 'upcoming',
  status: 'planning',
  startDate: '',
  endDate: '',
  budget: '',
  notes: '',
  highlights: '',
  rating: '',
}

// ── Shared Components ─────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[status] ?? 'bg-slate-700 text-slate-300'}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

function StarRating({ rating, max = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}
        />
      ))}
    </div>
  )
}

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(null)
  const display = hover ?? value ?? 0
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(value === n ? null : n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(null)}
          className="transition-transform active:scale-90"
        >
          <Star
            size={22}
            className={n <= display ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}
          />
        </button>
      ))}
      {value && <span className="text-xs text-slate-500 ml-1">{value}/5</span>}
    </div>
  )
}

// ── Trip Form Modal ────────────────────────────────────────────────────────────

function TripFormModal({ initial, onSave, onClose }) {
  const isEdit = Boolean(initial)
  const [form, setForm] = useState(initial ?? BLANK_FORM)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.destination.trim()) return
    onSave({
      ...form,
      budget: form.budget !== '' ? Number(form.budget) : null,
      rating: form.type === 'past' && form.rating !== '' ? Number(form.rating) : null,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
    })
  }

  return (
    <Modal title={isEdit ? 'Edit Trip' : 'Add Trip'} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Flag + Destination */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400 font-medium">Flag / Icon</label>
            <input
              className="input-field w-16 text-center text-xl"
              value={form.flag}
              onChange={e => set('flag', e.target.value)}
              maxLength={4}
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-slate-400 font-medium">
              Destination <span className="text-red-400">*</span>
            </label>
            <input
              className="input-field"
              placeholder="City or place name"
              value={form.destination}
              onChange={e => set('destination', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Country */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 font-medium">Country</label>
          <input
            className="input-field"
            placeholder="e.g. Japan"
            value={form.country}
            onChange={e => set('country', e.target.value)}
          />
        </div>

        {/* Type + Status */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400 font-medium">Type</label>
            <select
              className="input-field"
              value={form.type}
              onChange={e => set('type', e.target.value)}
            >
              <option value="upcoming">Upcoming</option>
              <option value="past">Past Trip</option>
              <option value="bucket-list">Bucket List</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400 font-medium">Status</label>
            <select
              className="input-field"
              value={form.status}
              onChange={e => set('status', e.target.value)}
            >
              <option value="planning">Planning</option>
              <option value="booked">Booked</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400 font-medium">Start Date</label>
            <input
              type="date"
              className="input-field"
              value={form.startDate ?? ''}
              onChange={e => set('startDate', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400 font-medium">End Date</label>
            <input
              type="date"
              className="input-field"
              value={form.endDate ?? ''}
              onChange={e => set('endDate', e.target.value)}
            />
          </div>
        </div>

        {/* Budget */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 font-medium">Budget (SAR)</label>
          <input
            type="number"
            min="0"
            className="input-field"
            placeholder="0"
            value={form.budget}
            onChange={e => set('budget', e.target.value)}
          />
        </div>

        {/* Notes / Highlights */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 font-medium">
            {form.type === 'past' ? 'Highlights' : 'Notes'}
          </label>
          <textarea
            className="input-field resize-none"
            rows={3}
            placeholder={
              form.type === 'past'
                ? 'Best moments, food, experiences…'
                : 'Plans, places to visit, tips…'
            }
            value={form.type === 'past' ? form.highlights : form.notes}
            onChange={e =>
              form.type === 'past'
                ? set('highlights', e.target.value)
                : set('notes', e.target.value)
            }
          />
        </div>

        {/* Rating — only if past trip */}
        {form.type === 'past' && (
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-400 font-medium">Rating (1–5)</label>
            <StarPicker
              value={form.rating !== '' ? Number(form.rating) : null}
              onChange={val => set('rating', val ?? '')}
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button type="submit" className="btn-primary">
            {isEdit ? 'Save Changes' : 'Add Trip'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ── Checklist Section ─────────────────────────────────────────────────────────

function ChecklistSection({ trip, onToggle, onAddItem }) {
  const [newItem, setNewItem] = useState('')
  const [adding, setAdding] = useState(false)

  const handleAdd = () => {
    const val = newItem.trim()
    if (!val) return
    onAddItem(trip.id, val)
    setNewItem('')
    setAdding(false)
  }

  const checklist = trip.checklist ?? []
  const done = checklist.filter(c => c.done).length

  return (
    <div className="space-y-2 pt-1">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Checklist {checklist.length > 0 && `(${done}/${checklist.length})`}
        </p>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="text-xs text-accent-cyan hover:text-white transition-colors flex items-center gap-1"
          >
            <Plus size={12} /> Add item
          </button>
        )}
      </div>

      {checklist.length === 0 && !adding && (
        <p className="text-xs text-slate-600 italic">No checklist items yet.</p>
      )}

      <div className="space-y-1.5">
        {checklist.map(item => (
          <label
            key={item.id}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <button
              onClick={() => onToggle(trip.id, item.id)}
              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                item.done
                  ? 'bg-accent-cyan/80 border-accent-cyan'
                  : 'border-slate-600 hover:border-accent-cyan/60'
              }`}
            >
              {item.done && <Check size={10} className="text-bg-primary" />}
            </button>
            <span
              className={`text-sm transition-colors ${
                item.done ? 'line-through text-slate-600' : 'text-slate-300 group-hover:text-white'
              }`}
            >
              {item.item}
            </span>
          </label>
        ))}
      </div>

      {adding && (
        <div className="flex items-center gap-2">
          <input
            className="input-field flex-1 py-1.5 text-sm"
            placeholder="New checklist item…"
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            autoFocus
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); handleAdd() }
              if (e.key === 'Escape') { setAdding(false); setNewItem('') }
            }}
          />
          <button onClick={handleAdd} className="btn-primary py-1.5 px-3 text-xs">
            Add
          </button>
          <button
            onClick={() => { setAdding(false); setNewItem('') }}
            className="btn-ghost py-1.5 px-3 text-xs"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

// ── Upcoming Tab ───────────────────────────────────────────────────────────────

function UpcomingTab({ trips, onEdit, onDelete, onToggleChecklist, onAddChecklistItem }) {
  const upcoming = useMemo(
    () => [...trips.filter(t => t.type === 'upcoming')]
      .sort((a, b) => {
        if (!a.startDate) return 1
        if (!b.startDate) return -1
        return a.startDate.localeCompare(b.startDate)
      }),
    [trips],
  )

  const [expanded, setExpanded] = useState({})
  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  if (!upcoming.length) {
    return (
      <EmptyState
        icon="✈️"
        title="No upcoming trips"
        subtitle="Plan your next adventure and add it here."
      />
    )
  }

  return (
    <div className="space-y-3">
      {upcoming.map((trip, idx) => {
        const days = calcDays(trip.startDate, trip.endDate)
        const isOpen = expanded[trip.id]
        return (
          <div
            key={trip.id}
            className="glass-card glass-card-hover p-5 flex flex-col gap-3"
          >
            {/* Timeline marker + header */}
            <div className="flex items-start gap-4">
              {/* Vertical timeline line */}
              <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
                <div className="w-7 h-7 rounded-full bg-accent-cyan/15 border border-accent-cyan/30 flex items-center justify-center">
                  <span className="text-sm">{trip.flag}</span>
                </div>
                {idx < upcoming.length - 1 && (
                  <div className="w-px h-4 bg-slate-700" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-white text-base leading-tight">
                      {trip.destination}
                    </h3>
                    {trip.country && (
                      <p className="text-xs text-slate-500 mt-0.5">{trip.country}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <StatusBadge status={trip.status} />
                    <button
                      onClick={() => onEdit(trip)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-accent-cyan hover:bg-white/5 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(trip.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-400">
                  {(trip.startDate || trip.endDate) && (
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {fmtDateRange(trip.startDate, trip.endDate)}
                      {days !== null && ` (${days}d)`}
                    </span>
                  )}
                  {trip.budget && (
                    <span className="flex items-center gap-1">
                      <Wallet size={11} />
                      {Number(trip.budget).toLocaleString()} SAR
                    </span>
                  )}
                </div>

                {/* Notes */}
                {trip.notes && (
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed border-l-2 border-slate-600 pl-2">
                    {trip.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Expand / collapse checklist */}
            <button
              onClick={() => toggle(trip.id)}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors self-start ml-11"
            >
              {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {isOpen ? 'Hide checklist' : 'Show checklist'}
            </button>

            {isOpen && (
              <div className="ml-11 border-t border-slate-700/60 pt-3">
                <ChecklistSection
                  trip={trip}
                  onToggle={onToggleChecklist}
                  onAddItem={onAddChecklistItem}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Past Trips Tab ─────────────────────────────────────────────────────────────

function PastTripsTab({ trips, onEdit, onDelete }) {
  const past = useMemo(
    () => [...trips.filter(t => t.type === 'past')]
      .sort((a, b) => {
        if (!a.endDate) return 1
        if (!b.endDate) return -1
        return b.endDate.localeCompare(a.endDate)
      }),
    [trips],
  )

  const [expanded, setExpanded] = useState({})
  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  if (!past.length) {
    return (
      <EmptyState
        icon="🌍"
        title="No past trips recorded"
        subtitle="Add trips you've already been on."
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {past.map(trip => {
        const days = calcDays(trip.startDate, trip.endDate)
        const isOpen = expanded[trip.id]

        return (
          <div
            key={trip.id}
            className="glass-card glass-card-hover p-5 flex flex-col gap-3"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{trip.flag}</span>
                <div>
                  <h3 className="font-semibold text-white text-sm leading-tight">
                    {trip.destination}
                  </h3>
                  {trip.country && (
                    <p className="text-xs text-slate-500 mt-0.5">{trip.country}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => onEdit(trip)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-accent-cyan hover:bg-white/5 transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => onDelete(trip.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Star rating */}
            {trip.rating ? (
              <StarRating rating={trip.rating} />
            ) : (
              <span className="text-xs text-slate-600 italic">No rating</span>
            )}

            {/* Meta */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
              {(trip.startDate || trip.endDate) && (
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {fmtDateRange(trip.startDate, trip.endDate)}
                </span>
              )}
              {days !== null && (
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {days}d
                </span>
              )}
            </div>

            {/* Highlights (truncated, expand on click) */}
            {trip.highlights && (
              <div>
                <p
                  className={`text-xs text-slate-400 leading-relaxed border-l-2 border-accent-cyan/30 pl-2 transition-all ${
                    isOpen ? '' : 'line-clamp-2'
                  }`}
                >
                  {trip.highlights}
                </p>
                {trip.highlights.length > 100 && (
                  <button
                    onClick={() => toggle(trip.id)}
                    className="text-xs text-accent-cyan/70 hover:text-accent-cyan mt-1 transition-colors"
                  >
                    {isOpen ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Bucket List Tab ────────────────────────────────────────────────────────────

function BucketListTab({ trips, onEdit, onDelete, onPlanTrip }) {
  const bucket = useMemo(
    () => trips.filter(t => t.type === 'bucket-list'),
    [trips],
  )

  if (!bucket.length) {
    return (
      <EmptyState
        icon="🌟"
        title="Bucket list is empty"
        subtitle="Add dream destinations you want to visit someday."
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {bucket.map(trip => (
        <div
          key={trip.id}
          className="glass-card glass-card-hover p-5 flex flex-col gap-3"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{trip.flag}</span>
              <div>
                <h3 className="font-semibold text-white text-sm leading-tight">
                  {trip.destination}
                </h3>
                {trip.country && (
                  <p className="text-xs text-slate-500 mt-0.5">{trip.country}</p>
                )}
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => onEdit(trip)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-accent-cyan hover:bg-white/5 transition-colors"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => onDelete(trip.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Budget */}
          {trip.budget && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Wallet size={12} />
              <span>Est. {Number(trip.budget).toLocaleString()} SAR</span>
            </div>
          )}

          {/* Notes */}
          {trip.notes && (
            <p className="text-xs text-slate-400 italic leading-relaxed line-clamp-2 border-l-2 border-slate-600 pl-2">
              {trip.notes}
            </p>
          )}

          {/* Plan Trip */}
          <button
            onClick={() => onPlanTrip(trip.id)}
            className="btn-primary text-xs py-2 flex items-center justify-center gap-1.5 mt-auto"
          >
            <MapPin size={13} /> Plan Trip
          </button>
        </div>
      ))}
    </div>
  )
}

// ── Main View ─────────────────────────────────────────────────────────────────

export default function TravelView() {
  const {
    trips,
    addTrip, updateTrip, deleteTrip,
    toggleChecklist, addChecklistItem,
  } = useApp()

  const [tab, setTab] = useState('upcoming')
  const [showForm, setShowForm] = useState(false)
  const [editTrip, setEditTrip] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // ── Derived stats ────────────────────────────────────────────────────────────
  const pastTrips = trips.filter(t => t.type === 'past')
  const upcomingTrips = trips.filter(t => t.type === 'upcoming')
  const bucketList = trips.filter(t => t.type === 'bucket-list')

  const countriesVisited = useMemo(() => {
    const countries = pastTrips
      .map(t => t.country?.trim())
      .filter(Boolean)
    return new Set(countries).size
  }, [pastTrips])

  const totalDays = useMemo(() => {
    return pastTrips.reduce((sum, t) => {
      const d = calcDays(t.startDate, t.endDate)
      return sum + (d ?? 0)
    }, 0)
  }, [pastTrips])

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSave = (data) => {
    if (editTrip) {
      updateTrip(editTrip.id, data)
      setEditTrip(null)
    } else {
      addTrip(data)
      setShowForm(false)
    }
  }

  const handleEdit = (trip) => {
    setEditTrip({
      ...trip,
      budget:     trip.budget ?? '',
      rating:     trip.rating ?? '',
      startDate:  trip.startDate ?? '',
      endDate:    trip.endDate ?? '',
    })
  }

  const handleDelete = (id) => {
    if (deleteConfirm === id) {
      deleteTrip(id)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const handlePlanTrip = (id) => {
    updateTrip(id, { type: 'upcoming', status: 'planning' })
    setTab('upcoming')
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">✈️ Travel</h1>
          <p className="text-sm text-slate-500 mt-0.5">Your adventures, past and future</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Add Trip
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={<Globe size={16} />}
          label="Countries Visited"
          value={countriesVisited}
          sub="unique countries"
          color="cyan"
        />
        <StatCard
          icon={<Calendar size={16} />}
          label="Upcoming Trips"
          value={upcomingTrips.length}
          sub="planned ahead"
          color="amber"
        />
        <StatCard
          icon={<Clock size={16} />}
          label="Days Traveled"
          value={totalDays}
          sub="total past trip days"
          color="green"
        />
        <StatCard
          icon={<MapPin size={16} />}
          label="Bucket List"
          value={bucketList.length}
          sub="dream destinations"
          color="purple"
        />
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-bg-tertiary rounded-xl p-1 w-fit">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-all ${
              tab === t.key
                ? 'bg-accent-cyan/20 text-accent-cyan shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'upcoming' && (
        <UpcomingTab
          trips={trips}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleChecklist={toggleChecklist}
          onAddChecklistItem={addChecklistItem}
        />
      )}
      {tab === 'past' && (
        <PastTripsTab
          trips={trips}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {tab === 'bucket-list' && (
        <BucketListTab
          trips={trips}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPlanTrip={handlePlanTrip}
        />
      )}

      {/* Add Modal */}
      {showForm && (
        <TripFormModal
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Edit Modal */}
      {editTrip && (
        <TripFormModal
          initial={editTrip}
          onSave={handleSave}
          onClose={() => setEditTrip(null)}
        />
      )}

      {/* Delete confirm toast */}
      {deleteConfirm && (
        <div className="fixed bottom-6 right-6 z-50 glass-card px-4 py-3 flex items-center gap-3 border border-red-500/30 animate-slide-up">
          <span className="text-sm text-slate-300">Click delete again to confirm</span>
          <button
            onClick={() => setDeleteConfirm(null)}
            className="text-xs text-slate-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
