// ── Data Persistence ─────────────────────────────────────────────────────────
export const saveData = (key, data) => {
  try { localStorage.setItem(`dashboard_${key}`, JSON.stringify(data)); return true }
  catch { return false }
}

export const loadData = (key, fallback = null) => {
  try {
    const v = localStorage.getItem(`dashboard_${key}`)
    return v ? JSON.parse(v) : fallback
  } catch { return fallback }
}

export const backupData = () => {
  const backup = {}
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k.startsWith('dashboard_')) backup[k] = JSON.parse(localStorage.getItem(k))
  }
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: `life-dashboard-backup-${new Date().toISOString().slice(0, 10)}.json`,
  })
  a.click()
  URL.revokeObjectURL(url)
}

export const restoreData = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)))
        resolve(true)
      } catch (err) { reject(err) }
    }
    reader.readAsText(file)
  })

// ── ID Generation ─────────────────────────────────────────────────────────────
export const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2)

// ── Formatting ────────────────────────────────────────────────────────────────
export const formatSAR = (n) =>
  new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(n)

export const formatDate = (d) =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(d))

export const getDaysUntil = (date) =>
  Math.ceil((new Date(date) - new Date()) / 86400000)

export const getWeekDates = () => {
  const now = new Date()
  const day = now.getDay()
  const start = new Date(now)
  start.setDate(now.getDate() - day)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d.toISOString().slice(0, 10)
  })
}

export const todayStr = () => new Date().toISOString().slice(0, 10)

// ── Colors ────────────────────────────────────────────────────────────────────
export const CATEGORY_COLORS = {
  AI: 'text-blue-400 bg-blue-500/10',
  Finance: 'text-green-400 bg-green-500/10',
  IELTS: 'text-purple-400 bg-purple-500/10',
  Career: 'text-amber-400 bg-amber-500/10',
  Habits: 'text-pink-400 bg-pink-500/10',
}

export const PRIORITY_COLORS = {
  High: 'text-red-400 bg-red-500/10',
  Medium: 'text-amber-400 bg-amber-500/10',
  Low: 'text-slate-400 bg-slate-500/10',
}

export const MOTIVATIONS = [
  'Every skill you build today is a brick in your financial freedom.',
  'Debt freedom is 7 months away. Stay the course.',
  'Remote tech work is earned — one commit at a time.',
  'Your irregular schedule is your superpower — use the downtime.',
  'Discipline now = options later. Keep going, Muath.',
  'The best investment you can make is in yourself.',
  'Small daily improvements lead to stunning long-term results.',
  'You are building a life others will study.',
]

export const getDailyMotivation = () => {
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  return MOTIVATIONS[dayOfYear % MOTIVATIONS.length]
}
