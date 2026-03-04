import React, { useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { STORAGE_KEY, backupData, restoreData, saveData, daysUntil } from './utils/helpers';
import Dashboard from './components/Dashboard.jsx';
import Goals from './components/Goals.jsx';
import Finance from './components/Finance.jsx';
import Skills from './components/Skills.jsx';
import CalendarView from './components/Calendar.jsx';
import Pomodoro from './components/Pomodoro.jsx';
import Journal from './components/Journal.jsx';

const DEBT_FREEDOM_DATE = '2026-10-27';

const INITIAL_STATE = {
  goals: [
    {
      id: 'g-ai-1',
      title: 'Finish Python basics roadmap',
      category: 'AI',
      priority: 'High',
      completed: false,
      dueDate: '2025-06-30',
      estimatedTime: 40,
      notes: 'Follow a structured course + 2 mini projects.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'g-ai-2',
      title: 'Launch first n8n automation for a client',
      category: 'AI',
      priority: 'High',
      completed: false,
      dueDate: '2025-09-30',
      estimatedTime: 25,
      notes: 'Target aviation / travel niche lead gen.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'g-fin-1',
      title: 'Pay off Baseeta debt',
      category: 'Finance',
      priority: 'High',
      completed: false,
      dueDate: '2026-04-30',
      estimatedTime: 15,
      notes: 'Allocate monthly surplus aggressively.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'g-ielts-1',
      title: 'Reach band 7.5 in IELTS',
      category: 'IELTS',
      priority: 'High',
      completed: false,
      dueDate: '2026-01-31',
      estimatedTime: 100,
      notes: 'Daily reading and weekly mock exams.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'g-career-1',
      title: 'Land first remote AI automation client',
      category: 'Career',
      priority: 'High',
      completed: false,
      dueDate: '2026-03-31',
      estimatedTime: 60,
      notes: 'Use Twitter + LinkedIn to find fintech/aviation founders.',
      createdAt: new Date().toISOString(),
    },
  ],
  finances: {
    monthlyIncome: 15000,
    savings: 5000,
    savingsTarget: 50000,
    investments: 0,
    shariahCompliant: true,
    expenseCategories: [
      { id: 'e-rent', label: 'Housing', amount: 3500 },
      { id: 'e-food', label: 'Food & Groceries', amount: 1500 },
      { id: 'e-transport', label: 'Transport', amount: 800 },
      { id: 'e-family', label: 'Family & Obligations', amount: 2000 },
      { id: 'e-fun', label: 'Lifestyle', amount: 1000 },
    ],
    debts: [
      {
        id: 'd-baseeta',
        name: 'Baseeta',
        total: 15000,
        remaining: 15000,
        monthlyPayment: 2500,
        targetPayoff: '2026-04-30',
      },
      {
        id: 'd-car',
        name: 'Car Loan',
        total: 0,
        remaining: 0,
        monthlyPayment: 0,
        targetPayoff: '2026-10-31',
      },
      {
        id: 'd-social',
        name: 'Social Bank Loan',
        total: 0,
        remaining: 0,
        monthlyPayment: 2700,
        targetPayoff: '2026-10-31',
      },
    ],
    history: [],
  },
  skills: {
    core: [
      { id: 's-python', name: 'Python Basics', progress: 35, target: 100 },
      { id: 's-n8n', name: 'n8n Automation', progress: 20, target: 100 },
      { id: 's-apis', name: 'AI APIs', progress: 15, target: 100 },
      { id: 's-langchain', name: 'LangChain / AI Agents', progress: 10, target: 100 },
      { id: 's-fin', name: 'Financial Analysis', progress: 30, target: 100 },
    ],
    ielts: [
      { id: 'i-reading', name: 'Reading', progress: 25, target: 100 },
      { id: 'i-writing', name: 'Writing', progress: 20, target: 100 },
      { id: 'i-listening', name: 'Listening', progress: 30, target: 100 },
      { id: 'i-speaking', name: 'Speaking', progress: 15, target: 100 },
    ],
  },
  calendar: {
    events: [
      {
        id: 'c-flight-1',
        date: new Date().toISOString().slice(0, 10),
        title: 'Flight Duty',
        type: 'Flight',
      },
      {
        id: 'c-study-1',
        date: new Date().toISOString().slice(0, 10),
        title: 'Evening Python Study',
        type: 'Study',
      },
    ],
  },
  pomodoro: {
    sessionsByDate: {},
  },
  journal: {
    entries: [],
  },
};

const SECTIONS = ['dashboard', 'goals', 'finance', 'skills', 'calendar', 'pomodoro', 'journal'];

function App() {
  const [state, setState] = useLocalStorage(STORAGE_KEY, INITIAL_STATE);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') return 'dark';
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });
  const [exportJson, setExportJson] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [pomodoroShortcutTick, setPomodoroShortcutTick] = useState(0);

  // Keep helpers-based persistence in sync with hook-based state.
  useEffect(() => {
    saveData(state);
  }, [state]);

  // Theme management (dark by default with toggle).
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    window.localStorage.setItem('muath-theme', theme);
  }, [theme]);

  // Global keyboard shortcuts.
  useEffect(() => {
    function onKeyDown(e) {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

      // Ctrl + N → add new goal
      if (e.ctrlKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setActiveSection('goals');
        document.dispatchEvent(new CustomEvent('open-add-goal'));
      }

      // Ctrl + P → start Pomodoro
      if (e.ctrlKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setActiveSection('pomodoro');
        setPomodoroShortcutTick((t) => t + 1);
      }

      // Ctrl + J → open journal
      if (e.ctrlKey && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setActiveSection('journal');
      }

      // Esc → close export/import modals
      if (e.key === 'Escape') {
        setIsExportOpen(false);
        setIsImportOpen(false);
      }

      // Space → toggle selected task
      if (e.code === 'Space') {
        if (!selectedGoalId) return;
        e.preventDefault();
        setState((prev) => ({
          ...prev,
          goals: prev.goals.map((g) =>
            g.id === selectedGoalId ? { ...g, completed: !g.completed } : g,
          ),
        }));
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedGoalId, setState]);

  const debtDaysRemaining = useMemo(() => daysUntil(DEBT_FREEDOM_DATE), []);

  const aiProgress = useMemo(() => {
    const aiSkills = state.skills.core.filter((s) =>
      ['s-python', 's-n8n', 's-apis', 's-langchain'].includes(s.id),
    );
    if (!aiSkills.length) return 0;
    return Math.round(aiSkills.reduce((sum, s) => sum + s.progress, 0) / aiSkills.length);
  }, [state.skills.core]);

  const ieltsProgress = useMemo(() => {
    const { ielts } = state.skills;
    if (!ielts.length) return 0;
    return Math.round(ielts.reduce((sum, s) => sum + s.progress, 0) / ielts.length);
  }, [state.skills.ielts]);

  const monthlySurplus = useMemo(() => {
    const { finances } = state;
    const totalExpenses = finances.expenseCategories.reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0,
    );
    const totalDebtPayments = finances.debts.reduce(
      (sum, d) => sum + Number(d.monthlyPayment || 0),
      0,
    );
    return finances.monthlyIncome - totalExpenses - totalDebtPayments - finances.investments;
  }, [state.finances]);

  function updateSection(partial) {
    setState((prev) => ({ ...prev, ...partial }));
  }

  function handleExport() {
    const json = backupData();
    setExportJson(json || JSON.stringify(state, null, 2));
    setIsExportOpen(true);
  }

  function handleImport() {
    try {
      const parsed = restoreData(importJson);
      setState(parsed);
      setIsImportOpen(false);
      setImportJson('');
    } catch {
      // Keep simple: invalid JSON will be logged in helpers.
      alert('Invalid JSON. Please check and try again.');
    }
  }

  const motivationMessage = useMemo(() => {
    const messages = [
      'Every focused hour builds your new career.',
      'Small consistent steps beat random intensity.',
      'Design your schedule around your flights, not the other way around.',
      'Shariah-compliant wealth + AI skills = long-term independence.',
      'Treat today like a client project for your future self.',
    ];
    const idx =
      (aiProgress + ieltsProgress + (state.finances.savings / (state.finances.savingsTarget || 1)) * 100) %
      messages.length;
    return messages[Math.floor(idx)];
  }, [aiProgress, ieltsProgress, state.finances.savings, state.finances.savingsTarget]);

  const sectionLabel = {
    dashboard: 'Dashboard',
    goals: 'Goals',
    finance: 'Finance',
    skills: 'Skills',
    calendar: 'Calendar',
    pomodoro: 'Focus',
    journal: 'Journal',
  }[activeSection];

  return (
    <div className="app-shell">
      {/* Sidebar for desktop */}
      <aside className="sidebar">
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-white/5">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-accentBlue to-accentPurple flex items-center justify-center text-xs font-mono font-bold shadow-soft">
            ML
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-sm font-semibold tracking-tight">
              Muath Life OS
            </span>
            <span className="text-[11px] text-slate-400">
              From flight attendant → AI & fintech
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 text-xs">
          {SECTIONS.map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setActiveSection(sec)}
              className={`w-full sidebar-nav-item ${
                activeSection === sec ? 'sidebar-nav-item-active' : ''
              }`}
            >
              <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[11px] font-mono text-slate-300">
                {sec === 'dashboard' && 'DB'}
                {sec === 'goals' && 'GL'}
                {sec === 'finance' && 'Fi'}
                {sec === 'skills' && 'Sk'}
                {sec === 'calendar' && 'Ca'}
                {sec === 'pomodoro' && 'Fo'}
                {sec === 'journal' && 'Jr'}
              </span>
              <span className="capitalize">{sectionLabelFromKey(sec)}</span>
            </button>
          ))}

          <div className="mt-6 px-1 space-y-2 text-[11px] text-slate-400">
            <div className="flex items-center justify-between">
              <span className="uppercase tracking-widest text-[10px] text-slate-500">
                Keyboard
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="kbd">Ctrl + N · New goal</span>
              <span className="kbd">Ctrl + P · Pomodoro</span>
              <span className="kbd">Ctrl + J · Journal</span>
              <span className="kbd">Space · Toggle task</span>
              <span className="kbd">Esc · Close modals</span>
            </div>
          </div>
        </nav>

        <div className="px-4 pb-4 pt-2 border-t border-white/5 text-[11px] text-slate-500 space-y-1">
          <p>Debt freedom in {debtDaysRemaining} days.</p>
          <p>Target income: 60k–100k SAR / month.</p>
        </div>
      </aside>

      {/* Main panel */}
      <div className="main-panel">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 pt-4 pb-3 border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-30">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-lg sm:text-xl font-semibold tracking-tight">
                {sectionLabel}
              </h1>
              <span className="pill-accent text-[10px] hidden sm:inline-flex">
                Asia/Riyadh · Flight schedule friendly
              </span>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-400 max-w-xl">
              {motivationMessage}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              className="glass-card flex items-center gap-2 px-3 py-1.5 text-xs"
            >
              <span className="w-5 h-5 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-[11px]">
                {theme === 'dark' ? '🌙' : '☀️'}
              </span>
              <span className="hidden sm:inline">
                {theme === 'dark' ? 'Dark mode' : 'Light mode'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleExport}
              className="hidden sm:inline-flex glass-card px-3 py-1.5 text-xs"
            >
              Backup JSON
            </button>

            <button
              type="button"
              onClick={() => setIsImportOpen(true)}
              className="hidden sm:inline-flex glass-card px-3 py-1.5 text-xs"
            >
              Restore JSON
            </button>
          </div>
        </header>

        <main className="main-scroll">
          {activeSection === 'dashboard' && (
            <Dashboard
              goals={state.goals}
              finances={state.finances}
              skills={state.skills}
              pomodoro={state.pomodoro}
              aiProgress={aiProgress}
              ieltsProgress={ieltsProgress}
              monthlySurplus={monthlySurplus}
              debtDaysRemaining={debtDaysRemaining}
            />
          )}

          {activeSection === 'goals' && (
            <Goals
              goals={state.goals}
              onChange={(goals) => updateSection({ goals })}
              selectedGoalId={selectedGoalId}
              onSelectedGoalChange={setSelectedGoalId}
            />
          )}

          {activeSection === 'finance' && (
            <Finance
              finances={state.finances}
              onChange={(finances) => updateSection({ finances })}
            />
          )}

          {activeSection === 'skills' && (
            <Skills
              skills={state.skills}
              onChange={(skills) => updateSection({ skills })}
            />
          )}

          {activeSection === 'calendar' && (
            <CalendarView
              calendar={state.calendar}
              goals={state.goals}
              onChange={(calendar) => updateSection({ calendar })}
            />
          )}

          {activeSection === 'pomodoro' && (
            <Pomodoro
              pomodoro={state.pomodoro}
              onChange={(pomodoro) => updateSection({ pomodoro })}
              shortcutTick={pomodoroShortcutTick}
            />
          )}

          {activeSection === 'journal' && (
            <Journal
              journal={state.journal}
              onChange={(journal) => updateSection({ journal })}
            />
          )}
        </main>

        {/* Bottom navigation for mobile */}
        <nav className="bottom-nav">
          {SECTIONS.map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setActiveSection(sec)}
              className={`bottom-nav-item ${
                activeSection === sec ? 'bottom-nav-item-active' : ''
              }`}
            >
              <span className="text-[16px]">
                {sec === 'dashboard' && '🏠'}
                {sec === 'goals' && '🎯'}
                {sec === 'finance' && '💸'}
                {sec === 'skills' && '📚'}
                {sec === 'calendar' && '📆'}
                {sec === 'pomodoro' && '⏱️'}
                {sec === 'journal' && '📓'}
              </span>
              <span className="text-[10px] capitalize">
                {sectionLabelFromKey(sec)}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Export modal */}
      {isExportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-2xl p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-sm sm:text-base font-semibold">
                Export JSON backup
              </h2>
              <button
                type="button"
                onClick={() => setIsExportOpen(false)}
                className="pill text-xs"
              >
                Close (Esc)
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Copy this JSON and store it safely. You can restore your full dashboard state
              later.
            </p>
            <textarea
              className="w-full h-56 text-[11px] font-mono bg-black/50 border border-white/10 rounded-xl p-2.5 resize-none"
              value={exportJson}
              readOnly
            />
          </div>
        </div>
      )}

      {/* Import modal */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-2xl p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-sm sm:text-base font-semibold">
                Restore from JSON
              </h2>
              <button
                type="button"
                onClick={() => setIsImportOpen(false)}
                className="pill text-xs"
              >
                Cancel (Esc)
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Paste a JSON export from this dashboard. This will overwrite the current
              state.
            </p>
            <textarea
              className="w-full h-56 text-[11px] font-mono bg-black/50 border border-white/10 rounded-xl p-2.5 resize-y"
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Paste exported JSON here..."
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsImportOpen(false)}
                className="pill"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImport}
                className="pill bg-accentGreen/20 border-accentGreen/40 text-accentGreen-100"
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function sectionLabelFromKey(key) {
  switch (key) {
    case 'dashboard':
      return 'Dashboard';
    case 'goals':
      return 'Goals';
    case 'finance':
      return 'Finance';
    case 'skills':
      return 'Skills';
    case 'calendar':
      return 'Calendar';
    case 'pomodoro':
      return 'Focus';
    case 'journal':
      return 'Journal';
    default:
      return key;
  }
}

export default App;

