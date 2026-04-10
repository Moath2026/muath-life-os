import { useState } from 'react'
import { Plus, Trash2, Moon, Activity, Brain, BookOpen } from 'lucide-react'
import { useApp } from '../../../context/AppContext'
import Modal from '../../Common/Modal'
import StatCard from '../../Common/StatCard'
import EmptyState from '../../Common/EmptyState'

const TABS = ['Mood', 'Meditation', 'Sleep', 'Journal']

const MOOD_LABELS = { 1: 'Terrible', 2: 'Very Bad', 3: 'Bad', 4: 'Okay', 5: 'Neutral', 6: 'Good', 7: 'Pretty Good', 8: 'Great', 9: 'Amazing', 10: 'Perfect' }
const MOOD_COLORS = (v) => v >= 8 ? '#22d3ee' : v >= 6 ? '#22c55e' : v >= 4 ? '#f59e0b' : '#ef4444'
const MED_TYPES = ['Mindfulness', 'Breathing', 'Body Scan', 'Guided', 'Sleep']
const SLEEP_QUALITY = ['', '😫', '😴', '😐', '😊', '🌟']

function formatDate(d) {
  if (!d) return ''
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(d))
}

function todayStr() { return new Date().toISOString().slice(0, 10) }

// ── Mood Chart (bar chart, last 14 days) ─────────────────────────────────────
function MoodChart({ entries }) {
  const last14 = [...entries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 14).reverse()
  if (!last14.length) return null
  return (
    <div className="glass-card p-4">
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Mood · Last 14 Days</p>
      <div className="flex items-end gap-1.5 h-20">
        {last14.map(e => (
          <div key={e.id} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t-sm transition-all duration-500"
              style={{ height: `${(e.mood / 10) * 72}px`, background: MOOD_COLORS(e.mood), opacity: 0.8 }}
              title={`${formatDate(e.date)}: ${e.mood}/10`}
            />
            <span className="text-[9px] text-slate-600">{new Date(e.date).getDate()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Log Mood Modal ────────────────────────────────────────────────────────────
function MoodModal({ onClose, existing }) {
  const { logMood } = useApp()
  const [mood, setMood] = useState(existing?.mood ?? 7)
  const [energy, setEnergy] = useState(existing?.energy ?? 7)
  const [notes, setNotes] = useState(existing?.notes ?? '')

  const handleSave = () => {
    logMood({ mood, energy, notes })
    onClose()
  }

  return (
    <Modal title="Log Today's Mood" onClose={onClose} size="sm">
      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Mood</span>
            <span style={{ color: MOOD_COLORS(mood) }} className="font-bold">{mood}/10 — {MOOD_LABELS[mood]}</span>
          </div>
          <input type="range" min={1} max={10} value={mood} onChange={e => setMood(+e.target.value)}
            className="w-full accent-accent-cyan" />
        </div>
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Energy Level</span>
            <span className="font-bold text-accent-cyan">{energy}/10</span>
          </div>
          <input type="range" min={1} max={10} value={energy} onChange={e => setEnergy(+e.target.value)}
            className="w-full accent-accent-cyan" />
        </div>
        <textarea
          className="input-field resize-none h-20"
          placeholder="Any notes about today? (optional)"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
        <div className="flex gap-3">
          <button onClick={handleSave} className="btn-primary flex-1">Save</button>
          <button onClick={onClose} className="btn-ghost">Cancel</button>
        </div>
      </div>
    </Modal>
  )
}

// ── Meditation Modal ──────────────────────────────────────────────────────────
function MeditationModal({ onClose }) {
  const { addMeditation } = useApp()
  const [form, setForm] = useState({ duration: 15, type: 'Mindfulness', notes: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <Modal title="Log Meditation Session" onClose={onClose} size="sm">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Duration (min)</label>
            <input type="number" className="input-field" value={form.duration} min={1} max={120}
              onChange={e => set('duration', +e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Type</label>
            <select className="input-field" value={form.type} onChange={e => set('type', e.target.value)}>
              {MED_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <textarea className="input-field resize-none h-16" placeholder="Notes (optional)"
          value={form.notes} onChange={e => set('notes', e.target.value)} />
        <div className="flex gap-3">
          <button onClick={() => { addMeditation(form); onClose() }} className="btn-primary flex-1">Save Session</button>
          <button onClick={onClose} className="btn-ghost">Cancel</button>
        </div>
      </div>
    </Modal>
  )
}

// ── Sleep Modal ───────────────────────────────────────────────────────────────
function SleepModal({ onClose }) {
  const { logSleep } = useApp()
  const [form, setForm] = useState({ bedtime: '23:00', wakeTime: '07:00', duration: 8, quality: 4 })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const calcDuration = (bed, wake) => {
    const [bh, bm] = bed.split(':').map(Number)
    const [wh, wm] = wake.split(':').map(Number)
    let mins = (wh * 60 + wm) - (bh * 60 + bm)
    if (mins < 0) mins += 24 * 60
    return Math.round((mins / 60) * 10) / 10
  }

  return (
    <Modal title="Log Sleep" onClose={onClose} size="sm">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Bedtime</label>
            <input type="time" className="input-field" value={form.bedtime}
              onChange={e => { set('bedtime', e.target.value); set('duration', calcDuration(e.target.value, form.wakeTime)) }} />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Wake Time</label>
            <input type="time" className="input-field" value={form.wakeTime}
              onChange={e => { set('wakeTime', e.target.value); set('duration', calcDuration(form.bedtime, e.target.value)) }} />
          </div>
        </div>
        <div className="text-center text-accent-cyan font-heading font-bold text-xl">
          {form.duration}h sleep
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-2 block">Sleep Quality</label>
          <div className="flex gap-2 justify-center">
            {[1,2,3,4,5].map(q => (
              <button key={q} onClick={() => set('quality', q)}
                className={`text-2xl p-2 rounded-xl transition-all ${form.quality === q ? 'bg-accent-cyan/20 ring-2 ring-accent-cyan/40' : 'hover:bg-white/5'}`}>
                {SLEEP_QUALITY[q]}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { logSleep(form); onClose() }} className="btn-primary flex-1">Save</button>
          <button onClick={onClose} className="btn-ghost">Cancel</button>
        </div>
      </div>
    </Modal>
  )
}

// ── Journal Modal ─────────────────────────────────────────────────────────────
function JournalModal({ onClose, existing }) {
  const { addJournalEntry, updateJournalEntry } = useApp()
  const [form, setForm] = useState({ title: existing?.title ?? '', content: existing?.content ?? '', mood: existing?.mood ?? '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.content.trim()) return
    if (existing) updateJournalEntry(existing.id, form)
    else addJournalEntry(form)
    onClose()
  }

  return (
    <Modal title={existing ? 'Edit Entry' : 'New Journal Entry'} onClose={onClose} size="md">
      <div className="space-y-4">
        <input className="input-field" placeholder="Title (optional)" value={form.title} onChange={e => set('title', e.target.value)} />
        <textarea className="input-field resize-none h-40" placeholder="What's on your mind today?" value={form.content} onChange={e => set('content', e.target.value)} required />
        <div className="flex gap-3">
          <button onClick={handleSave} className="btn-primary flex-1">Save Entry</button>
          <button onClick={onClose} className="btn-ghost">Cancel</button>
        </div>
      </div>
    </Modal>
  )
}

// ── Main View ─────────────────────────────────────────────────────────────────
export default function WellnessView() {
  const { moodLog, deleteMood, meditation, deleteMeditation, sleepLog, deleteSleep, journal, deleteJournalEntry } = useApp()
  const [tab, setTab] = useState('Mood')
  const [modal, setModal] = useState(null)

  // Stats calculations
  const todayMood = moodLog.find(m => m.date === todayStr())
  const avgMood = moodLog.length ? Math.round(moodLog.slice(0, 7).reduce((s, m) => s + m.mood, 0) / Math.min(moodLog.length, 7) * 10) / 10 : 0

  const totalMedMin = meditation.reduce((s, m) => s + m.duration, 0)
  const medStreak = (() => {
    let streak = 0
    let d = new Date()
    for (let i = 0; i < 30; i++) {
      const ds = d.toISOString().slice(0, 10)
      if (meditation.some(m => m.date === ds)) streak++
      else if (i > 0) break
      d.setDate(d.getDate() - 1)
    }
    return streak
  })()

  const avgSleep = sleepLog.length ? Math.round(sleepLog.slice(0, 7).reduce((s, r) => s + r.duration, 0) / Math.min(sleepLog.length, 7) * 10) / 10 : 0
  const avgQuality = sleepLog.length ? Math.round(sleepLog.slice(0, 7).reduce((s, r) => s + r.quality, 0) / Math.min(sleepLog.length, 7) * 10) / 10 : 0

  return (
    <div className="space-y-5 animate-slide-up pb-20 lg:pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-xl text-white">Wellness</h2>
          <p className="text-xs text-slate-500 mt-0.5">Mind, body & soul tracking</p>
        </div>
        <button
          onClick={() => setModal(tab === 'Mood' ? 'mood' : tab === 'Meditation' ? 'meditation' : tab === 'Sleep' ? 'sleep' : 'journal')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={15} /> Log {tab}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon="😊" label="Avg Mood (7d)" value={`${avgMood}/10`} color={avgMood >= 7 ? 'cyan' : avgMood >= 5 ? 'amber' : 'red'} />
        <StatCard icon="🧘" label="Meditation Streak" value={`${medStreak} days`} color="purple" />
        <StatCard icon="😴" label="Avg Sleep (7d)" value={`${avgSleep}h`} color={avgSleep >= 7.5 ? 'green' : 'amber'} />
        <StatCard icon="📓" label="Journal Entries" value={journal.length} color="blue" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass-card w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${tab === t ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30' : 'text-slate-500 hover:text-slate-300'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── MOOD TAB ─────────────────────────────────────────────────────────── */}
      {tab === 'Mood' && (
        <div className="space-y-4">
          {/* Today's mood CTA */}
          {!todayMood ? (
            <div className="glass-card p-5 border border-accent-cyan/20 flex items-center justify-between">
              <div>
                <p className="font-medium text-white">How are you feeling today?</p>
                <p className="text-xs text-slate-500 mt-0.5">You haven't logged your mood yet</p>
              </div>
              <button onClick={() => setModal('mood')} className="btn-primary flex items-center gap-2">
                <Plus size={15} /> Log Now
              </button>
            </div>
          ) : (
            <div className="glass-card p-5 border border-green-500/20">
              <p className="text-xs text-slate-500 mb-1">Today's mood</p>
              <div className="flex items-center gap-3">
                <span className="font-heading font-bold text-3xl" style={{ color: MOOD_COLORS(todayMood.mood) }}>
                  {todayMood.mood}/10
                </span>
                <div>
                  <p className="font-medium text-white">{MOOD_LABELS[todayMood.mood]}</p>
                  <p className="text-xs text-slate-500">Energy: {todayMood.energy}/10</p>
                </div>
              </div>
              {todayMood.notes && <p className="text-xs text-slate-400 mt-2 italic">"{todayMood.notes}"</p>}
            </div>
          )}

          <MoodChart entries={moodLog} />

          <div className="space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Recent Entries</p>
            {moodLog.slice(0, 10).map(entry => (
              <div key={entry.id} className="glass-card p-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-heading font-bold text-lg"
                    style={{ background: `${MOOD_COLORS(entry.mood)}20`, color: MOOD_COLORS(entry.mood) }}>
                    {entry.mood}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{MOOD_LABELS[entry.mood]} · Energy {entry.energy}/10</p>
                    <p className="text-xs text-slate-500">{formatDate(entry.date)}</p>
                    {entry.notes && <p className="text-xs text-slate-400 mt-0.5 italic truncate max-w-xs">"{entry.notes}"</p>}
                  </div>
                </div>
                <button onClick={() => deleteMood(entry.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-colors flex-shrink-0">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            {!moodLog.length && <EmptyState icon="😊" title="No mood entries yet" subtitle="Start tracking your daily mood to spot patterns" action="Log Mood" onAction={() => setModal('mood')} />}
          </div>
        </div>
      )}

      {/* ── MEDITATION TAB ───────────────────────────────────────────────────── */}
      {tab === 'Meditation' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard icon="🧘" label="Total Sessions" value={meditation.length} color="purple" />
            <StatCard icon="⏱️" label="Total Minutes" value={totalMedMin} color="cyan" />
            <StatCard icon="🔥" label="Current Streak" value={`${medStreak}d`} color="amber" />
            <StatCard icon="📅" label="This Month" value={meditation.filter(m => m.date.slice(0, 7) === todayStr().slice(0, 7)).length} color="green" />
          </div>

          <div className="space-y-2">
            {meditation.slice(0, 15).map(s => (
              <div key={s.id} className="glass-card p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-lg">🧘</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{s.type}</p>
                      <span className="badge text-purple-400 bg-purple-500/10">{s.duration} min</span>
                    </div>
                    <p className="text-xs text-slate-500">{formatDate(s.date)}</p>
                    {s.notes && <p className="text-xs text-slate-500 italic truncate max-w-xs">"{s.notes}"</p>}
                  </div>
                </div>
                <button onClick={() => deleteMeditation(s.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            {!meditation.length && <EmptyState icon="🧘" title="No meditation sessions" action="Log Session" onAction={() => setModal('meditation')} />}
          </div>
        </div>
      )}

      {/* ── SLEEP TAB ────────────────────────────────────────────────────────── */}
      {tab === 'Sleep' && (
        <div className="space-y-4">
          {/* Sleep quality summary */}
          <div className="glass-card p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Sleep Duration · Last 14 Days</p>
            <div className="flex items-end gap-1.5 h-16">
              {[...sleepLog].sort((a,b) => b.date.localeCompare(a.date)).slice(0,14).reverse().map(r => (
                <div key={r.id} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-sm"
                    style={{ height: `${Math.min((r.duration / 10) * 56, 56)}px`, background: r.duration >= 7.5 ? '#22d3ee' : r.duration >= 6 ? '#f59e0b' : '#ef4444', opacity: 0.75 }}
                    title={`${formatDate(r.date)}: ${r.duration}h`} />
                  <span className="text-[9px] text-slate-600">{new Date(r.date).getDate()}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-accent-cyan inline-block" /> ≥7.5h great</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-500 inline-block" /> 6–7.5h ok</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500 inline-block" /> &lt;6h poor</span>
            </div>
          </div>

          <div className="space-y-2">
            {sleepLog.slice(0, 14).map(r => (
              <div key={r.id} className="glass-card p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Moon size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{r.duration}h sleep</p>
                      <span className="text-base">{SLEEP_QUALITY[r.quality]}</span>
                      <span className={`badge ${r.duration >= 7.5 ? 'text-accent-cyan bg-accent-cyan/10' : r.duration >= 6 ? 'text-amber-400 bg-amber-500/10' : 'text-red-400 bg-red-500/10'}`}>
                        {r.duration >= 7.5 ? 'Great' : r.duration >= 6 ? 'OK' : 'Poor'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{r.bedtime} → {r.wakeTime} · {formatDate(r.date)}</p>
                  </div>
                </div>
                <button onClick={() => deleteSleep(r.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            {!sleepLog.length && <EmptyState icon="😴" title="No sleep records" action="Log Sleep" onAction={() => setModal('sleep')} />}
          </div>
        </div>
      )}

      {/* ── JOURNAL TAB ──────────────────────────────────────────────────────── */}
      {tab === 'Journal' && (
        <div className="space-y-3">
          {journal.map(entry => (
            <div key={entry.id} className="glass-card-hover p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {entry.title && <p className="font-semibold text-white text-sm mb-1">{entry.title}</p>}
                  <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">{entry.content}</p>
                  <p className="text-xs text-slate-600 mt-2">{formatDate(entry.date) || formatDate(entry.createdAt)}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setModal({ type: 'journal', entry })}
                    className="p-1.5 rounded-lg hover:bg-bg-tertiary text-slate-500 hover:text-white transition-colors">
                    <BookOpen size={13} />
                  </button>
                  <button onClick={() => deleteJournalEntry(entry.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!journal.length && <EmptyState icon="📓" title="Your journal is empty" subtitle="Write your thoughts, reflections, and daily notes" action="New Entry" onAction={() => setModal('journal')} />}
        </div>
      )}

      {/* Modals */}
      {modal === 'mood'       && <MoodModal onClose={() => setModal(null)} existing={todayMood} />}
      {modal === 'meditation' && <MeditationModal onClose={() => setModal(null)} />}
      {modal === 'sleep'      && <SleepModal onClose={() => setModal(null)} />}
      {modal === 'journal'    && <JournalModal onClose={() => setModal(null)} />}
      {modal?.type === 'journal' && <JournalModal onClose={() => setModal(null)} existing={modal.entry} />}
    </div>
  )
}
