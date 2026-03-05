import { createContext, useContext, useState, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { genId, todayStr } from '../utils/helpers'

// ── Default Data ──────────────────────────────────────────────────────────────
const DEFAULT_GOALS = [
  { id: '1', title: 'Complete Python Basics Course', category: 'AI', priority: 'High', completed: false, dueDate: '2026-04-30', estimatedTime: '40h', notes: 'Focus on data manipulation & automation', createdAt: new Date().toISOString() },
  { id: '2', title: 'Pass IELTS with 7.5+', category: 'IELTS', priority: 'High', completed: false, dueDate: '2026-06-01', estimatedTime: '200h', notes: 'Required for remote work applications', createdAt: new Date().toISOString() },
  { id: '3', title: 'Pay off Baseeta debt', category: 'Finance', priority: 'High', completed: false, dueDate: '2026-04-30', estimatedTime: '', notes: '15,000 SAR total remaining', createdAt: new Date().toISOString() },
  { id: '4', title: 'Build first n8n automation workflow', category: 'AI', priority: 'Medium', completed: true, dueDate: '2026-03-15', estimatedTime: '10h', notes: 'Daily AI News workflow done!', createdAt: new Date().toISOString() },
  { id: '5', title: 'Daily 30-min English speaking practice', category: 'Habits', priority: 'Medium', completed: false, dueDate: '2026-12-31', estimatedTime: 'Daily', notes: '', createdAt: new Date().toISOString() },
  { id: '6', title: 'Land first AI consulting client', category: 'Career', priority: 'High', completed: false, dueDate: '2026-09-01', estimatedTime: '', notes: 'Start with 5K SAR/month retainer', createdAt: new Date().toISOString() },
]

const DEFAULT_SKILLS = [
  { id: '1', name: 'Python Basics', progress: 35, category: 'AI', color: 'blue' },
  { id: '2', name: 'n8n Automation', progress: 60, category: 'AI', color: 'purple' },
  { id: '3', name: 'AI APIs', progress: 25, category: 'AI', color: 'blue' },
  { id: '4', name: 'LangChain / AI Agents', progress: 15, category: 'AI', color: 'purple' },
  { id: '5', name: 'Financial Analysis', progress: 40, category: 'Finance', color: 'green' },
  { id: '6', name: 'Reading', progress: 65, category: 'IELTS', color: 'amber' },
  { id: '7', name: 'Writing', progress: 50, category: 'IELTS', color: 'amber' },
  { id: '8', name: 'Listening', progress: 70, category: 'IELTS', color: 'amber' },
  { id: '9', name: 'Speaking', progress: 55, category: 'IELTS', color: 'amber' },
]

const DEFAULT_FINANCE = {
  monthlyIncome: 15000,
  debts: [
    { id: '1', name: 'Baseeta', total: 15000, paid: 0, monthlyPayment: 5000, targetDate: '2026-04-30', color: 'red' },
    { id: '2', name: 'Car Loan', total: 20000, paid: 8000, monthlyPayment: 1500, targetDate: '2026-10-31', color: 'amber' },
    { id: '3', name: 'Social Bank Loan', total: 32400, paid: 8100, monthlyPayment: 2700, targetDate: '2026-10-31', color: 'purple' },
  ],
  expenses: [
    { id: '1', category: 'Rent', amount: 2500, date: todayStr(), note: '' },
    { id: '2', category: 'Food', amount: 1200, date: todayStr(), note: '' },
    { id: '3', category: 'Transport', amount: 600, date: todayStr(), note: '' },
  ],
  savings: 3500,
  debtFreedomDate: '2026-10-27',
}

const DEFAULT_POMODORO = { today: 0, week: 0, streak: 0, lastDate: '' }

const DEFAULT_HEALTH = {
  weight: 78.2,
  weightTarget: 70,
  calories: 1720,
  caloriesTarget: 1800,
  protein: 98,
  proteinTarget: 130,
  water: 6,
  waterTarget: 8,
  workoutsThisWeek: 4,
  workoutsTarget: 5,
  history: [],
}

const DEFAULT_HABITS = [
  { id: 'h1', name: 'Workout', icon: '🏋️', streak: 12, doneToday: true },
  { id: 'h2', name: 'Study', icon: '📚', streak: 8, doneToday: true },
  { id: 'h3', name: 'No Sugar', icon: '🍬', streak: 5, doneToday: false },
  { id: 'h4', name: 'Sleep 7h+', icon: '😴', streak: 3, doneToday: true },
  { id: 'h5', name: 'Read', icon: '📖', streak: 2, doneToday: false },
]

// ── Context ───────────────────────────────────────────────────────────────────
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [view, setView] = useState('dashboard')

  // Persisted state
  const [goals, setGoals] = useLocalStorage('dashboard_goals', DEFAULT_GOALS)
  const [skills, setSkills] = useLocalStorage('dashboard_skills', DEFAULT_SKILLS)
  const [finance, setFinance] = useLocalStorage('dashboard_finance', DEFAULT_FINANCE)
  const [journal, setJournal] = useLocalStorage('dashboard_journal', [])
  const [events, setEvents] = useLocalStorage('dashboard_events', [])
  const [pomodoro, setPomodoro] = useLocalStorage('dashboard_pomodoro', DEFAULT_POMODORO)
  const [health, setHealth] = useLocalStorage('dashboard_health', DEFAULT_HEALTH)
  const [habits, setHabits] = useLocalStorage('dashboard_habits', DEFAULT_HABITS)

  // ── Goals ──────────────────────────────────────────────────────────────────
  const addGoal = useCallback((goal) => setGoals(g => [...g, { ...goal, id: genId(), createdAt: new Date().toISOString() }]), [])
  const updateGoal = useCallback((id, updates) => setGoals(g => g.map(x => x.id === id ? { ...x, ...updates } : x)), [])
  const deleteGoal = useCallback((id) => setGoals(g => g.filter(x => x.id !== id)), [])
  const toggleGoal = useCallback((id) => setGoals(g => g.map(x => x.id === id ? { ...x, completed: !x.completed } : x)), [])

  // ── Skills ─────────────────────────────────────────────────────────────────
  const updateSkill = useCallback((id, progress) => setSkills(s => s.map(x => x.id === id ? { ...x, progress: Math.min(100, Math.max(0, progress)) } : x)), [])

  // ── Finance ────────────────────────────────────────────────────────────────
  const addExpense = useCallback((expense) => setFinance(f => ({ ...f, expenses: [...f.expenses, { ...expense, id: genId() }] })), [])
  const deleteExpense = useCallback((id) => setFinance(f => ({ ...f, expenses: f.expenses.filter(e => e.id !== id) })), [])
  const updateDebt = useCallback((id, updates) => setFinance(f => ({ ...f, debts: f.debts.map(d => d.id === id ? { ...d, ...updates } : d) })), [])
  const updateSavings = useCallback((amount) => setFinance(f => ({ ...f, savings: amount })), [])

  // ── Journal ────────────────────────────────────────────────────────────────
  const addJournalEntry = useCallback((entry) => setJournal(j => [{ ...entry, id: genId(), date: todayStr(), createdAt: new Date().toISOString() }, ...j]), [])
  const updateJournalEntry = useCallback((id, updates) => setJournal(j => j.map(e => e.id === id ? { ...e, ...updates } : e)), [])
  const deleteJournalEntry = useCallback((id) => setJournal(j => j.filter(e => e.id !== id)), [])

  // ── Events ─────────────────────────────────────────────────────────────────
  const addEvent = useCallback((event) => setEvents(e => [...e, { ...event, id: genId() }]), [])
  const deleteEvent = useCallback((id) => setEvents(e => e.filter(x => x.id !== id)), [])

  // ── Health ─────────────────────────────────────────────────────────────────
  const logHealth = useCallback((updates) => {
    setHealth(h => {
      const entry = { date: todayStr(), ...h, ...updates }
      const history = [entry, ...h.history.filter(e => e.date !== todayStr())].slice(0, 30)
      return { ...h, ...updates, history }
    })
  }, [])

  // ── Habits ─────────────────────────────────────────────────────────────────
  const toggleHabit = useCallback((id) => {
    setHabits(hs => hs.map(h => {
      if (h.id !== id) return h
      const done = !h.doneToday
      return { ...h, doneToday: done, streak: done ? h.streak + 1 : Math.max(0, h.streak - 1) }
    }))
  }, [])

  const addHabit = useCallback((name, icon = '✅') => {
    setHabits(hs => [...hs, { id: genId(), name, icon, streak: 0, doneToday: false }])
  }, [])

  // ── Pomodoro ───────────────────────────────────────────────────────────────
  const incrementPomodoro = useCallback(() => {
    const today = todayStr()
    setPomodoro(p => {
      const isNewDay = p.lastDate !== today
      const isStreak = p.lastDate === new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      return {
        today: isNewDay ? 1 : p.today + 1,
        week: p.week + 1,
        streak: isNewDay ? (isStreak ? p.streak + 1 : 1) : p.streak,
        lastDate: today,
      }
    })
  }, [])

  return (
    <AppContext.Provider value={{
      view, setView,
      goals, addGoal, updateGoal, deleteGoal, toggleGoal,
      skills, updateSkill,
      finance, setFinance, addExpense, deleteExpense, updateDebt, updateSavings,
      journal, addJournalEntry, updateJournalEntry, deleteJournalEntry,
      events, addEvent, deleteEvent,
      pomodoro, incrementPomodoro,
      health, logHealth,
      habits, toggleHabit, addHabit,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
