import React, { useEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const FOCUS_SECONDS = 25 * 60;
const SHORT_BREAK_SECONDS = 5 * 60;
const LONG_BREAK_SECONDS = 15 * 60;

function Pomodoro({ pomodoro, onChange, shortcutTick }) {
  const [mode, setMode] = useState('focus'); // 'focus' | 'short' | 'long'
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [completedFocusInCycle, setCompletedFocusInCycle] = useState(0);

  const todayKey = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (shortcutTick === 0) return;
    if (!isRunning) {
      setMode('focus');
      setSecondsLeft(FOCUS_SECONDS);
      setIsRunning(true);
    }
  }, [shortcutTick]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          handleTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // Only depend on isRunning; handleTimerComplete uses latest state via setters.
  }, [isRunning]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleTimerComplete() {
    setIsRunning(false);
    if (mode === 'focus') {
      logSession('focusSessions');
      setCompletedFocusInCycle((c) => c + 1);
      if ((completedFocusInCycle + 1) % 4 === 0) {
        setMode('long');
        setSecondsLeft(LONG_BREAK_SECONDS);
      } else {
        setMode('short');
        setSecondsLeft(SHORT_BREAK_SECONDS);
      }
    } else if (mode === 'short') {
      logSession('shortBreaks');
      setMode('focus');
      setSecondsLeft(FOCUS_SECONDS);
    } else if (mode === 'long') {
      logSession('longBreaks');
      setCompletedFocusInCycle(0);
      setMode('focus');
      setSecondsLeft(FOCUS_SECONDS);
    }
  }

  function logSession(field) {
    const sessionsByDate = { ...(pomodoro.sessionsByDate || {}) };
    const day = sessionsByDate[todayKey] || {
      focusSessions: 0,
      shortBreaks: 0,
      longBreaks: 0,
    };
    day[field] = (day[field] || 0) + 1;
    sessionsByDate[todayKey] = day;
    onChange({ ...pomodoro, sessionsByDate });
  }

  function handleStartPause() {
    setIsRunning((r) => !r);
  }

  function handleReset() {
    setIsRunning(false);
    if (mode === 'focus') {
      setSecondsLeft(FOCUS_SECONDS);
    } else if (mode === 'short') {
      setSecondsLeft(SHORT_BREAK_SECONDS);
    } else {
      setSecondsLeft(LONG_BREAK_SECONDS);
    }
  }

  const sessionsToday = pomodoro.sessionsByDate?.[todayKey] || {
    focusSessions: 0,
    shortBreaks: 0,
    longBreaks: 0,
  };

  const weeklySummary = useMemo(() => {
    const map = pomodoro.sessionsByDate || {};
    const days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const sessions = map[key] || {
        focusSessions: 0,
        shortBreaks: 0,
        longBreaks: 0,
      };
      days.push({
        key,
        label: d.toLocaleDateString('en', { weekday: 'short' }),
        focus: sessions.focusSessions,
      });
    }
    return days;
  }, [pomodoro.sessionsByDate]);

  const streak = useMemo(() => {
    const map = pomodoro.sessionsByDate || {};
    let count = 0;
    const now = new Date();
    // Count backwards from today while there is at least one focus session.
    while (true) {
      const d = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - count,
      );
      const key = d.toISOString().slice(0, 10);
      const day = map[key];
      if (!day || !day.focusSessions) break;
      count += 1;
    }
    return count;
  }, [pomodoro.sessionsByDate]);

  const weeklyChartData = useMemo(
    () => ({
      labels: weeklySummary.map((d) => d.label),
      datasets: [
        {
          label: 'Focus sessions',
          data: weeklySummary.map((d) => d.focus),
          backgroundColor: '#3b82f6',
          borderRadius: 10,
        },
      ],
    }),
    [weeklySummary],
  );

  const totalFocusSessions = useMemo(
    () =>
      Object.values(pomodoro.sessionsByDate || {}).reduce(
        (sum, d) => sum + (d.focusSessions || 0),
        0,
      ),
    [pomodoro.sessionsByDate],
  );

  const formattedTime = useMemo(() => {
    const m = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, '0');
    const s = (secondsLeft % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }, [secondsLeft]);

  const modeLabel =
    mode === 'focus'
      ? 'Focus (25 min)'
      : mode === 'short'
        ? 'Short break (5 min)'
        : 'Long break (15 min)';

  return (
    <div className="space-y-4">
      <section className="glass-card p-4">
        <div className="section-title">
          <h2>Focus cockpit</h2>
          <span className="pill text-[10px]">
            Ctrl + P → start session
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] items-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative w-44 h-44 rounded-full bg-gradient-to-br from-slate-900 via-slate-950 to-black flex items-center justify-center shadow-soft">
              <div className="absolute inset-2 rounded-full bg-slate-950 border border-white/5 flex flex-col items-center justify-center">
                <span className="text-[11px] text-slate-400 mb-1">
                  {modeLabel}
                </span>
                <span className="font-heading text-3xl font-semibold tracking-tight">
                  {formattedTime}
                </span>
                <span className="mt-1 text-[11px] text-slate-500">
                  {sessionsToday.focusSessions} sessions today
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={handleStartPause}
                className="pill bg-accentBlue/30 border-accentBlue/60 px-4 py-1.5 text-sm"
              >
                {isRunning ? 'Pause' : 'Start'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="pill text-[11px]"
              >
                Reset
              </button>
            </div>
            <div className="flex gap-2 text-[11px] text-slate-400">
              <button
                type="button"
                onClick={() => {
                  setMode('focus');
                  setSecondsLeft(FOCUS_SECONDS);
                  setIsRunning(false);
                }}
                className={`pill ${
                  mode === 'focus'
                    ? 'bg-accentBlue/30 border-accentBlue/60'
                    : ''
                }`}
              >
                Focus
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('short');
                  setSecondsLeft(SHORT_BREAK_SECONDS);
                  setIsRunning(false);
                }}
                className={`pill ${
                  mode === 'short'
                    ? 'bg-accentGreen/30 border-accentGreen/60'
                    : ''
                }`}
              >
                Short break
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('long');
                  setSecondsLeft(LONG_BREAK_SECONDS);
                  setIsRunning(false);
                }}
                className={`pill ${
                  mode === 'long'
                    ? 'bg-accentPurple/30 border-accentPurple/60'
                    : ''
                }`}
              >
                Long break
              </button>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-white/5 border border-white/10 px-3 py-2">
                <p className="text-[11px] text-slate-400 mb-0.5">
                  Focus sessions today
                </p>
                <p className="font-heading text-xl">
                  {sessionsToday.focusSessions}
                </p>
                <p className="text-[11px] text-slate-500">
                  Aim for 1–3 blocks on heavy flight days.
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 px-3 py-2">
                <p className="text-[11px] text-slate-400 mb-0.5">
                  Weekly streak
                </p>
                <p className="font-heading text-xl">{streak}d</p>
                <p className="text-[11px] text-slate-500">
                  Consecutive days with at least 1 session.
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 px-3 py-2">
                <p className="text-[11px] text-slate-400 mb-0.5">
                  Total sessions
                </p>
                <p className="font-heading text-xl">
                  {totalFocusSessions}
                </p>
                <p className="text-[11px] text-slate-500">
                  Each session is a rep towards mastery.
                </p>
              </div>
            </div>

            <div className="glass-card bg-black/30 border-dashed border-white/10 p-3">
              <p className="text-[11px] text-slate-400 mb-1.5">
                Analytics: weekly focus sessions (each ≈ 25 minutes).
              </p>
              <Bar
                data={weeklyChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      ticks: { color: '#9ca3af', font: { size: 10 } },
                      grid: { display: false },
                    },
                    y: {
                      ticks: { color: '#9ca3af', font: { size: 10 }, stepSize: 1 },
                      grid: { color: 'rgba(148,163,184,0.2)' },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card p-4">
        <div className="section-title">
          <h2>Habit heatmap</h2>
          <span className="pill text-[10px]">Last 30 days</span>
        </div>
        <HabitHeatmap sessionsByDate={pomodoro.sessionsByDate || {}} />
      </section>
    </div>
  );
}

function HabitHeatmap({ sessionsByDate }) {
  const today = new Date();
  const days = [];
  for (let i = 29; i >= 0; i -= 1) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const sessions = sessionsByDate[key]?.focusSessions || 0;
    let intensity = 'bg-slate-800';
    if (sessions === 1) intensity = 'bg-blue-500/50';
    else if (sessions === 2) intensity = 'bg-blue-500';
    else if (sessions >= 3) intensity = 'bg-emerald-500';
    days.push({
      key,
      label: d.toLocaleDateString('en', { day: 'numeric' }),
      weekday: d.toLocaleDateString('en', { weekday: 'short' }),
      sessions,
      intensity,
    });
  }

  return (
    <div className="space-y-2 text-[11px]">
      <div className="grid grid-cols-15 gap-1 max-w-full overflow-x-auto">
        <div className="flex gap-1">
          {days.map((d) => (
            <div
              key={d.key}
              className="flex flex-col items-center gap-0.5"
            >
              <div
                title={`${d.key}: ${d.sessions} session(s)`}
                className={`w-4 h-4 rounded-md ${d.intensity} border border-white/5`}
              />
            </div>
          ))}
        </div>
      </div>
      <p className="text-slate-500">
        Each square is a day. Even 1 session on &quot;chaotic&quot; days keeps the habit alive
        while you manage changing flights.
      </p>
    </div>
  );
}

export default Pomodoro;

