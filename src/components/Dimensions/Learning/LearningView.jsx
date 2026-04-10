import { useState } from 'react'
import { Plus, Edit2, Trash2, BookOpen, ChevronRight, Star, Check, X } from 'lucide-react'
import { useApp } from '../../../context/AppContext'
import Modal from '../../Common/Modal'
import StatCard from '../../Common/StatCard'
import EmptyState from '../../Common/EmptyState'
import { genId, formatDate, todayStr } from '../../../utils/helpers'

// ── Constants ─────────────────────────────────────────────────────────────────
const GENRES = ['Self-Help', 'Business', 'Finance', 'Psychology', 'History', 'Philosophy', 'Biography', 'Fiction', 'Other']
const STATUSES = ['reading', 'want-to-read', 'completed']
const STATUS_LABELS = { reading: 'Reading', 'want-to-read': 'Want to Read', completed: 'Completed' }
const TABS = ['reading', 'want-to-read', 'completed']

const GENRE_COLORS = {
  'Self-Help':   'text-cyan-400 bg-cyan-500/10',
  'Business':    'text-blue-400 bg-blue-500/10',
  'Finance':     'text-green-400 bg-green-500/10',
  'Psychology':  'text-purple-400 bg-purple-500/10',
  'History':     'text-amber-400 bg-amber-500/10',
  'Philosophy':  'text-rose-400 bg-rose-500/10',
  'Biography':   'text-orange-400 bg-orange-500/10',
  'Fiction':     'text-indigo-400 bg-indigo-500/10',
  'Other':       'text-slate-400 bg-slate-500/10',
}

// ── Star Rating Display ───────────────────────────────────────────────────────
function StarRating({ rating, interactive = false, onChange }) {
  const [hover, setHover] = useState(null)
  const display = hover ?? rating ?? 0
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          size={14}
          className={`transition-colors ${n <= display ? 'text-amber-400 fill-amber-400' : 'text-slate-600'} ${interactive ? 'cursor-pointer' : ''}`}
          onClick={() => interactive && onChange && onChange(n)}
          onMouseEnter={() => interactive && setHover(n)}
          onMouseLeave={() => interactive && setHover(null)}
        />
      ))}
    </div>
  )
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
function ReadingProgress({ current, total }) {
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0
  return (
    <div className="flex items-center gap-2">
      <div className="progress-bar-track flex-1">
        <div className="h-full progress-blue rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-400 tabular-nums min-w-[3rem] text-right">{current}/{total}</span>
      <span className="text-xs text-accent-cyan tabular-nums min-w-[2.5rem]">{pct}%</span>
    </div>
  )
}

// ── Book Form Modal ───────────────────────────────────────────────────────────
function BookModal({ book, onSave, onClose }) {
  const isEdit = Boolean(book)
  const [form, setForm] = useState({
    emoji: '📚',
    title: '',
    author: '',
    genre: 'Self-Help',
    totalPages: '',
    currentPage: 0,
    status: 'want-to-read',
    rating: null,
    startDate: '',
    completionDate: '',
    notes: '',
    ...book,
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.author.trim()) return
    const payload = {
      ...form,
      totalPages: form.totalPages ? parseInt(form.totalPages, 10) : 0,
      currentPage: form.currentPage ? parseInt(form.currentPage, 10) : 0,
      rating: form.status === 'completed' && form.rating ? parseInt(form.rating, 10) : null,
      startDate: form.status === 'reading' && !form.startDate ? todayStr() : form.startDate || null,
      completionDate: form.status === 'completed' && !form.completionDate ? todayStr() : form.completionDate || null,
    }
    onSave(payload)
  }

  return (
    <Modal title={isEdit ? 'Edit Book' : 'Add Book'} onClose={onClose} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Emoji + Title */}
        <div className="flex gap-3">
          <div className="w-20">
            <label className="text-xs text-slate-500 mb-1 block">Emoji</label>
            <input
              className="input-field text-center text-xl"
              value={form.emoji}
              onChange={e => set('emoji', e.target.value)}
              maxLength={4}
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-slate-500 mb-1 block">Title <span className="text-red-400">*</span></label>
            <input
              className="input-field"
              placeholder="Book title..."
              value={form.title}
              onChange={e => set('title', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Author */}
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Author <span className="text-red-400">*</span></label>
          <input
            className="input-field"
            placeholder="Author name..."
            value={form.author}
            onChange={e => set('author', e.target.value)}
            required
          />
        </div>

        {/* Genre + Status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Genre</label>
            <select className="input-field" value={form.genre} onChange={e => set('genre', e.target.value)}>
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Status</label>
            <select className="input-field" value={form.status} onChange={e => set('status', e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </div>
        </div>

        {/* Pages */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Total Pages</label>
            <input
              type="number"
              className="input-field"
              placeholder="300"
              value={form.totalPages}
              onChange={e => set('totalPages', e.target.value)}
              min={1}
            />
          </div>
          {form.status === 'reading' && (
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Current Page</label>
              <input
                type="number"
                className="input-field"
                placeholder="0"
                value={form.currentPage}
                onChange={e => set('currentPage', e.target.value)}
                min={0}
              />
            </div>
          )}
        </div>

        {/* Rating (only for completed) */}
        {form.status === 'completed' && (
          <div>
            <label className="text-xs text-slate-500 mb-2 block">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set('rating', form.rating === n ? null : n)}
                  className="transition-transform active:scale-90"
                >
                  <Star
                    size={22}
                    className={n <= (form.rating ?? 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}
                  />
                </button>
              ))}
              {form.rating && (
                <span className="text-xs text-slate-500 ml-2">{form.rating}/5</span>
              )}
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Start Date</label>
            <input
              type="date"
              className="input-field"
              value={form.startDate || ''}
              onChange={e => set('startDate', e.target.value)}
            />
          </div>
          {form.status === 'completed' && (
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Completion Date</label>
              <input
                type="date"
                className="input-field"
                value={form.completionDate || ''}
                onChange={e => set('completionDate', e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Notes</label>
          <textarea
            className="input-field resize-none h-20"
            placeholder="Thoughts, key takeaways..."
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
          />
        </div>

        <div className="flex gap-3 pt-1">
          <button type="submit" className="btn-primary flex-1">
            {isEdit ? 'Save Changes' : 'Add Book'}
          </button>
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
        </div>
      </form>
    </Modal>
  )
}

// ── Currently Reading Card ────────────────────────────────────────────────────
function ReadingCard({ book, onEdit, onDelete, onUpdateProgress, onProgressStart, progressEditing, onProgressCancel }) {
  const [pageInput, setPageInput] = useState(book.currentPage)

  const handleSave = () => {
    const p = parseInt(pageInput, 10)
    if (!isNaN(p) && p >= 0) onUpdateProgress(book.id, p)
  }

  return (
    <div className="glass-card-hover p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="text-3xl leading-none mt-0.5">{book.emoji}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-white text-sm leading-snug truncate">{book.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{book.author}</p>
          {book.genre && (
            <span className={`badge mt-1 ${GENRE_COLORS[book.genre] ?? 'text-slate-400 bg-slate-500/10'}`}>
              {book.genre}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(book)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-accent-cyan hover:bg-white/5 transition-colors"
            title="Edit"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(book.id)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Progress */}
      <ReadingProgress current={book.currentPage} total={book.totalPages} />

      {/* Inline progress update */}
      {progressEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            className="input-field flex-1 py-2 text-sm"
            value={pageInput}
            onChange={e => setPageInput(e.target.value)}
            placeholder="Current page"
            min={0}
            max={book.totalPages || undefined}
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onProgressCancel() }}
          />
          <button onClick={handleSave} className="btn-primary py-2 px-3 gap-1.5">
            <Check size={14} /> Save
          </button>
          <button onClick={onProgressCancel} className="btn-ghost py-2 px-3">
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setPageInput(book.currentPage); onProgressStart(book.id) }}
            className="btn-ghost text-xs py-2 flex-1"
          >
            Update Progress
          </button>
          {book.startDate && (
            <span className="text-xs text-slate-500">Started {formatDate(book.startDate)}</span>
          )}
        </div>
      )}

      {/* Notes snippet */}
      {book.notes && (
        <p className="text-xs text-slate-500 italic leading-relaxed line-clamp-2">"{book.notes}"</p>
      )}
    </div>
  )
}

// ── Want-to-Read Row ──────────────────────────────────────────────────────────
function WantToReadRow({ book, onEdit, onDelete, onStartReading }) {
  return (
    <div className="glass-card-hover px-4 py-3 flex items-center gap-3">
      <span className="text-2xl">{book.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-heading font-semibold text-white text-sm truncate">{book.title}</h3>
          {book.genre && (
            <span className={`badge ${GENRE_COLORS[book.genre] ?? 'text-slate-400 bg-slate-500/10'}`}>
              {book.genre}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-0.5">{book.author}</p>
        {book.totalPages > 0 && (
          <p className="text-xs text-slate-500 mt-0.5">{book.totalPages} pages</p>
        )}
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onStartReading(book.id)}
          className="btn-primary text-xs py-1.5 px-3 gap-1"
        >
          <BookOpen size={12} /> Start
        </button>
        <button
          onClick={() => onEdit(book)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-accent-cyan hover:bg-white/5 transition-colors"
        >
          <Edit2 size={14} />
        </button>
        <button
          onClick={() => onDelete(book.id)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Completed Book Card ───────────────────────────────────────────────────────
function CompletedCard({ book, onEdit, onDelete }) {
  return (
    <div className="glass-card-hover p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <span className="text-3xl leading-none">{book.emoji}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(book)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-accent-cyan hover:bg-white/5 transition-colors"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onDelete(book.id)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <div>
        <h3 className="font-heading font-semibold text-white text-sm leading-snug line-clamp-2">{book.title}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{book.author}</p>
      </div>
      {book.rating && <StarRating rating={book.rating} />}
      {book.completionDate && (
        <p className="text-xs text-slate-500">Finished {formatDate(book.completionDate)}</p>
      )}
      {book.notes && (
        <p className="text-xs text-slate-500 italic leading-relaxed line-clamp-2">"{book.notes}"</p>
      )}
    </div>
  )
}

// ── Main View ─────────────────────────────────────────────────────────────────
export default function LearningView() {
  const { books, addBook, updateBook, deleteBook } = useApp()

  const [activeTab, setActiveTab] = useState('reading')
  const [modal, setModal] = useState(null) // null | 'new' | book object
  const [progressEditing, setProgressEditing] = useState(null) // book id

  // ── Derived stats ─────────────────────────────────────────────────────────
  const reading   = books.filter(b => b.status === 'reading')
  const wantToRead = books.filter(b => b.status === 'want-to-read')
  const completed = books.filter(b => b.status === 'completed')

  const pagesRead = completed.reduce((acc, b) => acc + (b.totalPages || 0), 0)

  const ratedBooks = completed.filter(b => b.rating)
  const avgRating = ratedBooks.length > 0
    ? (ratedBooks.reduce((acc, b) => acc + b.rating, 0) / ratedBooks.length).toFixed(1)
    : '—'

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSave = (form) => {
    if (modal === 'new') {
      addBook(form)
    } else {
      updateBook(modal.id, form)
    }
    setModal(null)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this book?')) deleteBook(id)
  }

  const handleStartReading = (id) => {
    updateBook(id, { status: 'reading', startDate: todayStr(), currentPage: 0 })
  }

  const handleUpdateProgress = (id, page) => {
    const book = books.find(b => b.id === id)
    if (!book) return
    const updates = { currentPage: page }
    if (book.totalPages > 0 && page >= book.totalPages) {
      updates.status = 'completed'
      updates.completionDate = todayStr()
    }
    updateBook(id, updates)
    setProgressEditing(null)
  }

  // ── Filtered list ──────────────────────────────────────────────────────────
  const tabBooks = {
    reading: reading,
    'want-to-read': wantToRead,
    completed: [...completed].sort((a, b) => {
      if (!a.completionDate) return 1
      if (!b.completionDate) return -1
      return b.completionDate.localeCompare(a.completionDate)
    }),
  }[activeTab] ?? []

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">Learning</h1>
          <p className="text-slate-500 text-sm mt-0.5">Track your reading journey</p>
        </div>
        <button onClick={() => setModal('new')} className="btn-primary gap-2">
          <Plus size={16} /> Add Book
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon="📖"
          label="Currently Reading"
          value={reading.length}
          sub={`${reading.length === 1 ? '1 book' : `${reading.length} books`} in progress`}
          color="cyan"
        />
        <StatCard
          icon="✅"
          label="Books Completed"
          value={completed.length}
          sub="all time"
          color="green"
        />
        <StatCard
          icon="📄"
          label="Pages Read"
          value={pagesRead.toLocaleString()}
          sub="from completed books"
          color="purple"
        />
        <StatCard
          icon="⭐"
          label="Avg Rating"
          value={avgRating}
          sub={ratedBooks.length > 0 ? `across ${ratedBooks.length} rated` : 'no ratings yet'}
          color="amber"
        />
      </div>

      {/* ── Tab Bar ── */}
      <div className="glass-card p-1 flex gap-1">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-150 ${
              activeTab === tab
                ? 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {STATUS_LABELS[tab]}
            <span className={`ml-2 text-xs ${activeTab === tab ? 'text-accent-cyan/70' : 'text-slate-600'}`}>
              {tab === 'reading' ? reading.length : tab === 'want-to-read' ? wantToRead.length : completed.length}
            </span>
          </button>
        ))}
      </div>

      {/* ── Currently Reading ── */}
      {activeTab === 'reading' && (
        <div className="space-y-3">
          {tabBooks.length === 0 ? (
            <EmptyState
              icon="📚"
              title="No books in progress"
              subtitle="Add a book you're currently reading to track your progress."
              action="Add Book"
              onAction={() => setModal('new')}
            />
          ) : (
            tabBooks.map(book => (
              <ReadingCard
                key={book.id}
                book={book}
                onEdit={setModal}
                onDelete={handleDelete}
                onUpdateProgress={handleUpdateProgress}
                onProgressStart={(id) => setProgressEditing(id)}
                onProgressCancel={() => setProgressEditing(null)}
                progressEditing={progressEditing === book.id}
              />
            ))
          )}
        </div>
      )}

      {/* ── Want to Read ── */}
      {activeTab === 'want-to-read' && (
        <div className="space-y-2">
          {tabBooks.length === 0 ? (
            <EmptyState
              icon="📋"
              title="Reading list is empty"
              subtitle="Add books you want to read next."
              action="Add Book"
              onAction={() => setModal('new')}
            />
          ) : (
            tabBooks.map(book => (
              <WantToReadRow
                key={book.id}
                book={book}
                onEdit={setModal}
                onDelete={handleDelete}
                onStartReading={handleStartReading}
              />
            ))
          )}
        </div>
      )}

      {/* ── Completed ── */}
      {activeTab === 'completed' && (
        <>
          {tabBooks.length === 0 ? (
            <EmptyState
              icon="🏆"
              title="No books completed yet"
              subtitle="Finish reading a book and mark it as completed."
              action="Add Book"
              onAction={() => setModal('new')}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {tabBooks.map(book => (
                <CompletedCard
                  key={book.id}
                  book={book}
                  onEdit={setModal}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Book Modal ── */}
      {modal && (
        <BookModal
          book={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
