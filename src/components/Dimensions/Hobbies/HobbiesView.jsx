import { useState, useMemo } from 'react'
import {
  Plus, Edit2, Trash2, CheckCircle, Search,
  Star, Gamepad2, Clock, List, BookMarked,
} from 'lucide-react'
import { useApp } from '../../../context/AppContext'
import Modal from '../../Common/Modal'
import StatCard from '../../Common/StatCard'
import EmptyState from '../../Common/EmptyState'

// ── Constants ─────────────────────────────────────────────────────────────────

const PLATFORMS = ['PC', 'PS5', 'Xbox', 'Switch', 'Mobile']

const PLATFORM_COLORS = {
  PC:     'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  PS5:    'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
  Xbox:   'bg-green-500/20 text-green-400 border border-green-500/30',
  Switch: 'bg-red-500/20 text-red-400 border border-red-500/30',
  Mobile: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
}

const STATUS_COLORS = {
  playing:        'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30',
  completed:      'bg-green-500/20 text-green-400 border border-green-500/30',
  'want-to-play': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  dropped:        'bg-red-500/20 text-red-400 border border-red-500/30',
}

const STATUS_LABELS = {
  playing:        'Playing',
  completed:      'Completed',
  'want-to-play': 'Want to Play',
  dropped:        'Dropped',
}

const TABS = [
  { key: 'playing',   label: 'Playing Now', icon: <Gamepad2 size={14} /> },
  { key: 'library',   label: 'Library',     icon: <List size={14} /> },
  { key: 'completed', label: 'Completed',   icon: <CheckCircle size={14} /> },
  { key: 'wishlist',  label: 'Wishlist',    icon: <BookMarked size={14} /> },
]

const BLANK_FORM = {
  emoji: '🎮',
  title: '',
  platform: 'PC',
  genre: '',
  status: 'playing',
  hoursPlayed: '',
  totalHours: '',
  rating: '',
  startDate: '',
  completionDate: '',
  notes: '',
}

// ── Shared Sub-Components ─────────────────────────────────────────────────────

function PlatformBadge({ platform }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PLATFORM_COLORS[platform] ?? 'bg-slate-700 text-slate-300'}`}>
      {platform}
    </span>
  )
}

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

// ── Game Form Modal ────────────────────────────────────────────────────────────

function GameFormModal({ initial, onSave, onClose }) {
  const isEdit = Boolean(initial)
  const [form, setForm] = useState(initial ?? BLANK_FORM)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave({
      ...form,
      hoursPlayed:    form.hoursPlayed !== '' ? Number(form.hoursPlayed) : 0,
      totalHours:     form.totalHours !== '' ? Number(form.totalHours) : null,
      rating:         form.status === 'completed' && form.rating !== '' ? Number(form.rating) : null,
      startDate:      form.startDate || null,
      completionDate: form.completionDate || null,
    })
  }

  return (
    <Modal title={isEdit ? 'Edit Game' : 'Add Game'} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Emoji + Title */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400 font-medium">Emoji</label>
            <input
              className="input-field w-16 text-center text-xl"
              value={form.emoji}
              onChange={e => set('emoji', e.target.value)}
              maxLength={2}
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-slate-400 font-medium">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              className="input-field"
              placeholder="Game title"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Platform + Genre */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400 font-medium">Platform</label>
            <select
              className="input-field"
              value={form.platform}
              onChange={e => set('platform', e.target.value)}
            >
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400 font-medium">Genre</label>
            <input
              className="input-field"
              placeholder="e.g. RPG, Action…"
              value={form.genre}
              onChange={e => set('genre', e.target.value)}
            />
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 font-medium">Status</label>
          <select
            className="input-field"
            value={form.status}
            onChange={e => set('status', e.target.value)}
          >
            <option value="playing">Playing</option>
            <option value="completed">Completed</option>
            <option value="want-to-play">Want to Play</option>
            <option value="dropped">Dropped</option>
          </select>
        </div>

        {/* Hours */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400 font-medium">Hours Played</label>
            <input
              type="number"
              min="0"
              step="0.5"
              className="input-field"
              placeholder="0"
              value={form.hoursPlayed}
              onChange={e => set('hoursPlayed', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400 font-medium">Total Hours (optional)</label>
            <input
              type="number"
              min="0"
              step="0.5"
              className="input-field"
              placeholder="Main story length"
              value={form.totalHours}
              onChange={e => set('totalHours', e.target.value)}
            />
          </div>
        </div>

        {/* Rating — only if completed */}
        {form.status === 'completed' && (
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-400 font-medium">Rating (1–5)</label>
            <StarPicker
              value={form.rating !== '' ? Number(form.rating) : null}
              onChange={val => set('rating', val ?? '')}
            />
          </div>
        )}

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
          {form.status === 'completed' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400 font-medium">Completion Date</label>
              <input
                type="date"
                className="input-field"
                value={form.completionDate ?? ''}
                onChange={e => set('completionDate', e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 font-medium">Notes</label>
          <textarea
            className="input-field resize-none"
            rows={3}
            placeholder="Thoughts, progress, tips…"
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button type="submit" className="btn-primary">
            {isEdit ? 'Save Changes' : 'Add Game'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ── Playing Now Tab ────────────────────────────────────────────────────────────

function PlayingNowTab({ games, onEdit, onDelete, onMarkComplete }) {
  const playing = games.filter(g => g.status === 'playing')

  if (!playing.length) {
    return (
      <EmptyState
        icon="🎮"
        title="No games in progress"
        subtitle="Start a game from your wishlist or add a new one."
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {playing.map(game => {
        const pct =
          game.totalHours && game.totalHours > 0
            ? Math.min(100, Math.round((game.hoursPlayed / game.totalHours) * 100))
            : null

        return (
          <div key={game.id} className="glass-card glass-card-hover p-5 flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{game.emoji}</span>
                <div>
                  <p className="font-semibold text-white text-sm leading-tight">{game.title}</p>
                  {game.genre && (
                    <p className="text-xs text-slate-500 mt-0.5">{game.genre}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => onEdit(game)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-accent-cyan hover:bg-white/5 transition-colors"
                  title="Edit"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => onDelete(game.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              <PlatformBadge platform={game.platform} />
              {game.genre && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400 border border-slate-600/30">
                  {game.genre}
                </span>
              )}
            </div>

            {/* Hours + progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {game.hoursPlayed}h played
                </span>
                {pct !== null && (
                  <span className="text-accent-cyan font-medium">{pct}%</span>
                )}
              </div>
              {pct !== null && (
                <div className="progress-bar-track">
                  <div
                    className="h-full bg-accent-cyan rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
            </div>

            {/* Notes */}
            {game.notes && (
              <p className="text-xs text-slate-400 italic border-l-2 border-slate-600 pl-2 leading-relaxed line-clamp-3">
                {game.notes}
              </p>
            )}

            {/* Mark Complete */}
            <button
              onClick={() => onMarkComplete(game.id)}
              className="btn-ghost text-xs flex items-center justify-center gap-1.5 mt-auto"
            >
              <CheckCircle size={14} className="text-green-400" />
              Mark Complete
            </button>
          </div>
        )
      })}
    </div>
  )
}

// ── Library Tab ────────────────────────────────────────────────────────────────

function LibraryTab({ games, onEdit, onDelete }) {
  const [search, setSearch] = useState('')
  const [filterPlatform, setFilterPlatform] = useState('All')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return games.filter(g => {
      const matchesSearch =
        g.title.toLowerCase().includes(q) ||
        (g.genre ?? '').toLowerCase().includes(q)
      const matchesPlatform = filterPlatform === 'All' || g.platform === filterPlatform
      return matchesSearch && matchesPlatform
    })
  }, [games, search, filterPlatform])

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            className="input-field pl-9"
            placeholder="Search games or genres…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', ...PLATFORMS].map(p => (
            <button
              key={p}
              onClick={() => setFilterPlatform(p)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border ${
                filterPlatform === p
                  ? 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/40'
                  : 'bg-bg-tertiary text-slate-400 border-slate-700 hover:text-white hover:border-slate-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState icon="🔍" title="No games found" subtitle="Try a different search or filter." />
      ) : (
        <div className="space-y-2">
          {filtered.map(game => (
            <div
              key={game.id}
              className="glass-card glass-card-hover px-4 py-3 flex items-center gap-4"
            >
              <span className="text-2xl shrink-0">{game.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm truncate">{game.title}</p>
                {game.genre && <p className="text-xs text-slate-500">{game.genre}</p>}
              </div>
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <PlatformBadge platform={game.platform} />
                <StatusBadge status={game.status} />
                {game.hoursPlayed > 0 && (
                  <span className="text-xs text-slate-500 hidden sm:inline">
                    {game.hoursPlayed}h
                  </span>
                )}
                {game.rating && <StarRating rating={game.rating} />}
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => onEdit(game)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-accent-cyan hover:bg-white/5 transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => onDelete(game.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Completed Tab ──────────────────────────────────────────────────────────────

function CompletedTab({ games, onEdit, onDelete }) {
  const completed = games.filter(g => g.status === 'completed')

  if (!completed.length) {
    return (
      <EmptyState
        icon="🏆"
        title="No completed games yet"
        subtitle="Finish a game and mark it complete to see it here."
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {completed.map(game => (
        <div key={game.id} className="glass-card glass-card-hover p-5 flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{game.emoji}</span>
              <div>
                <p className="font-semibold text-white text-sm leading-tight">{game.title}</p>
                <div className="mt-1">
                  <PlatformBadge platform={game.platform} />
                </div>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => onEdit(game)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-accent-cyan hover:bg-white/5 transition-colors"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => onDelete(game.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Star rating */}
          {game.rating ? (
            <StarRating rating={game.rating} />
          ) : (
            <span className="text-xs text-slate-600 italic">No rating</span>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
            {game.hoursPlayed > 0 && (
              <span className="flex items-center gap-1">
                <Clock size={11} /> {game.hoursPlayed}h
              </span>
            )}
            {game.completionDate && (
              <span>
                Completed{' '}
                {new Date(game.completionDate).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </span>
            )}
          </div>

          {/* Notes */}
          {game.notes && (
            <p className="text-xs text-slate-400 italic border-l-2 border-green-500/40 pl-2 leading-relaxed line-clamp-3">
              {game.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Wishlist Tab ───────────────────────────────────────────────────────────────

function WishlistTab({ games, onEdit, onDelete, onStartPlaying }) {
  const wishlist = games.filter(g => g.status === 'want-to-play')

  if (!wishlist.length) {
    return (
      <EmptyState
        icon="📋"
        title="Wishlist is empty"
        subtitle="Add games you want to play in the future."
      />
    )
  }

  return (
    <div className="space-y-2">
      {wishlist.map(game => (
        <div
          key={game.id}
          className="glass-card glass-card-hover px-4 py-3 flex items-center gap-4"
        >
          <span className="text-2xl shrink-0">{game.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white text-sm truncate">{game.title}</p>
            {game.genre && <p className="text-xs text-slate-500">{game.genre}</p>}
          </div>
          <div className="shrink-0">
            <PlatformBadge platform={game.platform} />
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => onStartPlaying(game.id)}
              className="btn-primary text-xs py-1.5 px-3"
            >
              Start Playing
            </button>
            <button
              onClick={() => onEdit(game)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-accent-cyan hover:bg-white/5 transition-colors"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => onDelete(game.id)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Main View ─────────────────────────────────────────────────────────────────

export default function HobbiesView() {
  const { games, addGame, updateGame, deleteGame } = useApp()

  const [tab, setTab] = useState('playing')
  const [showForm, setShowForm] = useState(false)
  const [editGame, setEditGame] = useState(null)    // game object being edited
  const [deleteConfirm, setDeleteConfirm] = useState(null) // id pending confirm

  // ── Derived stats ────────────────────────────────────────────────────────────
  const currentYear   = new Date().getFullYear()
  const playingCount  = games.filter(g => g.status === 'playing').length
  const completedCount = games.filter(g => g.status === 'completed').length
  const totalHours    = games.reduce((sum, g) => sum + (g.hoursPlayed || 0), 0)
  const gamesThisYear = games.filter(
    g => g.startDate && new Date(g.startDate).getFullYear() === currentYear,
  ).length

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSave = (data) => {
    if (editGame) {
      updateGame(editGame.id, data)
      setEditGame(null)
    } else {
      addGame(data)
      setShowForm(false)
    }
  }

  const handleEdit = (game) => {
    setEditGame({
      ...game,
      hoursPlayed:    game.hoursPlayed ?? '',
      totalHours:     game.totalHours ?? '',
      rating:         game.rating ?? '',
      startDate:      game.startDate ?? '',
      completionDate: game.completionDate ?? '',
    })
  }

  const handleDelete = (id) => {
    if (deleteConfirm === id) {
      deleteGame(id)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const handleMarkComplete = (id) => {
    updateGame(id, {
      status: 'completed',
      completionDate: new Date().toISOString().slice(0, 10),
    })
  }

  const handleStartPlaying = (id) => {
    updateGame(id, {
      status: 'playing',
      startDate: new Date().toISOString().slice(0, 10),
    })
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">🎮 Hobbies</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track your gaming journey</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Game
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={<Gamepad2 size={16} />}
          label="Currently Playing"
          value={playingCount}
          sub={playingCount === 1 ? '1 game active' : `${playingCount} games active`}
          color="cyan"
        />
        <StatCard
          icon={<CheckCircle size={16} />}
          label="Completed"
          value={completedCount}
          sub="all time"
          color="green"
        />
        <StatCard
          icon={<Clock size={16} />}
          label="Total Hours"
          value={`${totalHours}h`}
          sub="across all games"
          color="purple"
        />
        <StatCard
          icon={<Star size={16} />}
          label="Started This Year"
          value={gamesThisYear}
          sub={`in ${currentYear}`}
          color="amber"
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
      {tab === 'playing' && (
        <PlayingNowTab
          games={games}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMarkComplete={handleMarkComplete}
        />
      )}
      {tab === 'library' && (
        <LibraryTab
          games={games}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {tab === 'completed' && (
        <CompletedTab
          games={games}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {tab === 'wishlist' && (
        <WishlistTab
          games={games}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStartPlaying={handleStartPlaying}
        />
      )}

      {/* Add Modal */}
      {showForm && (
        <GameFormModal
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Edit Modal */}
      {editGame && (
        <GameFormModal
          initial={editGame}
          onSave={handleSave}
          onClose={() => setEditGame(null)}
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
