import React, { useMemo } from 'react';
import { sar } from '../utils/helpers';

function Dashboard({
  goals,
  finances,
  skills,
  pomodoro,
  aiProgress,
  ieltsProgress,
  monthlySurplus,
  debtDaysRemaining,
}) {
  const today = new Date().toISOString().slice(0, 10);

  const todaysTasks = useMemo(
    () =>
      goals
        .filter((g) => g.dueDate === today && !g.completed)
        .slice(0, 5),
    [goals, today],
  );

  const openHighPriority = useMemo(
    () =>
      goals.filter((g) => g.priority === 'High' && !g.completed).slice(0, 4),
    [goals],
  );

  const totalDebtRemaining = finances.debts.reduce(
    (sum, d) => sum + Number(d.remaining || 0),
    0,
  );

  const pomodoroToday =
    pomodoro.sessionsByDate?.[today]?.focusSessions || 0;

  const completedGoals = goals.filter((g) => g.completed).length;
  const totalGoals = goals.length || 1;
  const goalsCompletion = Math.round((completedGoals / totalGoals) * 100);

  return (
    <div className="space-y-4">
      {/* Top summary stats */}
      <section className="card-grid">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-medium text-slate-400 uppercase tracking-widest">
              AI learning
            </h2>
            <span className="pill text-[10px]">
              Target: remote AI work
            </span>
          </div>
          <p className="text-2xl font-heading font-semibold">
            {aiProgress}%
          </p>
          <div className="progress-bar mt-2">
            <div
              className="progress-bar-inner"
              style={{ width: `${aiProgress}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Python, automations, APIs, and agents.
          </p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-medium text-slate-400 uppercase tracking-widest">
              IELTS progress
            </h2>
            <span className="pill text-[10px]">Band 7.5+ target</span>
          </div>
          <p className="text-2xl font-heading font-semibold">
            {ieltsProgress}%
          </p>
          <div className="progress-bar mt-2">
            <div
              className="progress-bar-inner bg-gradient-to-r from-accentPurple via-accentBlue to-accentAmber"
              style={{ width: `${ieltsProgress}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Reading, writing, listening, and speaking reps.
          </p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-medium text-slate-400 uppercase tracking-widest">
              Monthly surplus
            </h2>
            <span className="pill text-[10px]">Income: {sar(finances.monthlyIncome)}</span>
          </div>
          <p
            className={`text-2xl font-heading font-semibold ${
              monthlySurplus >= 0 ? 'text-accentGreen' : 'text-accentRed'
            }`}
          >
            {sar(monthlySurplus)}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Surplus after expenses and debt payments.
          </p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-medium text-slate-400 uppercase tracking-widest">
              Debt freedom
            </h2>
            <span className="pill text-[10px]">Countdown</span>
          </div>
          <p className="text-2xl font-heading font-semibold">
            {debtDaysRemaining} days
          </p>
          <div className="mt-1 text-[11px] text-slate-400 flex flex-col gap-1">
            <span>Remaining debt: {sar(totalDebtRemaining)}</span>
            <span className="text-accentGreen">
              Oct 27, 2026 → Debt Freedom Day
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-medium text-slate-400 uppercase tracking-widest">
              Deep work today
            </h2>
            <span className="pill text-[10px]">Pomodoro</span>
          </div>
          <p className="text-2xl font-heading font-semibold">
            {pomodoroToday} sessions
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Each 25-minute block compounds into your new career.
          </p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-medium text-slate-400 uppercase tracking-widest">
              Goal completion
            </h2>
            <span className="pill text-[10px]">Life OS</span>
          </div>
          <p className="text-2xl font-heading font-semibold">
            {goalsCompletion}%
          </p>
          <div className="progress-bar mt-2">
            <div
              className="progress-bar-inner bg-gradient-to-r from-accentGreen via-accentBlue to-accentPurple"
              style={{ width: `${goalsCompletion}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {completedGoals} of {totalGoals} goals completed.
          </p>
        </div>
      </section>

      {/* Today + skills snapshot */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card p-4">
          <div className="section-title">
            <h2>Today&apos;s runway</h2>
            <span className="pill text-[10px] flex items-center gap-1">
              <span className="badge-dot bg-accentBlue" />
              Flights + Study + AI
            </span>
          </div>
          {todaysTasks.length === 0 && openHighPriority.length === 0 ? (
            <p className="text-xs text-slate-500">
              No tasks due today. Choose one high-leverage goal and schedule a focused block.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {todaysTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-start justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-2"
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {task.category} · {task.priority} priority
                    </p>
                  </div>
                  <span className="pill text-[10px]">
                    {task.estimatedTime || 1}h
                  </span>
                </li>
              ))}

              {openHighPriority.length > 0 && (
                <li className="mt-2 pt-2 border-t border-white/5 text-[11px] text-slate-400">
                  High-priority backlog:
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {openHighPriority.map((goal) => (
                      <span
                        key={goal.id}
                        className="pill bg-white/5 text-[10px]"
                      >
                        {goal.title}
                      </span>
                    ))}
                  </div>
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="glass-card p-4">
          <div className="section-title">
            <h2>Skills snapshot</h2>
            <span className="pill text-[10px] flex items-center gap-1">
              <span className="badge-dot bg-accentPurple" />
              AI + Finance + IELTS
            </span>
          </div>

          <div className="space-y-2">
            {skills.core.slice(0, 3).map((s) => (
              <div key={s.id}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{s.name}</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {s.progress}% / {s.target}%
                  </span>
                </div>
                <div className="progress-bar mt-1">
                  <div
                    className="progress-bar-inner"
                    style={{ width: `${(s.progress / (s.target || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="mt-3 grid grid-cols-4 gap-1.5 text-[11px]">
              {skills.ielts.map((m) => (
                <div
                  key={m.id}
                  className="rounded-xl bg-gradient-to-br from-accentPurple/10 to-accentBlue/10 border border-accentPurple/25 px-2 py-1.5 flex flex-col gap-0.5"
                >
                  <span className="text-[10px] text-slate-300">{m.name}</span>
                  <span className="font-mono text-xs font-semibold">
                    {m.progress}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Finance + focus section */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 glass-card p-4">
          <div className="section-title">
            <h2>Financial flight path</h2>
            <span className="pill text-[10px] flex items-center gap-1">
              <span className="badge-dot bg-accentGreen" />
              Shariah-compliant wealth plan
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 text-[11px]">
            <div className="rounded-2xl bg-white/5 border border-white/10 px-3 py-2">
              <p className="text-slate-400 mb-1">Savings</p>
              <p className="font-heading text-lg">
                {sar(finances.savings)}
              </p>
              <p className="text-slate-500 mt-0.5">
                Target: {sar(finances.savingsTarget)}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 px-3 py-2">
              <p className="text-slate-400 mb-1">Investments</p>
              <p className="font-heading text-lg">
                {sar(finances.investments)}
              </p>
              <p className="text-slate-500 mt-0.5">
                Focus: halal, long-term assets.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 px-3 py-2">
              <p className="text-slate-400 mb-1">Debt payments</p>
              <p className="font-heading text-lg">
                {sar(
                  finances.debts.reduce(
                    (sum, d) => sum + Number(d.monthlyPayment || 0),
                    0,
                  ),
                )}
              </p>
              <p className="text-slate-500 mt-0.5">
                Clearing runway for investing.
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="section-title">
            <h2>Focus cockpit</h2>
            <span className="pill text-[10px]">Pomodoro</span>
          </div>
          <p className="text-xs text-slate-400 mb-2">
            Use <span className="kbd">Ctrl + P</span> to jump into a 25-minute block. Protect
            1–3 sessions per day around your flights.
          </p>
          <ul className="space-y-1.5 text-[11px] text-slate-300">
            <li>• 1 session → Minimum daily commitment.</li>
            <li>• 3 sessions → Strong compounding week.</li>
            <li>• Track your streak in the Focus tab.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;

