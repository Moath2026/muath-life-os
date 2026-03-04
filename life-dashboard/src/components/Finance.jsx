import React, { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { sar } from '../utils/helpers';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

function Finance({ finances, onChange }) {
  const [newExpense, setNewExpense] = useState({ label: '', amount: '' });

  const totalExpenses = useMemo(
    () =>
      finances.expenseCategories.reduce(
        (sum, e) => sum + Number(e.amount || 0),
        0,
      ),
    [finances.expenseCategories],
  );

  const totalDebtRemaining = useMemo(
    () =>
      finances.debts.reduce(
        (sum, d) => sum + Number(d.remaining || 0),
        0,
      ),
    [finances.debts],
  );

  const savingsProgressPct = useMemo(() => {
    if (!finances.savingsTarget) return 0;
    return Math.min(
      100,
      Math.round((finances.savings / finances.savingsTarget) * 100),
    );
  }, [finances.savings, finances.savingsTarget]);

  const expenseChartData = useMemo(() => {
    const labels = finances.expenseCategories.map((e) => e.label);
    const data = finances.expenseCategories.map((e) =>
      Number(e.amount || 0),
    );
    if (!data.length || data.every((v) => v === 0)) {
      return null;
    }
    return {
      labels,
      datasets: [
        {
          label: 'Monthly expenses',
          data,
          backgroundColor: [
            '#3b82f6',
            '#8b5cf6',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#22c55e',
            '#06b6d4',
          ],
          borderWidth: 0,
        },
      ],
    };
  }, [finances.expenseCategories]);

  const trendData = useMemo(() => {
    if (!finances.history || finances.history.length === 0) return null;
    const labels = finances.history.map((h) => h.label);
    const savings = finances.history.map((h) => h.savings);
    const debt = finances.history.map((h) => h.debtRemaining);
    return {
      labels,
      datasets: [
        {
          label: 'Savings',
          data: savings,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.15)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Debt remaining',
          data: debt,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239,68,68,0.08)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [finances.history]);

  function handleExpenseChange(id, patch) {
    onChange({
      ...finances,
      expenseCategories: finances.expenseCategories.map((e) =>
        e.id === id ? { ...e, ...patch } : e,
      ),
    });
  }

  function handleAddExpense(event) {
    event.preventDefault();
    const label = newExpense.label.trim();
    const amount = Number(newExpense.amount || 0);
    if (!label || !amount) return;
    onChange({
      ...finances,
      expenseCategories: [
        ...finances.expenseCategories,
        {
          id: `e-${Date.now()}`,
          label,
          amount,
        },
      ],
    });
    setNewExpense({ label: '', amount: '' });
  }

  function handleDeleteExpense(id) {
    onChange({
      ...finances,
      expenseCategories: finances.expenseCategories.filter((e) => e.id !== id),
    });
  }

  function handleDebtChange(id, patch) {
    onChange({
      ...finances,
      debts: finances.debts.map((d) =>
        d.id === id ? { ...d, ...patch } : d,
      ),
    });
  }

  function handleHistorySnapshot() {
    const expenses = totalExpenses;
    const label = new Date().toISOString().slice(0, 7);
    const snapshot = {
      id: `h-${Date.now()}`,
      label,
      income: finances.monthlyIncome,
      expenses,
      savings: finances.savings,
      investments: finances.investments,
      debtRemaining: totalDebtRemaining,
    };
    onChange({
      ...finances,
      history: [...(finances.history || []), snapshot],
    });
  }

  return (
    <div className="space-y-4">
      <section className="glass-card p-4">
        <div className="section-title mb-3">
          <h2>Financial cockpit</h2>
          <span className="pill text-[10px]">
            Shariah-compliant path to 60k–100k SAR / month
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-4 text-xs">
          <div className="space-y-1">
            <label className="block text-slate-300 text-[11px]">
              Monthly income (SAR)
            </label>
            <input
              type="number"
              className="w-full rounded-xl bg-black/60 border border-white/10 px-2 py-1.5"
              value={finances.monthlyIncome}
              onChange={(e) =>
                onChange({
                  ...finances,
                  monthlyIncome: Number(e.target.value || 0),
                })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="block text-slate-300 text-[11px]">
              Savings (current)
            </label>
            <input
              type="number"
              className="w-full rounded-xl bg-black/60 border border-white/10 px-2 py-1.5"
              value={finances.savings}
              onChange={(e) =>
                onChange({
                  ...finances,
                  savings: Number(e.target.value || 0),
                })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="block text-slate-300 text-[11px]">
              Savings target
            </label>
            <input
              type="number"
              className="w-full rounded-xl bg-black/60 border border-white/10 px-2 py-1.5"
              value={finances.savingsTarget}
              onChange={(e) =>
                onChange({
                  ...finances,
                  savingsTarget: Number(e.target.value || 0),
                })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="block text-slate-300 text-[11px]">
              Monthly investments
            </label>
            <input
              type="number"
              className="w-full rounded-xl bg-black/60 border border-white/10 px-2 py-1.5"
              value={finances.investments}
              onChange={(e) =>
                onChange({
                  ...finances,
                  investments: Number(e.target.value || 0),
                })
              }
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-[11px]">
          <div className="rounded-2xl bg-white/5 border border-white/10 px-3 py-2 flex-1 min-w-[140px]">
            <p className="text-slate-400 mb-1">Total expenses</p>
            <p className="font-heading text-lg">
              {sar(totalExpenses)}
            </p>
            <p className="text-slate-500 mt-0.5">
              Keep fixed costs lean to free up cash for skills and investing.
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 px-3 py-2 flex-1 min-w-[140px]">
            <p className="text-slate-400 mb-1">Debt remaining</p>
            <p className="font-heading text-lg">
              {sar(totalDebtRemaining)}
            </p>
            <p className="text-slate-500 mt-0.5">
              Aggressive payoff → faster runway to invest.
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 px-3 py-2 flex-1 min-w-[140px]">
            <p className="text-slate-400 mb-1">Savings progress</p>
            <p className="font-heading text-lg">
              {savingsProgressPct}%
            </p>
            <div className="progress-bar mt-1.5">
              <div
                className="progress-bar-inner bg-gradient-to-r from-accentGreen via-accentBlue to-accentPurple"
                style={{ width: `${savingsProgressPct}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="glass-card p-4">
          <div className="section-title">
            <h2>Expense map</h2>
            <button
              type="button"
              onClick={handleHistorySnapshot}
              className="pill text-[10px]"
            >
              Log monthly snapshot
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] items-start">
            <div className="flex items-center justify-center">
              {expenseChartData ? (
                <Doughnut
                  data={expenseChartData}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    cutout: '70%',
                  }}
                />
              ) : (
                <p className="text-xs text-slate-500">
                  Add some expense categories to see how your money is allocated each month.
                </p>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <form
                onSubmit={handleAddExpense}
                className="flex flex-wrap gap-2"
              >
                <input
                  type="text"
                  className="flex-1 min-w-[120px] rounded-xl bg-black/60 border border-white/10 px-2 py-1.5"
                  placeholder="Category (e.g. Courses)"
                  value={newExpense.label}
                  onChange={(e) =>
                    setNewExpense((prev) => ({
                      ...prev,
                      label: e.target.value,
                    }))
                  }
                />
                <input
                  type="number"
                  className="w-28 rounded-xl bg-black/60 border border-white/10 px-2 py-1.5"
                  placeholder="Amount"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                />
                <button
                  type="submit"
                  className="pill bg-accentBlue/20 border-accentBlue/40 text-[11px]"
                >
                  Add
                </button>
              </form>

              <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {finances.expenseCategories.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-2.5 py-1.5"
                  >
                    <div className="flex flex-col">
                      <span className="text-[12px]">{e.label}</span>
                      <span className="text-[11px] text-slate-400">
                        {sar(e.amount)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        className="w-24 rounded-lg bg-black/60 border border-white/10 px-1.5 py-1 text-[11px]"
                        value={e.amount}
                        onChange={(ev) =>
                          handleExpenseChange(e.id, {
                            amount: Number(ev.target.value || 0),
                          })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteExpense(e.id)}
                        className="pill text-[10px] bg-accentRed/20 border-accentRed/40"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="text-[11px] text-slate-500">
                Intentional spending lets you redirect more SAR towards debt payoff, skills, and
                halal assets.
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="section-title">
            <h2>Debt runway</h2>
            <span className="pill text-[10px]">Debt freedom: Oct 27, 2026</span>
          </div>

          <ul className="space-y-2 text-xs">
            {finances.debts.map((d) => {
              const pct =
                d.total && d.total > 0
                  ? Math.max(
                      0,
                      Math.min(
                        100,
                        Math.round(
                          ((d.total - (d.remaining || 0)) / d.total) * 100,
                        ),
                      ),
                    )
                  : 0;
              return (
                <li
                  key={d.id}
                  className="rounded-2xl bg-white/5 border border-white/10 px-3 py-2.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-200">{d.name}</span>
                    <span className="pill">
                      Monthly: {sar(d.monthlyPayment || 0)}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-inner bg-gradient-to-r from-accentRed via-accentAmber to-accentGreen"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      Remaining: {sar(d.remaining || 0)}{' '}
                      {d.total > 0 && `(paid ${pct}%)`}
                    </span>
                    <span>Target payoff: {d.targetPayoff}</span>
                  </div>
                  <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-1.5 text-[10px] mt-1">
                    <div className="space-y-0.5">
                      <label className="text-slate-400">Remaining amount</label>
                      <input
                        type="number"
                        className="w-full rounded-lg bg-black/60 border border-white/10 px-1.5 py-1"
                        value={d.remaining}
                        onChange={(e) =>
                          handleDebtChange(d.id, {
                            remaining: Number(e.target.value || 0),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-slate-400">Total original</label>
                      <input
                        type="number"
                        className="w-full rounded-lg bg-black/60 border border-white/10 px-1.5 py-1"
                        value={d.total}
                        onChange={(e) =>
                          handleDebtChange(d.id, {
                            total: Number(e.target.value || 0),
                          })
                        }
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="mt-2 text-[11px] text-slate-500">
            Treat each payment like buying back your freedom to choose projects, clients, and
            locations aligned with your values.
          </p>
        </div>
      </section>

      <section className="glass-card p-4">
        <div className="section-title">
          <h2>Wealth trajectory</h2>
          <span className="pill text-[10px]">
            Savings vs. debt (analytics)
          </span>
        </div>
        {trendData ? (
          <Line
            data={trendData}
            options={{
              responsive: true,
              scales: {
                x: {
                  grid: { color: 'rgba(148, 163, 184, 0.1)' },
                  ticks: { color: '#9ca3af', font: { size: 10 } },
                },
                y: {
                  grid: { color: 'rgba(148, 163, 184, 0.1)' },
                  ticks: { color: '#9ca3af', font: { size: 10 } },
                },
              },
              plugins: {
                legend: {
                  labels: { color: '#e5e7eb', font: { size: 11 } },
                },
              },
            }}
          />
        ) : (
          <p className="text-xs text-slate-500">
            Capture a few months of snapshots to see how quickly you&apos;re moving towards debt
            freedom and your savings target.
          </p>
        )}
      </section>
    </div>
  );
}

export default Finance;

