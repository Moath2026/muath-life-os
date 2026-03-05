import { useApp } from '../../context/AppContext'
import { formatSAR } from '../../utils/helpers'
import { Wallet, TrendingUp } from 'lucide-react'
import { BarChart, Bar, ResponsiveContainer, Tooltip, Cell } from 'recharts'

const SPENDING_DATA = [
  { day: 'Mon', amount: 210 },
  { day: 'Tue', amount: 185 },
  { day: 'Wed', amount: 340 },
  { day: 'Thu', amount: 125 },
  { day: 'Fri', amount: 290 },
  { day: 'Sat', amount: 145 },
  { day: 'Sun', amount: 0 },
]

const BUDGET = 15000
const BALANCE = 12450

export default function FinanceSummaryCard({ onNavigate }) {
  const { finance } = useApp()
  const spent = finance.expenses.reduce((s, e) => s + e.amount, 0)
  const spentPct = Math.round((spent / BUDGET) * 100)
  const todaySpend = SPENDING_DATA[5].amount

  return (
    <div className="glass-card p-5 flex flex-col gap-4 h-full cursor-pointer" onClick={onNavigate}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet size={16} className="text-amber-400" />
          <h3 className="font-heading font-semibold text-white text-sm">Finance</h3>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-medium border border-amber-500/20">SAR</span>
      </div>

      {/* Balance */}
      <div>
        <p className="text-xs text-slate-500 mb-0.5">Monthly Balance</p>
        <p className="font-heading font-bold text-2xl text-white">{formatSAR(BALANCE)}</p>
        <div className="flex items-center gap-1 text-red-400 mt-0.5">
          <TrendingUp size={12} />
          <span className="text-xs">+8.2% spending vs last month</span>
        </div>
      </div>

      {/* Spent today */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500 text-xs">Today</span>
        <span className="font-medium text-white">{formatSAR(todaySpend)}</span>
      </div>

      {/* Budget progress */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Budget used</span>
          <span className={spentPct > 80 ? 'text-red-400' : 'text-accent-green'}>{spentPct}%</span>
        </div>
        <div className="progress-bar-track">
          <div
            className={`h-full rounded-full transition-all duration-700 ${spentPct > 80 ? 'progress-red' : 'progress-amber'}`}
            style={{ width: `${spentPct}%` }}
          />
        </div>
      </div>

      {/* Mini bar chart */}
      <div className="h-16">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={SPENDING_DATA} barSize={12}>
            <Bar dataKey="amount" radius={[3, 3, 0, 0]}>
              {SPENDING_DATA.map((entry, i) => (
                <Cell key={i} fill={i === 5 ? '#22c55e' : 'rgba(255,255,255,0.08)'} />
              ))}
            </Bar>
            <Tooltip
              contentStyle={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 11 }}
              formatter={(v) => [`${v} SAR`, 'Spent']}
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-slate-600 text-center">Tap to see full breakdown →</p>
    </div>
  )
}
