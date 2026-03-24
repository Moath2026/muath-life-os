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
      { id: 'e-rent',      label: 'Housing',             amount: 3500 },
      { id: 'e-food',      label: 'Food & Groceries',    amount: 1500 },
      { id: 'e-transport', label: 'Transport',            amount: 800  },
      { id: 'e-family',    label: 'Family & Obligations', amount: 2000 },
      { id: 'e-fun',       label: 'Lifestyle',            amount: 1000 },
    ],
    debts: [
      { id: 'd-baseeta', name: 'Baseeta',         total: 15000, remaining: 15000, monthlyPayment: 2500, targetPayoff: '2026-04-30' },
      { id: 'd-car',     name: 'Car Loan',         total: 0,     remaining: 0,     monthlyPayment: 0,    targetPayoff: '2026-10-31' },
      { id: 'd-social',  name: 'Social Bank Loan', total: 0,     remaining: 0,     monthlyPayment: 2700, targetPayoff: '2026-10-31' },
    ],
    history: [],
  },
  skills: {
    core: [
      { id: 's-python',    name: 'Python Basics',        progress: 35, target: 100 },
      { id: 's-n8n',       name: 'n8n Automation',       progress: 20, target: 100 },
      { id: 's-apis',      name: 'AI APIs',              progress: 15, target: 100 },
      { id: 's-langchain', name: 'LangChain / AI Agents', progress: 10, target: 100 },
      { id: 's-fin',       name: 'Financial Analysis',   progress: 30, target: 100 },
    ],
    ielts: [
      { id: 'i-reading',   name: 'Reading',   progress: 25, target: 100 },
      { id: 'i-writing',   name: 'Writing',   progress: 20, target: 100 },
      { id: 'i-listening', name: 'Listening', progress: 30, target: 100 },
      { id: 'i-speaking',  name: 'Speaking',  progress: 15, target: 100 },
    ],
  },
  calendar: {
    events: [
      { id: 'c-flight-1', date: new Date().toISOString().slice(0, 10), title: 'Flight Duty',        type: 'Flight' },
      { id: 'c-study-1',  date: new Date().toISOString().slice(0, 10), title: 'Evening Python Study', type: 'Study'  },
    ],
  },
  pomodoro: { sessionsByDate: {} },
  journal:  { entries: [] },
};

/* ─── Navigation config ───────────────────────────────────────────────────── */
const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: '⌂',  emoji: '🏠' },
  { key: 'goals',     label: 'Goals',     icon: '◎',  emoji: '🎯' },
  { key: 'finance',   label: 'Finance',   icon: '◈',  emoji: '💸' },
  { key: 'skills',    label: 'Skills',    icon: '◇',  emoji: '📚' },
  { key: 'calendar',  label: 'Calendar',  icon: '▦',  emoji: '📆' },
  { key: 'pomodoro',  label: 'Focus',     icon: '◉',  emoji: '⏱️' },
  { key: 'journal',   label: 'Journal',   icon: '◫',  emoji: '📓' },
];

/* ─── Sidebar icon badge ──────────────────────────────────────────────────── */
function NavIcon({ children, active }) {
  return (
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: 9,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        flexShrink: 0,
        background: active ? 'rgba(6,182,212,0.12)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${active ? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: active ? '0 0 8px rgba(6,182,212,0.2)' : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      {children}
    </div>
  );
}

/* ─── Main App ────────────────────────────────────────────────────────────── */
function App() {
  const [state, setState]                       = useLocalStorage(STORAGE_KEY, INITIAL_STATE);
  const [activeSection, setActiveSection]       = useState('dashboard');
  const [exportJson, setExportJson]             = useState('');
  const [isExportOpen, setIsExportOpen]         = useState(false);
  const [isImportOpen, setIsImportOpen]         = useState(false);
  const [importJson, setImportJson]             = useState('');
  const [selectedGoalId, setSelectedGoalId]     = useState(null);
  const [pomodoroShortcutTick, setPomodoroShortcutTick] = useState(0);

  // Always dark mode for mission-control aesthetic.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.add('dark');
  }, []);

  // Keep helpers-based persistence in sync.
  useEffect(() => { saveData(state); }, [state]);

  // Global keyboard shortcuts.
  useEffect(() => {
    function onKeyDown(e) {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
      if (e.ctrlKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setActiveSection('goals');
        document.dispatchEvent(new CustomEvent('open-add-goal'));
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setActiveSection('pomodoro');
        setPomodoroShortcutTick((t) => t + 1);
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setActiveSection('journal');
      }
      if (e.key === 'Escape') {
        setIsExportOpen(false);
        setIsImportOpen(false);
      }
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
    const totalExpenses = finances.expenseCategories.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const totalDebtPayments = finances.debts.reduce((sum, d) => sum + Number(d.monthlyPayment || 0), 0);
    return finances.monthlyIncome - totalExpenses - totalDebtPayments - finances.investments;
  }, [state.finances]);

  const motivationMessages = [
    'Every focused hour builds your new career.',
    'Small consistent steps beat random intensity.',
    'Design your schedule around your flights, not the other way around.',
    'Shariah-compliant wealth + AI skills = long-term independence.',
    'Treat today like a client project for your future self.',
  ];
  const motivationMessage = motivationMessages[
    Math.floor((aiProgress + ieltsProgress) % motivationMessages.length)
  ];

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
      alert('Invalid JSON. Please check and try again.');
    }
  }

  const activeNav = NAV.find((n) => n.key === activeSection);

  return (
    <div className="app-shell">

      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside className="sidebar">
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '20px 16px 16px',
            borderBottom: '1px solid rgba(6,182,212,0.08)',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg,#06b6d4 0%,#7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontFamily: "'Space Mono',monospace",
              fontWeight: 700,
              color: '#fff',
              boxShadow: '0 0 20px rgba(6,182,212,0.35)',
              flexShrink: 0,
            }}
          >
            ML
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Outfit',system-ui,sans-serif",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#f1f5f9',
              }}
            >
              Muath Life OS
            </div>
            <div style={{ fontSize: 10, color: '#334155', marginTop: 1 }}>
              Flight attendant → AI operator
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveSection(key)}
              className={`sidebar-nav-item ${activeSection === key ? 'sidebar-nav-item-active' : ''}`}
            >
              <NavIcon active={activeSection === key}>{icon}</NavIcon>
              <span>{label}</span>
            </button>
          ))}

          {/* Keyboard shortcuts */}
          <div
            style={{
              marginTop: 20,
              padding: '12px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <p
              style={{
                fontSize: 9,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#1e293b',
                marginBottom: 8,
              }}
            >
              Shortcuts
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[
                ['Ctrl+N', 'New goal'],
                ['Ctrl+P', 'Pomodoro'],
                ['Ctrl+J', 'Journal'],
                ['Space',  'Toggle task'],
              ].map(([key, desc]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="kbd">{key}</span>
                  <span style={{ fontSize: 10, color: '#334155' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid rgba(6,182,212,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 6px rgba(16,185,129,0.8)',
              }}
            />
            <span style={{ fontSize: 10, color: '#334155' }}>System online</span>
          </div>
          <p style={{ fontSize: 10, color: '#1e293b', lineHeight: 1.5 }}>
            Debt freedom in{' '}
            <span style={{ color: '#34d399', fontWeight: 600 }}>{debtDaysRemaining}d</span>
          </p>
          <p style={{ fontSize: 10, color: '#1e293b' }}>
            Target: 60k–100k SAR / month
          </p>
        </div>
      </aside>

      {/* ── Main panel ────────────────────────────────────────────────── */}
      <div className="main-panel">

        {/* Header */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderBottom: '1px solid rgba(6,182,212,0.07)',
            background: 'rgba(3,7,18,0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
              <h1
                style={{
                  fontFamily: "'Outfit',system-ui,sans-serif",
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  margin: 0,
                  color: '#f1f5f9',
                }}
              >
                {activeNav?.label || 'Dashboard'}
              </h1>
              <span
                className="pill-cyan"
                style={{ fontSize: '10px', display: 'none' }}
                id="region-pill"
              >
                Asia/Riyadh
              </span>
              <style>{`@media(min-width:640px){#region-pill{display:inline-flex}}`}</style>
            </div>
            <p style={{ fontSize: 11, color: '#334155', margin: 0, maxWidth: 400 }}>
              {motivationMessage}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={handleExport}
              style={{
                display: 'none',
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 500,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#64748b',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              id="export-btn"
              onMouseEnter={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
            >
              Backup
            </button>
            <style>{`@media(min-width:640px){#export-btn{display:block}}`}</style>

            <button
              type="button"
              onClick={() => setIsImportOpen(true)}
              style={{
                display: 'none',
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 500,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#64748b',
                cursor: 'pointer',
              }}
              id="import-btn"
            >
              Restore
            </button>
            <style>{`@media(min-width:640px){#import-btn{display:block}}`}</style>

            {/* Debt countdown pill */}
            <div
              style={{
                padding: '5px 12px',
                borderRadius: 8,
                background: 'rgba(16,185,129,0.07)',
                border: '1px solid rgba(16,185,129,0.15)',
                fontSize: 11,
                fontWeight: 600,
                color: '#34d399',
                fontFamily: "'Space Mono',monospace",
                letterSpacing: '-0.01em',
              }}
            >
              D-{debtDaysRemaining}
            </div>
          </div>
        </header>

        {/* Main content */}
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

        {/* ── Bottom navigation (mobile) ─────────────────────────────── */}
        <nav className="bottom-nav">
          {NAV.map(({ key, label, emoji }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveSection(key)}
              className={`bottom-nav-item ${activeSection === key ? 'bottom-nav-item-active' : ''}`}
            >
              <span style={{ fontSize: 18 }}>{emoji}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* ── Export modal ──────────────────────────────────────────────── */}
      {isExportOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            className="glass-card"
            style={{ width: '100%', maxWidth: 600, padding: '24px', margin: '16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ fontFamily: "'Outfit',system-ui,sans-serif", fontWeight: 600, margin: 0 }}>
                Export JSON Backup
              </h2>
              <button
                type="button"
                onClick={() => setIsExportOpen(false)}
                className="pill"
                style={{ cursor: 'pointer' }}
              >
                Close (Esc)
              </button>
            </div>
            <p style={{ fontSize: 12, color: '#475569', marginBottom: 12 }}>
              Copy this JSON and store it safely. You can restore your full dashboard state later.
            </p>
            <textarea
              style={{
                width: '100%',
                height: 220,
                fontSize: 11,
                fontFamily: "'Space Mono',monospace",
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                padding: '10px',
                resize: 'none',
                color: '#94a3b8',
                outline: 'none',
              }}
              value={exportJson}
              readOnly
            />
          </div>
        </div>
      )}

      {/* ── Import modal ──────────────────────────────────────────────── */}
      {isImportOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            className="glass-card"
            style={{ width: '100%', maxWidth: 600, padding: '24px', margin: '16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ fontFamily: "'Outfit',system-ui,sans-serif", fontWeight: 600, margin: 0 }}>
                Restore from JSON
              </h2>
              <button
                type="button"
                onClick={() => setIsImportOpen(false)}
                className="pill"
                style={{ cursor: 'pointer' }}
              >
                Cancel (Esc)
              </button>
            </div>
            <p style={{ fontSize: 12, color: '#475569', marginBottom: 12 }}>
              Paste a JSON export from this dashboard. This will overwrite the current state.
            </p>
            <textarea
              style={{
                width: '100%',
                height: 220,
                fontSize: 11,
                fontFamily: "'Space Mono',monospace",
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                padding: '10px',
                resize: 'vertical',
                color: '#94a3b8',
                outline: 'none',
              }}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Paste exported JSON here..."
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <button
                type="button"
                onClick={() => setIsImportOpen(false)}
                className="pill"
                style={{ cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImport}
                style={{
                  padding: '4px 16px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 500,
                  background: 'rgba(16,185,129,0.12)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  color: '#34d399',
                  cursor: 'pointer',
                }}
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

export default App;
