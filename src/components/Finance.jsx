import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { formatSAR, getDaysUntil, formatDate } from '../utils/helpers'
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const EXPENSE_CATEGORIES = ['Rent', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Clothing', 'Other']
const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#64748b']

function ProgressBar({ value, color }) {
  const colors = { red: 'progress-red', amber: 'progress-amber', purple: 'progress-purple', green: 'progress-green', blue: 'progress-blue' }
  return (
    <div className="progress-bar-track h-3">
      <div className={`h-full rounded-full ${colors[color] || 'progress-blue'} transition-all duration-700`} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  )
}

export default function Finance() {
  const { finance, addExpense, deleteExpense, updateDebt } = useApp()
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [expenseForm, setExpenseForm] = useState({ category: 'Food', amount: '', date: new Date().toISOString().slice(0, 10), note: '' })

  const totalExpenses = finance.expenses.reduce((s, e) => s + Number(e.amount), 0)
  const totalDebtPayments = finance.debts.reduce((s, d) => s + d.monthlyPayment, 0)
  const surplus = finance.monthlyIncome - totalExpenses - totalDebtPayments
  const totalDebt = finance.debts.reduce((s, d) => s + (d.total - d.paid), 0)
  const daysToFreedom = getDaysUntil(finance.debtFreedomDate)

  // Pie chart data
  const expenseByCategory = EXPENSE_CATEGORIES.map(cat => ({
    name: cat,
    value: finance.expenses.filter(e => e.category === cat).reduce((s, e) => s + Number(e.amount), 0)
  })).filter(c => c.value > 0)

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (!expenseForm.amount || expenseForm.amount <= 0) return
    addExpense({ ...expenseForm, amount: Number(expenseForm.amount) })
    setExpenseForm({ category: 'Food', amount: '', date: new Date().toISOString().slice(0, 10), note: '' })
    setShowAddExpense(false)
  }

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Debt Freedom Banner */}
      <div className="glass-card p-5 bg-gradient-to-r from-amber-500/15 to-transparent border border-amber-500/25">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-amber-400 font-heading font-bold text-xl">🎯 Debt Freedom Day</p>
            <p className="text-slate-400 text-sm">October 27, 2026 — {daysToFreedom} days remaining</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-3xl font-bold text-white">{formatSAR(totalDebt)}</p>
            <p className="text-xs text-slate-500">total debt remaining</p>
          </div>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Monthly Income', value: formatSAR(finance.monthlyIncome), icon: TrendingUp, color: 'text-green-400' },
          { label: 'Expenses', value: formatSAR(totalExpenses), icon: TrendingDown, color: 'text-red-400' },
          { label: 'Debt Payments', value: formatSAR(totalDebtPayments), icon: AlertCircle, color: 'text-amber-400' },
          { label: 'Monthly Surplus', value: formatSAR(surplus), icon: DollarSign, color: surplus >= 0 ? 'text-green-400' : 'text-red-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-4">
            <Icon size={16} className={`${color} mb-2`} />
            <p className={`font-mono font-bold text-xl ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Debts */}
      <div className="glass-card p-5">
        <h3 className="font-heading font-semibold text-white mb-4">Debt Tracker</h3>
        <div className="space-y-5">
          {finance.debts.map(debt => {
            const remaining = debt.total - debt.paid
            const pct = Math.round((debt.paid / debt.total) * 100)
            return (
              <div key={debt.id}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-white">{debt.name}</p>
                    <p className="text-xs text-slate-500">Monthly: {formatSAR(debt.monthlyPayment)} · Target: {formatDate(debt.targetDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-white">{formatSAR(remaining)}</p>
                    <p className="text-xs text-slate-500">of {formatSAR(debt.total)}</p>
                  </div>
                </div>
                <ProgressBar value={pct} color={debt.color} />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>{pct}% paid</span>
                  <span>{100 - pct}% remaining</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Expense List */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-white">Expenses</h3>
            <button onClick={() => setShowAddExpense(!showAddExpense)} className="btn-primary flex items-center gap-1.5 py-1.5 px-3 text-xs">
              <Plus size={13} /> Add
            </button>
          </div>

          {showAddExpense && (
            <form onSubmit={handleAddExpense} className="mb-4 p-3 bg-bg-tertiary rounded-xl space-y-2 animate-slide-up">
              <select className="input-field" value={expenseForm.category} onChange={e => setExpenseForm(f => ({ ...f, category: e.target.value }))}>
                {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <div className="flex gap-2">
                <input type="number" className="input-field flex-1" placeholder="Amount (SAR)" value={expenseForm.amount} onChange={e => setExpenseForm(f => ({ ...f, amount: e.target.value }))} required min="0" />
                <input type="date" className="input-field" value={expenseForm.date} onChange={e => setExpenseForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <input className="input-field" placeholder="Note (optional)" value={expenseForm.note} onChange={e => setExpenseForm(f => ({ ...f, note: e.target.value }))} />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1 py-1.5 text-xs">Add Expense</button>
                <button type="button" onClick={() => setShowAddExpense(false)} className="btn-ghost py-1.5 text-xs">Cancel</button>
              </div>
            </form>
          )}

          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {finance.expenses.length === 0 && <p className="text-slate-500 text-sm text-center py-6">No expenses recorded yet.</p>}
            {finance.expenses.map(exp => (
              <div key={exp.id} className="flex items-center justify-between px-3 py-2 bg-bg-tertiary rounded-xl group">
                <div>
                  <p className="text-sm text-slate-300">{exp.category}</p>
                  <p className="text-xs text-slate-500">{exp.date}{exp.note ? ` · ${exp.note}` : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-white">{formatSAR(exp.amount)}</span>
                  <button onClick={() => deleteExpense(exp.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass-card p-5">
          <h3 className="font-heading font-semibold text-white mb-4">Expense Breakdown</h3>
          {expenseByCategory.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={expenseByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {expenseByCategory.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: '#12121a', border: '1px solid #2a2a40', borderRadius: '8px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2">
                {expenseByCategory.map((c, i) => (
                  <span key={c.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    {c.name}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-slate-500 text-sm text-center py-12">Add expenses to see breakdown.</p>
          )}
        </div>
      </div>
    </div>
  )
}
